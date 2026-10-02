import type { Voice } from "@/lib/types";

export function PaperFooter({
  note,
  voices,
}: {
  note: string;
  voices: Voice[];
}) {
  return (
    <footer className="paper-footer">
      <p>{note}</p>
      <p className="voices-line">
        Voices:{" "}
        {voices.map((v, i) => (
          <span key={v.handle}>
            {i > 0 ? " · " : ""}
            <a href={`https://x.com/${v.handle}`} target="_blank" rel="noopener noreferrer">
              @{v.handle}
            </a>
          </span>
        ))}
      </p>
      <p className="edit-hint">
        Edit <code>data/voices.json</code> to change the voice list. Cron refreshes markets daily
        ~07:00 SGT.
      </p>
    </footer>
  );
}
