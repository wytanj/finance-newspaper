import type { Headline, ProofTag } from "@/lib/types";

const PROOF_LABEL: Record<ProofTag, string> = {
  BOM: "BOM",
  repo: "Repo",
  CAD: "CAD",
  price: "Price",
  capacity: "Capacity",
  photo: "Photo/demo",
};

export function ProofBadges({ proof }: { proof?: ProofTag[] }) {
  if (!proof?.length) return null;
  return (
    <ul className="proof-badges" aria-label="What this card proves">
      {proof.map((p) => (
        <li key={p} className={`proof-badge proof-${p.toLowerCase()}`}>
          {PROOF_LABEL[p] ?? p}
        </li>
      ))}
    </ul>
  );
}

export function RoboticsCard({ card }: { card: Headline }) {
  return (
    <article className={`robo-card${card.band ? ` band-${card.band}` : ""}`}>
      <div className="robo-card-top">
        <p className="theme-tag">{card.theme}</p>
        <ProofBadges proof={card.proof} />
      </div>
      <h3>{card.title}</h3>
      <p className="dek">{card.dek}</p>
      {card.voices.length > 0 ? (
        <ul className="cites">
          {card.voices.map((v) => (
            <li key={v.postId}>
              <a href={v.url} target="_blank" rel="noopener noreferrer">
                <span className="handle">@{v.handle}</span>
                <span className="snippet">“{v.snippet}”</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {card.sources?.length || card.signal ? (
        <p className="robo-card-foot">
          {card.signal ? <span className="robo-signal">{card.signal}</span> : null}
          {card.sources?.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="robo-source">
              {s.label} ↗
            </a>
          ))}
        </p>
      ) : null}
    </article>
  );
}
