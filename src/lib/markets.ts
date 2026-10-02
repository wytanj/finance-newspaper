/**
 * Public Yahoo Finance chart endpoint (no API key).
 * Used by cron / refresh routes. Label every number with source.
 */

export type FetchedMarket = {
  key: string;
  label: string;
  symbol: string;
  price: number | null;
  changePct: number | null;
  spark: number[];
  currency?: string;
  asOf?: string;
  source: string;
};

const TICKERS: { key: string; label: string; symbol: string }[] = [
  { key: "SPX", label: "S&P 500", symbol: "^GSPC" },
  { key: "DXY", label: "US Dollar (DXY)", symbol: "DX-Y.NYB" },
  { key: "US10Y", label: "US 10Y Yield", symbol: "^TNX" },
  { key: "BTC", label: "Bitcoin", symbol: "BTC-USD" },
  { key: "GOLD", label: "Gold", symbol: "GC=F" },
  { key: "OIL", label: "WTI Crude", symbol: "CL=F" },
  { key: "SGD", label: "USD/SGD", symbol: "SGD=X" },
];

export const ROBOTICS_TICKERS: { key: string; label: string; symbol: string }[] = [
  { key: "ISRG", label: "Intuitive Surgical", symbol: "ISRG" },
  { key: "BOTZ", label: "Global X Robotics", symbol: "BOTZ" },
  { key: "NVDA", label: "NVIDIA", symbol: "NVDA" },
];

export async function fetchYahooMarkets(): Promise<FetchedMarket[]> {
  const out: FetchedMarket[] = [];
  for (const t of TICKERS) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        t.symbol
      )}?range=5d&interval=1d`;
      const res = await fetch(url, {
        headers: { "User-Agent": "JT-Finance-Paper/1.0" },
        next: { revalidate: 0 },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const result = data?.chart?.result?.[0];
      const meta = result?.meta ?? {};
      const closes: number[] = (result?.indicators?.quote?.[0]?.close ?? []).filter(
        (c: number | null) => c != null
      );
      const last: number | null =
        meta.regularMarketPrice ?? (closes.length ? closes[closes.length - 1] : null);
      const prev: number | null =
        meta.chartPreviousClose ?? (closes.length > 1 ? closes[closes.length - 2] : null);
      const changePct =
        last != null && prev != null && prev !== 0 ? ((last - prev) / prev) * 100 : null;
      const ts = meta.regularMarketTime ?? result?.timestamp?.at?.(-1);
      out.push({
        key: t.key,
        label: t.label,
        symbol: t.symbol,
        price: last != null ? Number(last) : null,
        changePct: changePct != null ? Number(changePct.toFixed(3)) : null,
        spark: closes.slice(-5).map((c) => Number(c.toFixed(4))),
        currency: meta.currency,
        asOf: ts
          ? new Date(ts * 1000).toISOString()
          : new Date().toISOString(),
        source: "Yahoo Finance",
      });
    } catch (e) {
      out.push({
        key: t.key,
        label: t.label,
        symbol: t.symbol,
        price: null,
        changePct: null,
        spark: [],
        source: "Yahoo Finance",
        asOf: new Date().toISOString(),
      });
      console.error("market fetch failed", t.key, e);
    }
  }
  return out;
}
