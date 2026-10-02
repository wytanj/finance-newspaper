import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { MarketTape } from "@/components/MarketTape";
import { HeadlineCard } from "@/components/HeadlineCard";
import { WireList } from "@/components/WireList";
import { RoboticsSection } from "@/components/RoboticsSection";
import { ActionablesSection } from "@/components/ActionablesSection";
import { PaperFooter } from "@/components/PaperFooter";
import { loadArchivedDaily, loadArchiveIndex, loadVoices } from "@/lib/loadEdition";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const index = await loadArchiveIndex();
    return index.daily.map((e) => ({ date: e.date }));
  } catch {
    return [];
  }
}

export default async function ArchivedDailyPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const [edition, voicesFile] = await Promise.all([loadArchivedDaily(date), loadVoices()]);
  if (!edition) notFound();
  const voices = [...voicesFile.seeds, ...voicesFile.expanded.filter((v) => v.active !== false)];

  return (
    <main>
      <Masthead
        title={edition.masthead}
        tagline={edition.tagline}
        dateLabel={edition.date}
        generatedAt={edition.generatedAt}
        status={edition.status}
        active="archive"
        archiveBadge={`Past daily · ${edition.date}`}
      />
      <p className="lead">{edition.lead}</p>
      <ActionablesSection items={edition.actionables} />
      <MarketTape markets={edition.markets} />
      <div className="layout-2">
        <section aria-label="Headlines">
          <div className="section-head">
            <h2>From the voices</h2>
            <p className="section-sub">Distilled · attributed · linked</p>
          </div>
          <div className="headlines">
            {edition.headlines.map((h, i) => (
              <HeadlineCard key={h.id} headline={h} featured={i === 0} />
            ))}
          </div>
        </section>
        <WireList items={edition.wire} />
      </div>
      <RoboticsSection block={edition.robotics} mode="daily" />
      <PaperFooter note={edition.sourcesNote} voices={voices} />
    </main>
  );
}
