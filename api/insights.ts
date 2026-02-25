import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "../lib/db";

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
    // Total signups count
    const totalResult = await query("SELECT COUNT(*) as total FROM signups");
    const total = parseInt(totalResult.rows[0].total, 10);

    // Signups today
    const todayResult = await query(
      "SELECT COUNT(*) as today FROM signups WHERE created_at >= CURRENT_DATE"
    );
    const today = parseInt(todayResult.rows[0].today, 10);

    // Signups this week
    const weekResult = await query(
      "SELECT COUNT(*) as this_week FROM signups WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'"
    );
    const thisWeek = parseInt(weekResult.rows[0].this_week, 10);

    // Signups this month
    const monthResult = await query(
      "SELECT COUNT(*) as this_month FROM signups WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'"
    );
    const thisMonth = parseInt(monthResult.rows[0].this_month, 10);

    // Daily signups for the last 30 days
    const dailyResult = await query(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM signups 
       WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY DATE(created_at) 
       ORDER BY date DESC`
    );

    // Latest 20 signups
    const latestResult = await query(
      "SELECT id, name, email, created_at FROM signups ORDER BY created_at DESC LIMIT 20"
    );

    return res.status(200).json({
      success: true,
      insights: {
        total,
        today,
        thisWeek,
        thisMonth,
        dailyBreakdown: dailyResult.rows,
        latestSignups: latestResult.rows,
      },
    });
  } catch (error) {
    console.error("Insights error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
