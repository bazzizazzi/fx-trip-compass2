import { useMemo, useState } from "react";
import Hero from "./components/Hero";
import Tabs from "./components/Tabs";
import FilterBar, { type Filters } from "./components/FilterBar";
import DestinationCard from "./components/DestinationCard";
import { HOME_COUNTRIES, visibleDestinationsFor, allDestinations } from "./lib/destinations";
import { getCurrency } from "./lib/fx";
import { currentMonth } from "./lib/months";
import { rankCheapestNow, rankBiggestMovers } from "./lib/rank";
import { ShieldAlert, Info } from "lucide-react";

const STORAGE_KEY = "fxtrip.home_country";

export default function App() {
  const [homeCountryCode, setHomeCountryCode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || "IL";
  });
  const homeCountry = HOME_COUNTRIES.find((c) => c.code === homeCountryCode)!;
  const homeCurrency = homeCountry.currency;

  const [tab, setTab] = useState<"cheap" | "movers">("cheap");
  const [period, setPeriod] = useState<"1y" | "5y">("1y");
  const [filters, setFilters] = useState<Filters>({
    month: currentMonth(),
    days: 6,
    maxBudgetHome: null,
    minStars: 3,
    hiddenGemsOnly: false,
  });

  function handleHomeChange(code: string) {
    setHomeCountryCode(code);
    localStorage.setItem(STORAGE_KEY, code);
  }

  const visible = useMemo(() => visibleDestinationsFor(homeCountryCode), [homeCountryCode]);
  const totalCount = useMemo(() => allDestinations().length, []);
  const excludedCount = totalCount - visible.length;

  const cheapResults = useMemo(
    () => rankCheapestNow(visible, homeCurrency, filters),
    [visible, homeCurrency, filters]
  );
  const moverResults = useMemo(
    () => rankBiggestMovers(visible, homeCurrency, period, filters),
    [visible, homeCurrency, period, filters]
  );

  const results = tab === "cheap" ? cheapResults : moverResults;

  return (
    <div className="min-h-screen">
      <Hero homeCountryCode={homeCountryCode} homeCurrency={homeCurrency} onChangeHome={handleHomeChange} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Tabs
          tabs={[
            { id: "cheap", label: "יעדים זולים עכשיו", sub: "מדורגים לפי עלות כוללת ב-" + homeCurrency },
            { id: "movers", label: "השערים שהוזלו הכי הרבה", sub: "מדורגים לפי תזוזת שער FX" },
          ]}
          active={tab}
          onChange={(id) => setTab(id as "cheap" | "movers")}
        />

        {tab === "movers" && (
          <div className="flex gap-2 mt-4">
            {(["1y", "5y"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  period === p
                    ? "bg-gold text-ink border-gold"
                    : "bg-card text-muted border-ink/15 hover:text-ink"
                }`}
              >
                {p === "1y" ? "מול לפני שנה" : "מול לפני 5 שנים"}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6">
          <FilterBar filters={filters} onChange={setFilters} homeCurrencySymbol={getCurrency(homeCurrency).symbol} />
        </div>

        {excludedCount > 0 && (
          <div className="mt-5 flex items-start gap-2 text-xs text-muted bg-ink/[0.03] border border-ink/10 rounded-xl px-4 py-3">
            <ShieldAlert size={15} className="mt-0.5 shrink-0" />
            <span>
              {excludedCount} יעדים לא מוצגים עבורך — אזורי סכסוך פעיל, או יעדים שההיסטוריה המדינית ביניכם
              עדיין רגישה מדי לתייר ממוצע. הרשימה נשמרת ידנית ולא מתעדכנת אוטומטית אחרי שינויים פוליטיים.
            </span>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted">
              <p className="font-display text-lg text-ink mb-1">אין תוצאות עם הפילטרים האלה</p>
              <p className="text-sm">נסה להרחיב את התקציב, לשנות חודש, או להוריד את דרישת הכוכבים.</p>
            </div>
          )}
          {results.map((d) => (
            <DestinationCard
              key={d.id}
              dest={d}
              homeCurrency={homeCurrency}
              days={filters.days}
              month={filters.month}
              minStars={filters.minStars}
              movementPeriod={tab === "movers" ? period : "1y"}
            />
          ))}
        </div>
      </main>

      <footer className="border-t border-ink/10 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-8 text-xs text-muted space-y-2">
          <div className="flex items-start gap-2">
            <Info size={14} className="mt-0.5 shrink-0" />
            <p className="max-w-3xl leading-relaxed">
              שערי המט"ח והתקציבים היומיים באתר זה הם נתוני דוגמה ריאליסטיים למטרות הדגמה, לא שערים חיים.
              חישוב ההמרה תמיד עובר דרך דולר ארה"ב בדיוק מלא (לא מעוגל) כדי שהתוצאה בין שני מטבעות שאין
              ביניהם זוג ישיר תהיה מדויקת. קישורי המלונות מובילים לחיפוש אמיתי ב-Booking.com עם תאריכים
              ורמת כוכבים ממולאים מראש; חיבור API מלא ל-Booking דורש אישור שותפות רשמי מולם.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
