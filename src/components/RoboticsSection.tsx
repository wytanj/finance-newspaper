import type { RoboticsBlock, RoboticsCostItem } from "@/lib/types";
import { HeadlineCard } from "./HeadlineCard";
import { WireList } from "./WireList";
import { MarketTape } from "./MarketTape";
import { RoboticsCard } from "./RoboticsCard";

function CostStrip({ items, note }: { items: RoboticsCostItem[]; note?: string }) {
  return (
    <section className="cost-strip" aria-label="Cost to try">
      <p className="cost-strip-title">Cost to try</p>
      <ul className="cost-items">
        {items.map((c, i) => (
          <li key={c.name} className="cost-item">
            <span className="cost-name">{c.name}</span>
            <span className="cost-range">
              {c.currency === "USD" ? "US$" : `${c.currency} `}
              {c.range}
              <sup className="cost-ref">{i + 1}</sup>
            </span>
            {c.note ? <span className="cost-note">{c.note}</span> : null}
          </li>
        ))}
      </ul>
      <ol className="cost-sources">
        {items.map((c, i) => (
          <li key={c.name}>
            <span className="cost-src-num">{i + 1}</span>
            {c.sourceUrl ? (
              <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">
                {c.sourceLabel ?? c.sourceUrl}
              </a>
            ) : (
              <span>{c.sourceLabel ?? "Source pending"}</span>
            )}
          </li>
        ))}
      </ol>
      {note ? <p className="cost-footnote">{note}</p> : null}
    </section>
  );
}

export function RoboticsSection({
  block,
  mode,
}: {
  block: RoboticsBlock;
  mode: "daily" | "weekly";
}) {
  const bands = (block.bands ?? []).filter((b) => b.cards.length > 0);
  const headlines = block.headlines ?? [];
  const themes = block.themes ?? [];
  const wire = block.wire ?? [];
  const hasBands = bands.length > 0;
  const hasHeadlines = headlines.length > 0;
  const hasThemes = themes.length > 0;
  const costToTry = block.costToTry ?? [];

  return (
    <section className="robotics-band" aria-label="Robotics">
      <div className="section-head robotics-head">
        <div>
          <h2>{block.masthead ?? "Robotics"}</h2>
          <p className="section-sub">
            {block.tagline ??
              (mode === "daily"
                ? "Humanoids · hands · factory AI · attributed voices"
                : "Week in robotics · attributed · linked")}
          </p>
        </div>
        <p className="robotics-kicker">First-class beat</p>
      </div>

      {block.filterNote ? <p className="robotics-filter">{block.filterNote}</p> : null}

      {block.markets && block.markets.length > 0 ? (
        <MarketTape
          markets={block.markets}
          title="Robotics tape"
          subtitle="ISRG · BOTZ · NVDA · delayed Yahoo"
          ariaLabel="Robotics numbers"
        />
      ) : null}

      {costToTry.length > 0 ? <CostStrip items={costToTry} note={block.costNote} /> : null}

      {hasBands ? (
        <div className="robo-bands">
          {bands.map((band, bi) => (
            <section key={band.id} className={`robo-band robo-band-${band.id}`} aria-label={band.title}>
              <div className="section-head robo-band-head">
                <h2>
                  <span className="robo-band-num">{bi + 1}</span>
                  {band.title}
                </h2>
                {band.subtitle ? <p className="section-sub">{band.subtitle}</p> : null}
              </div>
              <div className="robo-grid">
                {band.cards.map((c) => (
                  <RoboticsCard key={c.id} card={{ ...c, band: c.band ?? band.id }} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}

      {!hasBands && (hasHeadlines || hasThemes || wire.length > 0) ? (
        <div className="layout-2">
          {mode === "daily" && hasHeadlines ? (
            <section aria-label="Robotics headlines">
              <div className="section-head">
                <h2>From the robotics voices</h2>
                <p className="section-sub">Distilled · attributed · linked</p>
              </div>
              <div className="headlines">
                {headlines.map((h, i) => (
                  <HeadlineCard key={h.id} headline={h} featured={i === 0} />
                ))}
              </div>
            </section>
          ) : null}

          {mode === "weekly" && hasThemes ? (
            <section aria-label="Robotics themes">
              <div className="section-head">
                <h2>Robotics themes</h2>
                <p className="section-sub">Digest of the week’s physical-AI beat</p>
              </div>
              <div className="themes">
                {themes.map((t) => (
                  <article key={t.title} className="theme-card">
                    <h3>{t.title}</h3>
                    <p>{t.body}</p>
                    <p className="handles">
                      {t.handles.map((h) => (
                        <a key={h} href={`https://x.com/${h}`} target="_blank" rel="noopener noreferrer">
                          @{h}
                        </a>
                      ))}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {wire.length > 0 ? (
            <WireList
              items={wire}
              title="Robotics wire"
              subtitle="X News · humanoids · factory · hands"
              ariaLabel="Robotics wire"
            />
          ) : null}
        </div>
      ) : null}

      {hasBands && wire.length > 0 ? (
        <WireList
          items={wire}
          title="Robotics wire"
          subtitle="Also noted"
          ariaLabel="Robotics wire"
        />
      ) : null}
    </section>
  );
}
