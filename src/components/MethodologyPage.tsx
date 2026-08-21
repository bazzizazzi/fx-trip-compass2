import { useI18n } from "../lib/i18n";
import { METHODOLOGY_CONTENT } from "../lib/methodologyContent";
import { Compass } from "lucide-react";

export default function MethodologyPage() {
  const { lang, t } = useI18n();
  const doc = METHODOLOGY_CONTENT[lang] ?? METHODOLOGY_CONTENT.en;

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10">
        <div className="max-w-3xl mx-auto px-6 pt-8 pb-6">
          <a href="/" className="inline-flex items-center gap-2 text-gold-deep hover:opacity-80 transition-opacity">
            <Compass size={18} strokeWidth={2.2} />
            <span className="text-xs font-semibold tracking-[0.18em] uppercase font-mono-num">{t.brandTag}</span>
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-semibold text-ink mb-1">{doc.title}</h1>
        <p className="text-sm text-muted mb-8">{doc.updated}</p>
        <p className="text-ink-soft leading-relaxed mb-8">{doc.intro}</p>

        <div className="space-y-8">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-lg font-semibold text-ink mb-2">{section.heading}</h2>
              <div className="space-y-2">
                {section.body.map((para, i) => (
                  <p key={i} className="text-sm text-ink-soft leading-relaxed">{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-ink/10">
          <a href="/" className="text-sm font-semibold text-gold-deep hover:underline">← {t.brandTag}</a>
        </div>
      </main>
    </div>
  );
}
