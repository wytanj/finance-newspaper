# JT Finance Paper

Personal **daily + weekly** macro newspaper for Jeremy Tan (`wytanj`).  
Full-width newspaper UI (comfortable on a 34" monitor). Timezone **Asia/Singapore**.

## Open

| Edition | URL |
|--------|-----|
| **Daily** | `/` — actionables, key numbers, voice headlines, macro wire, **robotics** beat |
| **Weekly** | `/weekly` — actionables, week-in-themes, market snapshot, **robotics** digest |
| **Past editions** | `/archive` — browse prior daily + weekly issues |

Local: `npm run dev` → http://localhost:3000  
Dogbot one-liner: open the site root for today’s paper; `/weekly` for the Sunday digest.

## Voices

Edit **`data/voices.json`** to add/remove handles. Seeds:

| Handle | Name |
|--------|------|
| `@LynAldenContact` | Lyn Alden |
| `@PunterJeff` | Jeff Walton (Strive CRO; old `@JeffWalton_` suspended) |
| `@ColeMacro` | Matt Cole (Strive CEO) |
| `@JoshMandell6` | Josh Mandell (rates / bonds) |

Expanded: `@LukeGromen`, `@RaoulGMI`, `@jessefelder` (+ `@MacroAlf` marked inactive).

### Robotics cohort (tagged `robotics`)

| Handle | Name |
|--------|------|
| `@BostonDynamics` | Boston Dynamics |
| `@adcock_brett` | Brett Adcock (Figure CEO) |
| `@DrJimFan` | Jim Fan (NVIDIA robotics) |
| `@IEEESpectrum` | IEEE Spectrum |

Expanded: `@Figure_robot`, `@Apptronik`, `@chelseabfinn`, `@physical_int`, `@clonerobotics`, `@UnitreeRobotics`, `@therobotreport`, `@1x_tech`, `@agilityrobotics`, `@SkildAI`.

Headlines are distilled offline (box X tooling) into `data/daily.json` / `data/weekly.json` with **attribution + x.com links**. The site does not post or DM.


## Actionables

Each edition carries an optional `actionables` array:

```json
{ "kind": "watch" | "move" | "decision", "title": "...", "detail": "...", "related": "optional" }
```

Rendered as a full-width **Actionables** band (watchlist / next moves / decisions) on daily, weekly, and archived issues. Seed or edit in `data/daily.json` / `data/weekly.json` (same box-update pattern as headlines). `scripts/refresh-markets.mjs` preserves the array when refreshing quotes.

## Past editions (archive)

Git-backed static archive (no paid DB):

- `data/archive/daily/YYYY-MM-DD.json`
- `data/archive/weekly/YYYY-Www.json` (ISO week)
- `data/archive/index.json` — listing for `/archive`

Routes: `/archive`, `/archive/daily/[date]`, `/archive/weekly/[id]`.  
On date/week roll, `scripts/refresh-markets.mjs` copies the previous current edition into the archive if missing.

## Markets

Numbers for **SPX, DXY, US10Y, BTC, gold, WTI, USD/SGD** via **Yahoo Finance** public chart API (delayed). Robotics tape: **ISRG, BOTZ, NVDA**. Sparklines are last ~5 daily closes.

Refresh on the box:

```bash
node scripts/refresh-markets.mjs
```

Or hit `/api/refresh` (protect with `CRON_SECRET` in production).

## Cron (Vercel)

`vercel.json`:

| Job | Schedule (UTC) | SGT |
|-----|----------------|-----|
| `/api/cron/daily` | `0 23 * * *` | **07:00 daily** |
| `/api/cron/weekly` | `0 12 * * 0` | **Sunday 20:00** |

Set env **`CRON_SECRET`** and configure Vercel Cron auth (`Authorization: Bearer …`).

**v1 behavior:** cron refreshes **market quotes**. Headline distill stays **seeded / box-updated** (X API on Vercel needs a bearer token you choose to add later; Finance MCP was not available).

On Vercel’s read-only FS, prefer re-deploying after `scripts/refresh-markets.mjs`, or wire Vercel KV later. Cron still returns fresh Yahoo JSON for monitoring.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind v4  
- Static JSON editions under `data/`  
- Simple SVG sparklines (no chart vendor)

## Deploy

```bash
npm i
npm run build
vercel --prod   # or link GitHub repo in Vercel dashboard
```

## Disclaimer

Not investment advice. Attribution footers link to source posts; verify before acting.
