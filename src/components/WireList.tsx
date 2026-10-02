import type { WireItem } from "@/lib/types";

export function WireList({
  items,
  title = "Macro wire",
  subtitle = "X News summaries · click through to story",
  ariaLabel = "Macro wire",
}: {
  items: WireItem[];
  title?: string;
  subtitle?: string;
  ariaLabel?: string;
}) {
  return (
    <section className="wire" aria-label={ariaLabel}>
      <div className="section-head">
        <h2>{title}</h2>
        <p className="section-sub">{subtitle}</p>
      </div>
      <ul className="wire-list">
        {items.map((n) => (
          <li key={n.id}>
            <a href={n.url} target="_blank" rel="noopener noreferrer">
              <strong>{n.title}</strong>
              <span className="wire-sum">{n.summary}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
