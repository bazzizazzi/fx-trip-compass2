import { HOME_COUNTRIES } from "../lib/destinations";

type Props = {
  value: string;
  onChange: (countryCode: string) => void;
};

export default function HomePicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {HOME_COUNTRIES.map((c) => {
        const active = c.code === value;
        return (
          <button
            key={c.code}
            onClick={() => onChange(c.code)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors
              ${active
                ? "bg-ink text-parchment border-ink"
                : "bg-card text-ink border-ink/15 hover:border-gold-deep hover:text-gold-deep"}`}
          >
            {c.name} <span className="font-mono-num opacity-60 text-xs">({c.currency})</span>
          </button>
        );
      })}
    </div>
  );
}
