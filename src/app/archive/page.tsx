import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { PaperFooter } from "@/components/PaperFooter";
import { formatDateLong } from "@/lib/format";
import { loadArchiveIndex, loadDaily, loadVoices } from "@/lib/loadEdition";

export const dynamic = "force-dynamic";

export default async function ArchiveIndexPage() {
  const [index, daily, voicesFile] = await Promise.all([
    loadArchiveIndex(),
    loadDaily(),
    loadVoices(),
  ]);
  const voices = [...voicesFile.seeds, ...voicesFile.expanded.filter((v) => v.active !== false)];

  return (
    <main>
      <Masthead
        title={daily.masthead}
        tagline="Past editions · daily + weekly archive"
        dateLabel={daily.date}
        generatedAt={index.updatedAt}
        status="archive"
        active="archive"
      />
      <p className="lead">
        Browse prior daily and weekly issues. Current editions stay on{" "}
        <Link href="/">Daily</Link> and <Link href="/weekly">Weekly</Link>; older copies live here
        as static JSON under <code>data/archive/</code>.
      </p>

      <div className="archive-layout">
        <section aria-label="Past daily editions" className="archive-panel">
          <div className="section-head">
            <h2>Daily</h2>
            <p className="section-sub">{index.daily.length} archived</p>
          </div>
          <ul className="archive-list">
            {index.daily.map((e) => (
              <li key={e.date}>
                <Link href={`/archive/daily/${e.date}`} className="archive-row">
                  <span className="archive-date">{formatDateLong(e.date)}</span>
                  <span className="archive-lead">{e.lead}</span>
                  <span className="archive-status">{e.status}</span>
                </Link>
              </li>
            ))}
          </ul>
          {index.daily.length === 0 ? (
            <p className="archive-empty">No past dailies yet — refresh will archive as dates roll.</p>
          ) : null}
        </section>

        <section aria-label="Past weekly editions" className="archive-panel">
          <div className="section-head">
            <h2>Weekly</h2>
            <p className="section-sub">{index.weekly.length} archived</p>
          </div>
          <ul className="archive-list">
            {index.weekly.map((e) => (
              <li key={e.id}>
                <Link href={`/archive/weekly/${e.id}`} className="archive-row">
                  <span className="archive-date">
                    {e.id} · {e.weekOf} → {e.weekEnd}
                  </span>
                  <span className="archive-lead">{e.lead}</span>
                  <span className="archive-status">{e.status}</span>
                </Link>
              </li>
            ))}
          </ul>
          {index.weekly.length === 0 ? (
            <p className="archive-empty">No past weeklies yet — Sunday refresh will archive prior weeks.</p>
          ) : null}
        </section>
      </div>

      <PaperFooter
        note="Archive is git-backed JSON (no paid DB). On each current update, refresh scripts copy the previous edition into data/archive/ if missing."
        voices={voices}
      />
    </main>
  );
}
