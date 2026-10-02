import type { MarketRow } from "@/lib/types";
import { formatPrice, formatChange, changeClass } from "@/lib/format";
import { SparkChart } from "./SparkChart";

export function MarketTape({ markets }: { markets: MarketRow[] }) {
  return (
    <section className="markets" aria-label="Key numbers">
      <div className="section-head">
        <h2>Key numbers</h2>
        <p className="section-sub">Yahoo Finance · delayed · 5-day spark</p>
      </div>
      <div className="market-grid">
        {markets.map((m) => {
          const up = m.changePct == null ? null : m.changePct > 0;
          return (
            <article key={m.key} className="market-card">
              <div className="market-label">{m.label}</div>
              <div className="market-row">
                <div className="market-price">{formatPrice(m.key, m.price)}</div>
                <div className={`market-chg ${changeClass(m.changePct)}`}>
                  {formatChange(m.changePct)}
                </div>
              </div>
              <SparkChart data={m.spark} up={up} />
              <div className="market-sym">{m.symbol}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
