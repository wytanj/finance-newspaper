import Link from "next/link";
import { formatDateLong, formatSgt } from "@/lib/format";

type Props = {
  title: string;
  tagline: string;
  dateLabel: string;
  generatedAt: string;
  status: string;
  active: "daily" | "weekly";
};

export function Masthead({ title, tagline, dateLabel, generatedAt, status, active }: Props) {
  return (
    <header className="masthead">
      <div className="masthead-top">
        <p className="eyebrow">{tagline}</p>
        <p className="meta">
          Generated {formatSgt(generatedAt)} · <span className="status">{status}</span>
        </p>
      </div>
      <div className="masthead-main">
        <h1 className="paper-title">
          <Link href="/">{title}</Link>
        </h1>
        <p className="paper-date">{formatDateLong(dateLabel)}</p>
      </div>
      <nav className="tabs" aria-label="Edition">
        <Link href="/" className={active === "daily" ? "tab active" : "tab"}>
          Daily
        </Link>
        <Link href="/weekly" className={active === "weekly" ? "tab active" : "tab"}>
          Weekly
        </Link>
      </nav>
    </header>
  );
}
