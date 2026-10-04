#!/usr/bin/env node
/**
 * Box-side helper: refresh Yahoo quotes into data/markets.json + daily/weekly.
 * Also archives the previous current edition when the date / ISO week rolls.
 * Usage: node scripts/refresh-markets.mjs
 */
import { writeFile, readFile, mkdir, access } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data");
const archiveDir = path.join(dataDir, "archive");

const TICKERS = [
  { key: "SPX", label: "S&P 500", symbol: "^GSPC" },
  { key: "DXY", label: "US Dollar (DXY)", symbol: "DX-Y.NYB" },
  { key: "US10Y", label: "US 10Y Yield", symbol: "^TNX" },
  { key: "BTC", label: "Bitcoin", symbol: "BTC-USD" },
  { key: "GOLD", label: "Gold", symbol: "GC=F" },
  { key: "OIL", label: "WTI Crude", symbol: "CL=F" },
  { key: "SGD", label: "USD/SGD", symbol: "SGD=X" },
];

const ROBOTICS_TICKERS = [
  { key: "ISRG", label: "Intuitive Surgical", symbol: "ISRG" },
  { key: "BOTZ", label: "Global X Robotics", symbol: "BOTZ" },
  { key: "NVDA", label: "NVIDIA", symbol: "NVDA" },
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

async function fetchAll(list) {
  const markets = [];
  for (const t of list) {
    try {
      markets.push(await fetchOne(t));
      console.log(t.key, markets.at(-1).price, markets.at(-1).changePct);
    } catch (e) {
      console.error(t.key, e.message);
    }
  }
  return markets;
}

function isoWeekIdFromDate(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((dt.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${dt.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function loadIndex() {
  const p = path.join(archiveDir, "index.json");
  if (!(await exists(p))) {
    return { updatedAt: new Date().toISOString(), daily: [], weekly: [] };
  }
  return JSON.parse(await readFile(p, "utf8"));
}

async function saveIndex(index) {
  index.updatedAt = new Date().toISOString();
  index.daily = [...index.daily].sort((a, b) => (a.date < b.date ? 1 : -1));
  index.weekly = [...index.weekly].sort((a, b) => (a.id < b.id ? 1 : -1));
  await writeFile(path.join(archiveDir, "index.json"), JSON.stringify(index, null, 2) + "\n");
}

async function archiveDailyIfNeeded(daily, newDate) {
  const oldDate = daily.date;
  if (!oldDate || oldDate === newDate) return null;
  await mkdir(path.join(archiveDir, "daily"), { recursive: true });
  const dest = path.join(archiveDir, "daily", `${oldDate}.json`);
  if (await exists(dest)) {
    console.log("archive daily exists", oldDate);
    return oldDate;
  }
  const copy = { ...daily, status: daily.status?.includes("archived") ? daily.status : `${daily.status || "live"}+archived` };
  await writeFile(dest, JSON.stringify(copy, null, 2) + "\n");
  const index = await loadIndex();
  if (!index.daily.some((e) => e.date === oldDate)) {
    index.daily.push({
      date: oldDate,
      masthead: copy.masthead || "JT Finance Paper",
      tagline: copy.tagline || "",
      lead: String(copy.lead || "").slice(0, 160),
      status: copy.status,
      path: `archive/daily/${oldDate}.json`,
    });
    await saveIndex(index);
  }
  console.log("archived daily", oldDate);
  return oldDate;
}

async function archiveWeeklyIfNeeded(weekly, newDate) {
  const oldEnd = weekly.weekEnd;
  const oldOf = weekly.weekOf || oldEnd;
  if (!oldEnd) return null;
  const oldId = isoWeekIdFromDate(oldOf);
  const newId = isoWeekIdFromDate(newDate);
  if (oldId === newId) return null;
  await mkdir(path.join(archiveDir, "weekly"), { recursive: true });
  const dest = path.join(archiveDir, "weekly", `${oldId}.json`);
  const copy = {
    ...weekly,
    status: weekly.status?.includes("archived") ? weekly.status : `${weekly.status || "live"}+archived`,
  };
  if (await exists(dest)) {
    const existing = JSON.parse(await readFile(dest, "utf8"));
    const existingEnd = existing.weekEnd || "";
    const incomingEnd = weekly.weekEnd || "";
    if (incomingEnd > existingEnd) {
      // Keep the earlier snapshot (do not delete history) and let the later
      // edition of this ISO week become the canonical archive file.
      const side = path.join(archiveDir, "weekly", `${oldId}.prior-${existingEnd}.json`);
      if (!(await exists(side))) {
        await writeFile(side, JSON.stringify(existing, null, 2) + "\n");
        console.log("preserved earlier weekly snapshot", oldId, existingEnd);
      }
    } else {
      console.log("archive weekly exists", oldId);
      return oldId;
    }
  }
  await writeFile(dest, JSON.stringify(copy, null, 2) + "\n");
  const index = await loadIndex();
  const entry = {
    id: oldId,
    weekOf: copy.weekOf,
    weekEnd: copy.weekEnd,
    masthead: copy.masthead || "JT Finance Paper",
    tagline: copy.tagline || "",
    lead: String(copy.lead || "").slice(0, 160),
    status: copy.status,
    path: `archive/weekly/${oldId}.json`,
  };
  const at = index.weekly.findIndex((e) => e.id === oldId);
  if (at === -1) index.weekly.push(entry);
  else if ((index.weekly[at].weekEnd || "") < (copy.weekEnd || "")) index.weekly[at] = entry;
  await saveIndex(index);
  console.log("archived weekly", oldId);
  return oldId;
}

/** Ensure actionables array exists so future seed edits have a slot. */
function ensureActionables(j) {
  if (!Array.isArray(j.actionables)) j.actionables = [];
}

const markets = await fetchAll(TICKERS);
const roboticsMarkets = await fetchAll(ROBOTICS_TICKERS);

const byKey = Object.fromEntries(
  [...markets, ...roboticsMarkets].map((m) => [m.key, m])
);
await writeFile(path.join(dataDir, "markets.json"), JSON.stringify(byKey, null, 2));

const dateSgt = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" });
const generatedAt = new Date().toISOString();

for (const file of ["daily.json", "weekly.json"]) {
  const p = path.join(dataDir, file);
  const j = JSON.parse(await readFile(p, "utf8"));
  ensureActionables(j);
  if (file === "daily.json") {
    await archiveDailyIfNeeded(j, dateSgt);
    j.markets = markets;
    j.date = dateSgt;
  } else {
    await archiveWeeklyIfNeeded(j, dateSgt);
    j.marketsSnapshot = markets;
    j.weekEnd = dateSgt;
  }
  if (j.robotics) {
    j.robotics.markets = roboticsMarkets;
  }
  j.generatedAt = generatedAt;
  j.status = "live-markets";
  await writeFile(p, JSON.stringify(j, null, 2));
}
console.log("updated daily + weekly @", dateSgt, "SGT");
