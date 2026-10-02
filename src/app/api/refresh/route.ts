import { NextRequest, NextResponse } from "next/server";
import { fetchYahooMarkets } from "@/lib/markets";

/** Manual / diagnostic refresh — returns fresh Yahoo quotes without writing. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }
  const markets = await fetchYahooMarkets();
  return NextResponse.json({
    ok: true,
    asOfSgt: new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" }) + " SGT",
    markets,
  });
}
