import { Compass } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { HOME_COUNTRIES } from "../lib/destinations";
import { getCurrencyMeta, crossRate, formatAmount } from "../lib/fx";
import { useI18n } from "../lib/i18n";

const REFERENCE_CODES = ["USD", "EUR", "JPY", "THB", "TRY"];

type Props = {
  homeCountryCode: string;
  homeCurrency: string;
  onChangeHome: (code: string) => void;
  currentRates: Record<string, number> | null;
};

export default function Hero({ homeCountryCode, homeCurrency, onChangeHome, currentRates }: Props) {
  const { t } = useI18n();
  const home = getCurrencyMeta(homeCurrency);

  return (
    <header className="relative overflow-hidden border-b border-ink/10">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-ink) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-gold-deep">
            <Compass size={20} strokeWidth={2.2} />
            <span className="text-xs font-semibold tracking-[0.18em] uppercase font-mono-num">{t.brandTag}</span>
          </div>
          <LanguageSwitcher />
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.1] max-w-2xl">
          {t.heroTitle1} <span className="text-gold-deep">{t.heroTitleHighlight}</span>{t.heroTitle2}
        </h1>
        <p className="text-ink-soft mt-4 max-w-xl leading-relaxed">{t.heroSubtitle}</p>

        <div className="mt-8">
          <p className="text-xs font-semibold text-muted mb-2">{t.whereFrom}</p>
          <div className="flex flex-wrap items-center gap-2">
            {HOME_COUNTRIES.map((c) => {
              const active = c.code === homeCountryCode;
              return (
                <button
                  key={c.code}
                  onClick={() => onChangeHome(c.code)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors
                    ${active
                      ? "bg-ink text-parchment border-ink"
                      : "bg-card text-ink border-ink/15 hover:border-gold-deep hover:text-gold-deep"}`}
                >
                  {t.countries[c.code]} <span className="font-mono-num opacity-60 text-xs">({c.currency})</span>
                </button>
              );
            })}
          </div>
        </div>

        {currentRates && (
          <div className="mt-8 flex flex-wrap gap-3">
            {REFERENCE_CODES.filter((c) => c !== homeCurrency).map((code) => {
              const rate = crossRate(currentRates, homeCurrency, code);
              return (
                <div key={code} className="bg-card border border-ink/10 rounded-xl px-4 py-2.5 min-w-[128px]">
                  <div className="text-[11px] text-muted font-mono-num">1 {homeCurrency} =</div>
                  <div className="font-mono-num text-lg font-semibold text-ink">
                    {formatAmount(rate, code)} <span className="text-sm text-muted">{code}</span>
                  </div>
                </div>
              );
            })}
            <div className="bg-ink text-parchment rounded-xl px-4 py-2.5 min-w-[128px] flex flex-col justify-center">
              <div className="text-[11px] opacity-70">{t.homeCurrencyLabel}</div>
              <div className="font-mono-num text-lg font-semibold">{home.symbol} {homeCurrency}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
