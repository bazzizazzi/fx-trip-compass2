import { Sparkles, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";
import type { Destination } from "../lib/destinations";
import { usdToHome, formatAmount, fxMovementPct, getCurrencyMeta } from "../lib/fx";
import { dateRangeForMonth } from "../lib/months";
import { useI18n } from "../lib/i18n";
import FxMeter from "./FxMeter";
import DestinationArt from "./DestinationArt";

type Props = {
  dest: Destination;
  homeCurrency: string;
  currentRates: Record<string, number>;
  pastRates?: Record<string, number>;
  bigMacs?: number;
  days: number;
  month: number;
  minStars: number;
  showMovement: boolean;
};

export default function DestinationCard({ dest, homeCurrency, currentRates, pastRates, bigMacs, days, month, minStars, showMovement }: Props) {
  const { t, lang } = useI18n();
  const home = getCurrencyMeta(homeCurrency);
  const totalUsd = dest.avgDailyBudgetUSD * days;
  const totalHome = usdToHome(currentRates, totalUsd, homeCurrency);
  const monthMatch = dest.bestMonths.includes(month);
  const movementPct = pastRates ? fxMovementPct(currentRates, pastRates, homeCurrency, dest.currencyCode) : null;

  const { checkin, checkout } = dateRangeForMonth(month, days);
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
    dest.nameEn + ", " + dest.countryEn
  )}&checkin=${checkin}&checkout=${checkout}&group_adults=2&no_rooms=1&nflt=class%3D${minStars}`;

  const name = lang === "he" ? dest.name : dest.nameEn;
  const country = lang === "he" ? dest.country : (t.countries[dest.countryCode] ?? dest.countryEn);
  const description = lang === "he" ? dest.description : dest.descriptionEn;
  const monthName = t.months[month - 1];

  return (
    <article className="group bg-card border border-ink/10 rounded-2xl overflow-hidden flex flex-col hover:shadow-[0_8px_30px_-10px_rgba(22,35,59,0.25)] hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative h-36 overflow-hidden">
        <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-300">
          <DestinationArt theme={dest.theme} seed={dest.id} />
        </div>
        {dest.hiddenGem && (
          <span className="absolute top-3 start-3 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-card/95 text-gold-deep shadow-sm backdrop-blur-sm">
            <Sparkles size={11} /> {t.hiddenGemBadge}
          </span>
        )}
        {monthMatch && (
          <span className="absolute top-3 end-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald text-white shadow-sm">
            {t.seasonBadge(monthName)}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-display text-xl font-semibold text-ink leading-tight">{name}</h3>
          <p className="text-sm text-muted mt-0.5">{country} · {dest.currencyCode}</p>
        </div>

        <p className="text-sm text-ink-soft leading-relaxed">{description}</p>

        <div className="flex flex-wrap gap-1.5">
          {dest.tagKeys.map((tk) => (
            <span key={tk} className="text-[11px] px-2 py-0.5 rounded-full bg-ink/5 text-muted">{t.tags[tk]}</span>
          ))}
        </div>

        <div className="border-t border-ink/10 pt-3 mt-auto space-y-2">
          {!showMovement && bigMacs != null && (
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted">{t.purchasingPowerLabel}</span>
              <span className="font-mono-num text-lg font-semibold text-ink flex items-center gap-1.5">
                🍔 {bigMacs.toFixed(1)}
              </span>
            </div>
          )}

          {showMovement && movementPct != null && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1 text-muted">
                  {movementPct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {t.fxMoveLabel}
                </span>
                <span className={`font-mono-num font-semibold ${movementPct >= 0 ? "text-emerald" : "text-coral"}`}>
                  {movementPct >= 0 ? "+" : ""}{movementPct.toFixed(1)}%
                </span>
              </div>
              <FxMeter pct={movementPct} />
            </div>
          )}

          <div className="flex items-baseline justify-between text-xs text-muted">
            <span>{t.estimateLabel(days)}</span>
            <span className="font-mono-num">{home.symbol}{formatAmount(totalHome, homeCurrency)}</span>
          </div>
        </div>

        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center justify-center gap-1.5 text-[15px] font-bold px-4 py-3 rounded-xl bg-ink text-parchment hover:bg-gold-deep hover:text-ink transition-colors shadow-[0_2px_10px_-4px_rgba(22,35,59,0.4)]"
        >
          {t.searchHotelsLabel("★".repeat(minStars))} <ExternalLink size={14} />
        </a>
      </div>
    </article>
  );
}
