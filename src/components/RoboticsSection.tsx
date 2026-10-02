import type { RoboticsBlock } from "@/lib/types";
import { HeadlineCard } from "./HeadlineCard";
import { WireList } from "./WireList";
import { MarketTape } from "./MarketTape";

export function RoboticsSection({
  block,
  mode,
}: {
  block: RoboticsBlock;
  mode: "daily" | "weekly";
}) {
  const headlines = block.headlines ?? [];
  const themes = block.themes ?? [];
  const hasHeadlines = headlines.length > 0;
  const hasThemes = themes.length > 0;

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

      {block.markets && block.markets.length > 0 ? (
        <MarketTape
          markets={block.markets}
          title="Robotics tape"
          subtitle="ISRG · BOTZ · NVDA · delayed Yahoo"
          ariaLabel="Robotics numbers"
        />
      ) : null}

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

        <WireList
          items={block.wire}
          title="Robotics wire"
          subtitle="X News · humanoids · factory · hands"
          ariaLabel="Robotics wire"
        />
      </div>
    </section>
  );
}
