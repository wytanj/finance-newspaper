#!/usr/bin/env node
/**
 * Box-side helper: refresh Yahoo quotes into data/markets.json + daily/weekly.
 * Usage: node scripts/refresh-markets.mjs
 */
import { writeFile, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data");

const TICKERS = [
  { key: "SPX", label: "S&P 500", symbol: "^GSPC" },
  { key: "DXY", label: "US Dollar (DXY)", symbol: "DX-Y.NYB" },
  { key: "US10Y", label: "US 10Y Yield", symbol: "^TNX" },
  { key: "BTC", label: "Bitcoin", symbol: "BTC-USD" },
  { key: "GOLD", label: "Gold", symbol: "GC=F" },
  { key: "OIL", label: "WTI Crude", symbol: "CL=F" },
  { key: "SGD", label: "USD/SGD", symbol: "SGD=X" },
];

async function fetchOne(t) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(t.symbol)}?range=5d&interval=1d`;
  const res = await fetch(url, { headers: { "User-Agent": "JT-Finance-Paper/1.0" } });
  if (!res.ok) throw new Error(`${t.key} HTTP ${res.status}`);
  const data = await res.json();
  const result = data.chart.result[0];
  const meta = result.meta;
  const closes = (result.indicators.quote[0].close || []).filter((c) => c != null);
  const last = meta.regularMarketPrice ?? closes.at(-1);
  const prev = meta.chartPreviousClose ?? closes.at(-2);
  const changePct = last != null && prev ? ((last - prev) / prev) * 100 : null;
  const ts = meta.regularMarketTime ?? result.timestamp.at(-1);
  return {
    key: t.key,
    label: t.label,
    symbol: t.symbol,
    price: last != null ? Number(last) : null,
    changePct: changePct != null ? Number(changePct.toFixed(3)) : null,
    spark: closes.slice(-5).map((c) => Number(c.toFixed(4))),
    currency: meta.currency,
    asOf: new Date(ts * 1000).toISOString(),
    source: "Yahoo Finance",
  };
}

const markets = [];
for (const t of TICKERS) {
  try {
    markets.push(await fetchOne(t));
    console.log(t.key, markets.at(-1).price, markets.at(-1).changePct);
  } catch (e) {
    console.error(t.key, e.message);
  }
}

const byKey = Object.fromEntries(markets.map((m) => [m.key, m]));
await writeFile(path.join(dataDir, "markets.json"), JSON.stringify(byKey, null, 2));

const dateSgt = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" });
const generatedAt = new Date().toISOString();

for (const file of ["daily.json", "weekly.json"]) {
  const p = path.join(dataDir, file);
  const j = JSON.parse(await readFile(p, "utf8"));
  if (file === "daily.json") {
    j.markets = markets;
    j.date = dateSgt;
  } else {
    j.marketsSnapshot = markets;
    j.weekEnd = dateSgt;
  }
  j.generatedAt = generatedAt;
  j.status = "live-markets";
  await writeFile(p, JSON.stringify(j, null, 2));
}
console.log("updated daily + weekly @", dateSgt, "SGT");
