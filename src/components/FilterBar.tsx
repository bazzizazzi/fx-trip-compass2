import { MONTH_NAMES_HE } from "../lib/months";

export type Filters = {
  month: number;
  days: number;
  maxBudgetHome: number | null;
  minStars: number;
  hiddenGemsOnly: boolean;
};

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  homeCurrencySymbol: string;
};

export default function FilterBar({ filters, onChange, homeCurrencySymbol }: Props) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-card border border-ink/10 rounded-2xl p-5">
      <div>
        <label className="block text-xs font-semibold text-muted mb-1.5">חודש הנסיעה</label>
        <select
          value={filters.month}
          onChange={(e) => set("month", Number(e.target.value))}
          className="w-full bg-parchment border border-ink/15 rounded-lg px-3 py-2 text-sm"
        >
          {MONTH_NAMES_HE.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-muted mb-1.5">משך הטיול (ימים)</label>
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
          תקציב מקסימלי לכל הטיול ({homeCurrencySymbol})
        </label>
        <input
          type="number"
          placeholder="ללא הגבלה"
          value={filters.maxBudgetHome ?? ""}
          onChange={(e) => set("maxBudgetHome", e.target.value ? Number(e.target.value) : null)}
          className="w-full bg-parchment border border-ink/15 rounded-lg px-3 py-2 text-sm font-mono-num"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-muted mb-1.5">מינימום כוכבים למלון</label>
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
          פינות נסתרות בלבד
        </label>
      </div>
    </div>
  );
}
