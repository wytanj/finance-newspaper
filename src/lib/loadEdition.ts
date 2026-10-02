import { readFile } from "fs/promises";
import path from "path";
import type { DailyEdition, WeeklyEdition, Voice } from "./types";

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
