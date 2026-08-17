import { Compass } from "lucide-react";
import HomePicker from "./HomePicker";
import { getCurrency, crossRate, formatAmount } from "../lib/fx";

const REFERENCE_CODES = ["USD", "EUR", "JPY", "THB", "TRY"];

type Props = {
  homeCountryCode: string;
  homeCurrency: string;
  onChangeHome: (code: string) => void;
};

export default function Hero({ homeCountryCode, homeCurrency, onChangeHome }: Props) {
  const home = getCurrency(homeCurrency);
  return (
    <header className="relative overflow-hidden border-b border-ink/10">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-ink) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }} />
      <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="flex items-center gap-2 text-gold-deep mb-4">
          <Compass size={20} strokeWidth={2.2} />
          <span className="text-xs font-semibold tracking-[0.18em] uppercase font-mono-num">FX Trip Compass</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.1] max-w-2xl">
          יעדים זולים לפי <span className="text-gold-deep">השער שלך</span>, לא לפי מה שכולם מחפשים
        </h1>
        <p className="text-ink-soft mt-4 max-w-xl leading-relaxed">
          כל אתר טיסות מראה מחירים דולריים. פה מחשבים כמה שווה הכסף שלך *עכשיו*, מול כל מטבע בעולם —
          וגם איפה השער זז הכי הרבה לטובתך בשנה או ב-5 השנים האחרונות.
        </p>

        <div className="mt-8">
          <p className="text-xs font-semibold text-muted mb-2">מהיכן אתה נוסע?</p>
          <HomePicker value={homeCountryCode} onChange={onChangeHome} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {REFERENCE_CODES.filter((c) => c !== homeCurrency).map((code) => {
            const rate = crossRate(homeCurrency, code);
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
            <div className="text-[11px] opacity-70">מטבע הבית שלך</div>
            <div className="font-mono-num text-lg font-semibold">{home.symbol} {homeCurrency}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
