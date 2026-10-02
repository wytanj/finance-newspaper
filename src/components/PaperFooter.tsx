import Link from "next/link";
import type { Voice } from "@/lib/types";

export function PaperFooter({
  note,
  voices,
}: {
  note: string;
  voices: Voice[];
}) {
  const macro = voices.filter((v) => !v.tags?.length || v.tags.includes("macro"));
  const robotics = voices.filter((v) => v.tags?.includes("robotics"));

  return (
    <footer className="paper-footer">
      <p>{note}</p>
      <p className="voices-line">
        Macro voices:{" "}
        {macro.map((v, i) => (
          <span key={v.handle}>
            {i > 0 ? " · " : ""}
            <a href={`https://x.com/${v.handle}`} target="_blank" rel="noopener noreferrer">
              @{v.handle}
            </a>
          </span>
        ))}
      </p>
      {robotics.length > 0 ? (
        <p className="voices-line">
          Robotics voices:{" "}
          {robotics.map((v, i) => (
            <span key={v.handle}>
              {i > 0 ? " · " : ""}
              <a href={`https://x.com/${v.handle}`} target="_blank" rel="noopener noreferrer">
                @{v.handle}
              </a>
            </span>
          ))}
        </p>
      ) : null}
      <p className="footer-nav">
        <Link href="/">Daily</Link>
        {" · "}
        <Link href="/weekly">Weekly</Link>
        {" · "}
        <Link href="/archive">Past editions</Link>
      </p>
      <p className="edit-hint">
        Edit <code>data/voices.json</code> to change the voice list (tag with{" "}
        <code>macro</code> / <code>robotics</code>). Actionables live on each edition JSON. Cron
        refreshes markets daily ~07:00 SGT.
      </p>
    </footer>
  );
}
