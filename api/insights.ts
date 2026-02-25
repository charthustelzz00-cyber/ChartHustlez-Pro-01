import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Simple auth check via query param or header
  const authKey = req.query.key || req.headers["x-insights-key"];
  const expectedKey = process.env.INSIGHTS_SECRET_KEY;

  if (expectedKey && authKey !== expectedKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Total signups
    const { count: total, error: totalErr } = await supabaseAdmin
      .from("signups")
      .select("*", { count: "exact", head: true });

    if (totalErr) throw totalErr;

    // Signups today
    const { count: today, error: todayErr } = await supabaseAdmin
      .from("signups")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart);

    if (todayErr) throw todayErr;

    // Signups this week
    const { count: thisWeek, error: weekErr } = await supabaseAdmin
      .from("signups")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo);

    if (weekErr) throw weekErr;

    // Signups this month
    const { count: thisMonth, error: monthErr } = await supabaseAdmin
      .from("signups")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthAgo);

    if (monthErr) throw monthErr;

    // Latest 20 signups
    const { data: latestSignups, error: latestErr } = await supabaseAdmin
      .from("signups")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (latestErr) throw latestErr;

    // All signups from last 30 days for daily breakdown
    const { data: recentSignups, error: recentErr } = await supabaseAdmin
      .from("signups")
      .select("created_at")
      .gte("created_at", monthAgo)
      .order("created_at", { ascending: false });

    if (recentErr) throw recentErr;

    // Build daily breakdown from the data
    const dailyMap: Record<string, number> = {};
    (recentSignups || []).forEach((row: { created_at: string }) => {
      const date = new Date(row.created_at).toISOString().split("T")[0];
      dailyMap[date] = (dailyMap[date] || 0) + 1;
    });
    const dailyBreakdown = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date.localeCompare(a.date));

    return res.status(200).json({
      success: true,
      insights: {
        total: total || 0,
        today: today || 0,
        thisWeek: thisWeek || 0,
        thisMonth: thisMonth || 0,
        dailyBreakdown,
        latestSignups: latestSignups || [],
      },
    });
  } catch (error) {
    console.error("Insights error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
