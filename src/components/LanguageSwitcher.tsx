import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { LANGUAGES, useI18n } from "../lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = LANGUAGES.find((l) => l.code === lang)!;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-ink/15 bg-card text-sm font-medium hover:border-gold-deep transition-colors"
        aria-label="Change language"
      >
        <span className="text-base leading-none">{active.flag}</span>
        <span>{active.label}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute end-0 mt-1.5 bg-card border border-ink/10 rounded-xl shadow-lg overflow-hidden z-30 min-w-[140px]">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-start hover:bg-ink/5 transition-colors ${
                l.code === lang ? "font-semibold text-gold-deep" : "text-ink"
              }`}
            >
              <span className="text-base leading-none">{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
