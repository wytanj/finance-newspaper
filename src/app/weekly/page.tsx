import { Masthead } from "@/components/Masthead";
import { MarketTape } from "@/components/MarketTape";
import { WireList } from "@/components/WireList";
import { RoboticsSection } from "@/components/RoboticsSection";
import { ActionablesSection } from "@/components/ActionablesSection";
import { PaperFooter } from "@/components/PaperFooter";
import { isoWeekIdFromDate, loadWeekly, loadVoices } from "@/lib/loadEdition";

export const dynamic = "force-dynamic";

export default async function WeeklyPage() {
  const [weekly, voicesFile] = await Promise.all([loadWeekly(), loadVoices()]);
  const voices = [...voicesFile.seeds, ...voicesFile.expanded.filter((v) => v.active !== false)];

  return (
    <main>
      <Masthead
        title={weekly.masthead}
        tagline={weekly.tagline}
        dateLabel={weekly.weekEnd}
        generatedAt={weekly.generatedAt}
        status={weekly.status}
        active="weekly"
      />
      <p className="lead">{weekly.lead}</p>
      <ActionablesSection
        items={weekly.actionables}
        subtitle="Week’s decisions · watchlist · next moves · not advice"
      />
      <MarketTape markets={weekly.marketsSnapshot} />
      <div className="layout-2">
        <section aria-label="Weekly themes">
          <div className="section-head">
            <h2>Week in themes</h2>
            <p className="section-sub">
              {isoWeekIdFromDate(weekly.weekOf)} · {weekly.weekOf} → {weekly.weekEnd} SGT
            </p>
          </div>
          <div className="themes">
            {weekly.themes.map((t) => (
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
        <WireList items={weekly.wire} />
      </div>
      <RoboticsSection block={weekly.robotics} mode="weekly" />
      <PaperFooter note={weekly.sourcesNote} voices={voices} />
    </main>
  );
}
