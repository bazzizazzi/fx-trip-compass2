import { Compass, Sparkles, ExternalLink } from "lucide-react";
import type { Destination } from "../lib/destinations";
import { usdToHome, formatAmount, fxMovementPct, getCurrency } from "../lib/fx";
import { dateRangeForMonth, MONTH_NAMES_HE } from "../lib/months";
import FxMeter from "./FxMeter";

type Props = {
  dest: Destination;
  homeCurrency: string;
  days: number;
  month: number;
  minStars: number;
  movementPeriod?: "1y" | "5y";
};

export default function DestinationCard({ dest, homeCurrency, days, month, minStars, movementPeriod }: Props) {
  const home = getCurrency(homeCurrency);
  const totalUsd = dest.avgDailyBudgetUSD * days;
  const totalHome = usdToHome(totalUsd, homeCurrency);
  const monthMatch = dest.bestMonths.includes(month);
  const pct1y = fxMovementPct(homeCurrency, dest.currencyCode, "1y");
  const pct5y = fxMovementPct(homeCurrency, dest.currencyCode, "5y");
  const shownPct = movementPeriod === "5y" ? pct5y : pct1y;

  const { checkin, checkout } = dateRangeForMonth(month, days);
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
    dest.nameEn + ", " + dest.country
  )}&checkin=${checkin}&checkout=${checkout}&group_adults=2&no_rooms=1&nflt=class%3D${minStars}`;

  return (
    <article className="bg-card border border-ink/10 rounded-2xl p-5 flex flex-col gap-4 hover:border-gold-deep/50 hover:shadow-[0_4px_24px_-8px_rgba(22,35,59,0.18)] transition-all">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-xl font-semibold text-ink">{dest.name}</h3>
            {dest.hiddenGem && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold-deep">
                <Sparkles size={11} /> פינה נסתרת
              </span>
            )}
          </div>
          <p className="text-sm text-muted mt-0.5">{dest.country} · {dest.currencyCode}</p>
        </div>
        {monthMatch && (
          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-emerald-soft text-emerald whitespace-nowrap">
            עונה מומלצת ב{MONTH_NAMES_HE[month - 1]}
          </span>
        )}
      </div>

      <p className="text-sm text-ink-soft leading-relaxed">{dest.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {dest.tags.map((t) => (
          <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-ink/5 text-muted">{t}</span>
        ))}
      </div>

      <div className="border-t border-ink/10 pt-3 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted">הערכה ל-{days} ימים (בלי טיסות)</span>
          <span className="font-mono-num text-lg font-semibold text-ink">
            {home.symbol}{formatAmount(totalHome, homeCurrency)}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1 text-muted"><Compass size={12} /> תזוזת שער {movementPeriod === "5y" ? "ב-5 שנים" : "בשנה"}</span>
            <span className={`font-mono-num font-semibold ${shownPct >= 0 ? "text-emerald" : "text-coral"}`}>
              {shownPct >= 0 ? "+" : ""}{shownPct.toFixed(1)}%
            </span>
          </div>
          <FxMeter pct={shownPct} />
        </div>
      </div>

      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-center justify-center gap-1.5 text-[15px] font-bold px-4 py-3 rounded-xl bg-ink text-parchment hover:bg-gold-deep hover:text-ink transition-colors shadow-[0_2px_10px_-4px_rgba(22,35,59,0.4)]"
      >
        חפש מלונות ({"★".repeat(minStars)}+) ל-{checkin.slice(5)} <ExternalLink size={14} />
      </a>
    </article>
  );
}
