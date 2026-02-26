import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  // Auth check
  const authKey = req.query.key || req.headers["x-insights-key"];
  const expectedKey = process.env.INSIGHTS_SECRET_KEY;
  if (expectedKey && authKey !== expectedKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const yesterdayStart = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const yesterdayEnd = todayStart;
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const prevWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const prevMonthStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

    // Total signups
    const { count: total } = await supabaseAdmin
      .from("signups")
      .select("*", { count: "exact", head: true });

    // Today
    const { count: today } = await supabaseAdmin
      .from("signups")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart);

    // Yesterday
    const { count: yesterday } = await supabaseAdmin
      .from("signups")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterdayStart.toISOString())
      .lt("created_at", yesterdayEnd);

    // This week
    const { count: thisWeek } = await supabaseAdmin
      .from("signups")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo);

    // Previous week (for growth calc)
    const { count: prevWeek } = await supabaseAdmin
      .from("signups")
      .select("*", { count: "exact", head: true })
      .gte("created_at", prevWeekStart)
      .lt("created_at", weekAgo);

    // This month
    const { count: thisMonth } = await supabaseAdmin
      .from("signups")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthAgo);

    // Previous month
    const { count: prevMonth } = await supabaseAdmin
      .from("signups")
      .select("*", { count: "exact", head: true })
      .gte("created_at", prevMonthStart)
      .lt("created_at", monthAgo);

    // Latest 50 signups
    const { data: latestSignups } = await supabaseAdmin
      .from("signups")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    // All signups from last 30 days for daily breakdown
    const { data: recentSignups } = await supabaseAdmin
      .from("signups")
      .select("created_at")
      .gte("created_at", monthAgo)
      .order("created_at", { ascending: true });

    // Build daily breakdown
    const dailyMap: Record<string, number> = {};
    (recentSignups || []).forEach((row: { created_at: string }) => {
      const date = new Date(row.created_at).toISOString().split("T")[0];
      dailyMap[date] = (dailyMap[date] || 0) + 1;
    });

    // Fill in missing days with 0
    const dailyBreakdown: { date: string; count: number }[] = [];
    const startDate = new Date(monthAgo);
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      dailyBreakdown.push({ date: dateStr, count: dailyMap[dateStr] || 0 });
    }

    // Hourly breakdown for today
    const { data: todaySignups } = await supabaseAdmin
      .from("signups")
      .select("created_at")
      .gte("created_at", todayStart)
      .order("created_at", { ascending: true });

    const hourlyMap: Record<number, number> = {};
    for (let h = 0; h < 24; h++) hourlyMap[h] = 0;
    (todaySignups || []).forEach((row: { created_at: string }) => {
      const hour = new Date(row.created_at).getHours();
      hourlyMap[hour] = (hourlyMap[hour] || 0) + 1;
    });
    const hourlyBreakdown = Object.entries(hourlyMap).map(([hour, count]) => ({
      hour: parseInt(hour),
      label: `${parseInt(hour).toString().padStart(2, "0")}:00`,
      count,
    }));

    // Growth rates
    const weeklyGrowth = prevWeek && prevWeek > 0
      ? (((thisWeek || 0) - prevWeek) / prevWeek * 100).toFixed(1)
      : null;
    const monthlyGrowth = prevMonth && prevMonth > 0
      ? (((thisMonth || 0) - prevMonth) / prevMonth * 100).toFixed(1)
      : null;

    // Peak day
    let peakDay = { date: "N/A", count: 0 };
    dailyBreakdown.forEach(d => {
      if (d.count > peakDay.count) peakDay = d;
    });

    // Average per day (last 30 days)
    const totalLast30 = dailyBreakdown.reduce((sum, d) => sum + d.count, 0);
    const avgPerDay = dailyBreakdown.length > 0
      ? (totalLast30 / dailyBreakdown.length).toFixed(1)
      : "0";

    return res.status(200).json({
      success: true,
      insights: {
        total: total || 0,
        today: today || 0,
        yesterday: yesterday || 0,
        thisWeek: thisWeek || 0,
        prevWeek: prevWeek || 0,
        thisMonth: thisMonth || 0,
        prevMonth: prevMonth || 0,
        weeklyGrowth,
        monthlyGrowth,
        peakDay,
        avgPerDay,
        dailyBreakdown,
        hourlyBreakdown,
        latestSignups: latestSignups || [],
      },
      generatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("Admin insights error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
