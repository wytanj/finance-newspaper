import type { Headline } from "@/lib/types";

export function HeadlineCard({ headline, featured = false }: { headline: Headline; featured?: boolean }) {
  return (
    <article className={featured ? "headline featured" : "headline"}>
      <p className="theme-tag">{headline.theme}</p>
      <h3>{headline.title}</h3>
      <p className="dek">{headline.dek}</p>
      <ul className="cites">
        {headline.voices.map((v) => (
          <li key={v.postId}>
            <a href={v.url} target="_blank" rel="noopener noreferrer">
              <span className="handle">@{v.handle}</span>
              <span className="snippet">“{v.snippet}”</span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
