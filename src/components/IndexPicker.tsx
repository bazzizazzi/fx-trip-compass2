import { useI18n } from "../lib/i18n";
import type { PurchasingPowerIndex } from "../lib/purchasingPower";

type Props = {
  value: PurchasingPowerIndex;
  onChange: (v: PurchasingPowerIndex) => void;
};

export default function IndexPicker({ value, onChange }: Props) {
  const { t } = useI18n();

  const options: { id: PurchasingPowerIndex; label: string; sub: string }[] = [
    { id: "bigmac", label: t.indexBigMacLabel, sub: t.indexBigMacSub },
    { id: "pli", label: t.indexPliLabel, sub: t.indexPliSub },
  ];

  return (
    <div className="bg-card border border-ink/10 rounded-2xl p-4">
      <p className="text-xs font-semibold text-muted mb-2.5">{t.indexPickerTitle}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`text-start px-3.5 py-2 rounded-xl border transition-colors ${
                active
                  ? "bg-ink text-parchment border-ink"
                  : "bg-parchment text-ink border-ink/15 hover:border-gold-deep"
              }`}
            >
              <div className="text-sm font-semibold">{opt.label}</div>
              <div className={`text-[11px] ${active ? "opacity-70" : "text-muted"}`}>{opt.sub}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
