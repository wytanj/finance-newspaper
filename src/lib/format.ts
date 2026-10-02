export function formatPrice(key: string, price: number | null): string {
  if (price == null || Number.isNaN(price)) return "—";
  if (key === "US10Y") return `${price.toFixed(3)}%`;
  if (key === "BTC") return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (key === "SPX" || key === "GOLD" || key === "OIL" || key === "ISRG" || key === "NVDA" || key === "TSLA")
    return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (key === "BOTZ") return price.toFixed(2);
  if (key === "DXY" || key === "SGD") return price.toFixed(4);
  return price.toLocaleString("en-US");
}

export function formatChange(pct: number | null): string {
  if (pct == null || Number.isNaN(pct)) return "—";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function changeClass(pct: number | null): string {
  if (pct == null || Number.isNaN(pct) || pct === 0) return "chg-flat";
  return pct > 0 ? "chg-up" : "chg-down";
}

/** Format an ISO timestamp into Asia/Singapore display. */
export function formatSgt(iso: string): string {
  try {
    const d = new Date(iso);
    return (
      new Intl.DateTimeFormat("en-SG", {
        timeZone: "Asia/Singapore",
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d) + " SGT"
    );
  } catch {
    return iso;
  }
}

export function formatDateLong(isoDate: string): string {
  try {
    const d = new Date(isoDate + "T12:00:00+08:00");
    return new Intl.DateTimeFormat("en-SG", {
      timeZone: "Asia/Singapore",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return isoDate;
  }
}
