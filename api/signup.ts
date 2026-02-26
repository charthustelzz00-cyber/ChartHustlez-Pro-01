import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email } = req.body;

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Sanitize inputs
    const sanitizedName = name.trim().slice(0, 255);
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 255);

    // Insert into Supabase (RLS allows anon inserts)
    const { data, error } = await supabase
      .from("signups")
      .insert({ name: sanitizedName, email: sanitizedEmail })
      .select("id, name, email, created_at")
      .single();

    if (error) {
      // Handle duplicate email (Postgres unique constraint code)
      if (error.code === "23505") {
        return res.status(409).json({
          error: "This email is already registered",
        });
      }
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(201).json({
      success: true,
      message: "Welcome to ChartHustlez!",
      signup: data,
    });
  } catch (error: unknown) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
