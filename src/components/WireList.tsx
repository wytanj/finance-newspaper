import type { WireItem } from "@/lib/types";

export function WireList({ items }: { items: WireItem[] }) {
  return (
    <section className="wire" aria-label="Macro wire">
      <div className="section-head">
        <h2>Macro wire</h2>
        <p className="section-sub">X News summaries · click through to story</p>
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
