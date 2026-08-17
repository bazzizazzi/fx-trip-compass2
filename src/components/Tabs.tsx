type Tab = { id: string; label: string; sub: string };

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
};

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex gap-2 border-b border-ink/10">
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`relative px-1 pb-3 pt-1 text-right transition-colors ${isActive ? "text-ink" : "text-muted hover:text-ink-soft"}`}
          >
            <div className="font-display text-lg font-semibold">{t.label}</div>
            <div className="text-xs mt-0.5">{t.sub}</div>
            {isActive && <span className="absolute -bottom-px right-0 left-0 h-0.5 bg-gold-deep rounded-full" />}
          </button>
        );
      })}
    </div>
  );
}
