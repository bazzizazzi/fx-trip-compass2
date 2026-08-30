type Props = {
  monthKey: string; // "YYYY-MM"
  onChange: (monthKey: string) => void;
  label: string;
  months: string[]; // available "YYYY-MM" keys, oldest first
};

const MONTH_NAMES_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return `${MONTH_NAMES_SHORT[m - 1]} ${y}`;
}

export default function MonthSlider({ monthKey, onChange, label, months }: Props) {
  // slider is oldest(0) -> newest(length-1); default view is "how far back", so
  // we invert for display purposes only.
  const idx = months.indexOf(monthKey);
  const safeIdx = idx === -1 ? months.length - 1 : idx;

  return (
    <div className="flex items-center gap-4 bg-card border border-ink/10 rounded-xl px-4 py-3">
      <span className="text-xs font-semibold text-muted whitespace-nowrap">{label}</span>
      <input
        type="range"
        min={0}
        max={months.length - 1}
        step={1}
        value={safeIdx}
        onChange={(e) => onChange(months[Number(e.target.value)])}
        className="flex-1 accent-gold-deep"
      />
      <span className="font-mono-num text-sm font-bold text-ink bg-gold/15 px-2.5 py-1 rounded-full whitespace-nowrap min-w-[84px] text-center">
        {formatLabel(monthKey)}
      </span>
    </div>
  );
}
