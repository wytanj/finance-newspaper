import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import { fetchYahooMarkets } from "@/lib/markets";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const markets = await fetchYahooMarkets();
  const dataDir = path.join(process.cwd(), "data");
  const weeklyPath = path.join(dataDir, "weekly.json");

  const dateSgt = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" });

  let weekly: Record<string, unknown> = {};
  try {
    weekly = JSON.parse(await readFile(weeklyPath, "utf8"));
  } catch {
    weekly = { edition: "weekly", themes: [], wire: [] };
  }

  weekly.marketsSnapshot = markets;
  weekly.weekEnd = dateSgt;
  weekly.generatedAt = new Date().toISOString();
  weekly.status = "live-markets";
  weekly.timezone = "Asia/Singapore";

  try {
    await writeFile(weeklyPath, JSON.stringify(weekly, null, 2));
  } catch (e) {
    console.warn("write skipped (likely read-only FS)", e);
  }

  return NextResponse.json({
    ok: true,
    edition: "weekly",
    dateSgt,
    markets: markets.map((m) => ({ key: m.key, price: m.price, changePct: m.changePct })),
    note: "Weekly themes remain seeded until next box distill; markets snapshot refreshed.",
  });
}
