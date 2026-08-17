import { Radio, Clock, WifiOff } from "lucide-react";
import { useI18n } from "../lib/i18n";
import type { RatesSnapshot } from "../lib/fxLive";

export default function LiveDataBadge({ snapshot }: { snapshot: RatesSnapshot | null }) {
  const { t } = useI18n();
  if (!snapshot) return null;

  if (snapshot.source === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-soft text-emerald">
        <Radio size={11} className="animate-pulse" /> {t.liveBadge}
      </span>
    );
  }
  if (snapshot.source === "cached") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-ink/5 text-muted">
        <Clock size={11} /> {t.cachedBadge}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-coral-soft text-coral">
      <WifiOff size={11} /> {t.fallbackBadge(snapshot.asOf)}
    </span>
  );
}
