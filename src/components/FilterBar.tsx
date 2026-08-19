import { useI18n } from "../lib/i18n";
import { Plane } from "lucide-react";

export type Filters = {
  month: number;
  days: number;
  maxBudgetHome: number | null;
  minStars: number;
  hiddenGemsOnly: boolean;
  includeFlights: boolean;
};

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  homeCurrencySymbol: string;
  flightsAvailable: boolean;
};

export default function FilterBar({ filters, onChange, homeCurrencySymbol, flightsAvailable }: Props) {
  const { t } = useI18n();
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="space-y-3">
      <div className="bg-card border border-ink/10 rounded-2xl p-4">
        <label
          className={`flex items-center gap-2.5 text-sm select-none ${flightsAvailable ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
          title={flightsAvailable ? undefined : t.flightsUnavailableTooltip}
        >
          <input
            type="checkbox"
            checked={filters.includeFlights && flightsAvailable}
            disabled={!flightsAvailable}
            onChange={(e) => set("includeFlights", e.target.checked)}
            className="w-4 h-4 accent-gold-deep disabled:opacity-50"
          />
          <Plane size={15} className="text-muted" />
          <span className="font-medium text-ink">{t.includeFlightsLabel}</span>
          {!flightsAvailable && (
            <span className="text-xs text-muted italic">— {t.flightsUnavailableShort}</span>
          )}
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-card border border-ink/10 rounded-2xl p-5">
        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5">{t.filterMonth}</label>
          <select
            value={filters.month}
            onChange={(e) => set("month", Number(e.target.value))}
            className="w-full bg-parchment border border-ink/15 rounded-lg px-3 py-2 text-sm"
          >
            {t.months.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5">{t.filterDays}</label>
          <input
            type="number"
            min={2}
            max={30}
            value={filters.days}
            onChange={(e) => set("days", Number(e.target.value))}
            className="w-full bg-parchment border border-ink/15 rounded-lg px-3 py-2 text-sm font-mono-num"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5">
            {t.filterBudget} ({homeCurrencySymbol})
          </label>
          <input
            type="number"
            placeholder={t.filterBudgetPlaceholder}
            value={filters.maxBudgetHome ?? ""}
            onChange={(e) => set("maxBudgetHome", e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-parchment border border-ink/15 rounded-lg px-3 py-2 text-sm font-mono-num"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5">{t.filterMinStars}</label>
          <select
            value={filters.minStars}
            onChange={(e) => set("minStars", Number(e.target.value))}
            className="w-full bg-parchment border border-ink/15 rounded-lg px-3 py-2 text-sm"
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <option key={s} value={s}>{"★".repeat(s)}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.hiddenGemsOnly}
              onChange={(e) => set("hiddenGemsOnly", e.target.checked)}
              className="w-4 h-4 accent-gold-deep"
            />
            {t.filterHiddenGemsOnly}
          </label>
        </div>
      </div>
    </div>
  );
}
