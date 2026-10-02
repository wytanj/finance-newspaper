import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { MarketTape } from "@/components/MarketTape";
import { WireList } from "@/components/WireList";
import { RoboticsSection } from "@/components/RoboticsSection";
import { ActionablesSection } from "@/components/ActionablesSection";
import { PaperFooter } from "@/components/PaperFooter";
import { loadArchivedWeekly, loadArchiveIndex, loadVoices } from "@/lib/loadEdition";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const index = await loadArchiveIndex();
    return index.weekly.map((e) => ({ id: e.id }));
  } catch {
    return [];
  }
}

export default async function ArchivedWeeklyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [edition, voicesFile] = await Promise.all([loadArchivedWeekly(id), loadVoices()]);
  if (!edition) notFound();
  const voices = [...voicesFile.seeds, ...voicesFile.expanded.filter((v) => v.active !== false)];

  return (
    <main>
      <Masthead
        title={edition.masthead}
        tagline={edition.tagline}
        dateLabel={edition.weekEnd}
        generatedAt={edition.generatedAt}
        status={edition.status}
        active="archive"
        archiveBadge={`Past weekly · ${id}`}
      />
      <p className="lead">{edition.lead}</p>
      <ActionablesSection
        items={edition.actionables}
        subtitle="Week’s decisions · watchlist · next moves · not advice"
      />
      <MarketTape markets={edition.marketsSnapshot} />
      <div className="layout-2">
        <section aria-label="Weekly themes">
          <div className="section-head">
            <h2>Week in themes</h2>
            <p className="section-sub">
              {edition.weekOf} → {edition.weekEnd} SGT
            </p>
          </div>
          <div className="themes">
            {edition.themes.map((t) => (
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
        <WireList items={edition.wire} />
      </div>
      <RoboticsSection block={edition.robotics} mode="weekly" />
      <PaperFooter note={edition.sourcesNote} voices={voices} />
    </main>
  );
}
