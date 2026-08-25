type Props = {
  years: number;
  onChange: (years: number) => void;
  label: string;
  unit: string;
  steps: number[]; // available lookback years, driven by what's actually in historical-fx.json
};

export default function YearSlider({ years, onChange, label, unit, steps }: Props) {
  const idx = steps.indexOf(years);

  return (
    <div className="flex items-center gap-4 bg-card border border-ink/10 rounded-xl px-4 py-3">
      <span className="text-xs font-semibold text-muted whitespace-nowrap">{label}</span>
      <input
        type="range"
        min={0}
        max={steps.length - 1}
        step={1}
        value={idx === -1 ? 0 : idx}
        onChange={(e) => onChange(steps[Number(e.target.value)])}
        className="flex-1 accent-gold-deep"
      />
      <span className="font-mono-num text-sm font-bold text-ink bg-gold/15 px-2.5 py-1 rounded-full whitespace-nowrap">
        {years} {unit}
      </span>
    </div>
  );
}
