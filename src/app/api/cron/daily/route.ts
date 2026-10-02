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
  const dailyPath = path.join(dataDir, "daily.json");
  const marketsPath = path.join(dataDir, "markets.json");

  const nowSgt = new Date().toLocaleString("en-CA", {
    timeZone: "Asia/Singapore",
    hour12: false,
  });
  const dateSgt = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" });

  let daily: Record<string, unknown> = {};
  try {
    daily = JSON.parse(await readFile(dailyPath, "utf8"));
  } catch {
    daily = { edition: "daily", headlines: [], wire: [] };
  }

  daily.markets = markets;
  daily.date = dateSgt;
  daily.generatedAt = new Date().toISOString();
  daily.publishedAt = `${dateSgt}T07:00:00+08:00`;
  daily.status = "live-markets";
  daily.timezone = "Asia/Singapore";

  // Persist markets JSON for debugging; daily for pages.
  // On Vercel serverless the filesystem is ephemeral — prefer Vercel KV later.
  // For static/git-backed deploys, commit updates from a box refresh script.
  try {
    await writeFile(marketsPath, JSON.stringify(Object.fromEntries(markets.map((m) => [m.key, m])), null, 2));
    await writeFile(dailyPath, JSON.stringify(daily, null, 2));
  } catch (e) {
    console.warn("write skipped (likely read-only FS)", e);
  }

  return NextResponse.json({
    ok: true,
    edition: "daily",
    dateSgt,
    refreshedAtLocal: nowSgt + " SGT",
    markets: markets.map((m) => ({ key: m.key, price: m.price, changePct: m.changePct })),
    note:
      "Markets refreshed from Yahoo. Headlines stay seeded unless refreshed via box X tooling / scripts/refresh-edition.mjs",
  });
}
