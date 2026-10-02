import type { Actionable, ActionableKind } from "@/lib/types";

const KIND_LABEL: Record<ActionableKind, string> = {
  watch: "Watchlist",
  move: "Next move",
  decision: "Decision",
};

const KIND_ORDER: ActionableKind[] = ["watch", "move", "decision"];

export function ActionablesSection({
  items,
  subtitle = "Not advice · scannable next moves from this edition",
}: {
  items?: Actionable[];
  subtitle?: string;
}) {
  if (!items?.length) return null;

  const grouped = KIND_ORDER.map((kind) => ({
    kind,
    items: items.filter((a) => a.kind === kind),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="actionables-band" aria-label="Actionables">
      <div className="section-head actionables-head">
        <div>
          <h2>Actionables</h2>
          <p className="section-sub">{subtitle}</p>
        </div>
        <p className="actionables-kicker">Watch · Move · Decide</p>
      </div>
      <div className="actionables-grid">
        {grouped.map((g) => (
          <div key={g.kind} className={`actionables-col kind-${g.kind}`}>
            <h3 className="actionables-col-title">{KIND_LABEL[g.kind]}</h3>
            <ul className="actionables-list">
              {g.items.map((a) => (
                <li key={`${a.kind}-${a.title}`} className={`actionable-card kind-${a.kind}`}>
                  <p className="actionable-kind">{KIND_LABEL[a.kind]}</p>
                  <h4>{a.title}</h4>
                  <p className="actionable-detail">{a.detail}</p>
                  {a.related ? <p className="actionable-related">{a.related}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
