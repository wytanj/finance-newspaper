import { Masthead } from "@/components/Masthead";
import { MarketTape } from "@/components/MarketTape";
import { HeadlineCard } from "@/components/HeadlineCard";
import { WireList } from "@/components/WireList";
import { PaperFooter } from "@/components/PaperFooter";
import { loadDaily, loadVoices } from "@/lib/loadEdition";

export const dynamic = "force-dynamic";

export default async function DailyPage() {
  const [daily, voicesFile] = await Promise.all([loadDaily(), loadVoices()]);
  const voices = [...voicesFile.seeds, ...voicesFile.expanded.filter((v) => v.active !== false)];

  return (
    <main>
      <Masthead
        title={daily.masthead}
        tagline={daily.tagline}
        dateLabel={daily.date}
        generatedAt={daily.generatedAt}
        status={daily.status}
        active="daily"
      />
      <p className="lead">{daily.lead}</p>
      <MarketTape markets={daily.markets} />
      <div className="layout-2">
        <section aria-label="Headlines">
          <div className="section-head">
            <h2>From the voices</h2>
            <p className="section-sub">Distilled · attributed · linked</p>
          </div>
          <div className="headlines">
            {daily.headlines.map((h, i) => (
              <HeadlineCard key={h.id} headline={h} featured={i === 0} />
            ))}
          </div>
        </section>
        <WireList items={daily.wire} />
      </div>
      <PaperFooter note={daily.sourcesNote} voices={voices} />
    </main>
  );
}
