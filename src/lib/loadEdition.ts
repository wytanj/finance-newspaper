import { readFile } from "fs/promises";
import path from "path";
import type {
  ArchiveIndex,
  DailyEdition,
  WeeklyEdition,
  Voice,
} from "./types";

const dataDir = path.join(process.cwd(), "data");

async function readJson<T>(name: string): Promise<T> {
  const raw = await readFile(path.join(dataDir, name), "utf8");
  return JSON.parse(raw) as T;
}

export async function loadDaily(): Promise<DailyEdition> {
  return readJson<DailyEdition>("daily.json");
}

export async function loadWeekly(): Promise<WeeklyEdition> {
  return readJson<WeeklyEdition>("weekly.json");
}

export async function loadVoices(): Promise<{ seeds: Voice[]; expanded: Voice[] }> {
  const v = await readJson<{ seeds: Voice[]; expanded: Voice[] }>("voices.json");
  return v;
}

export async function loadArchiveIndex(): Promise<ArchiveIndex> {
  return readJson<ArchiveIndex>("archive/index.json");
}

export async function loadArchivedDaily(date: string): Promise<DailyEdition | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  try {
    return await readJson<DailyEdition>(`archive/daily/${date}.json`);
  } catch {
    return null;
  }
}

export async function loadArchivedWeekly(id: string): Promise<WeeklyEdition | null> {
  if (!/^\d{4}-W\d{2}$/.test(id)) return null;
  try {
    return await readJson<WeeklyEdition>(`archive/weekly/${id}.json`);
  } catch {
    return null;
  }
}

/** ISO week id (e.g. 2026-W40) from a YYYY-MM-DD date string. */
export function isoWeekIdFromDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  // ISO week: Thursday-based
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((dt.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${dt.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
