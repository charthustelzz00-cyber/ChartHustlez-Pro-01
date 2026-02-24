import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json()

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json({ error: "Name is required" }, { status: 400 })
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return Response.json(
        { error: "Valid email is required" },
        { status: 400 }
      )
    }

    const result = await query(
      "INSERT INTO signups (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at",
      [name.trim(), email.trim().toLowerCase()]
    )

    return Response.json(result.rows[0], { status: 201 })
  } catch (error) {
    // Handle duplicate email (PostgreSQL unique violation)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return Response.json(
        { error: "This email is already registered" },
        { status: 409 }
      )
    }

    console.error("Error creating signup:", error)
    return Response.json(
      { error: "Failed to create signup" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const result = await query(
      "SELECT id, name, email, created_at FROM signups ORDER BY created_at DESC"
    )
    return Response.json({ signups: result.rows, count: result.rowCount })
  } catch (err) {
    console.error("Error fetching signups:", err)
    return Response.json(
      { error: "Failed to fetch signups" },
      { status: 500 }
    )
  }
}
