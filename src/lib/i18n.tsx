import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "en" | "he" | "es" | "fr";

export const LANGUAGES: { code: Lang; label: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "he", label: "עברית", flag: "🇮🇱", dir: "rtl" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
];

type Dict = {
  brandTag: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroTitle2: string;
  heroSubtitle: string;
  whereFrom: string;
  homeCurrencyLabel: string;
  tabCheapLabel: string;
  tabCheapSub: string;
  tabMoversLabel: string;
  tabMoversSub: string;
  moversSliderLabel: string;
  moversYearsUnit: string;
  moversNoHistoryNote: string;
  filterMonth: string;
  filterDays: string;
  filterBudget: string;
  filterBudgetPlaceholder: string;
  filterMinStars: string;
  filterHiddenGemsOnly: string;
  includeFlightsLabel: string;
  flightsUnavailableShort: string;
  flightsUnavailableTooltip: string;
  excludedNote: (count: number) => string;
  noResultsTitle: string;
  noResultsSub: string;
  estimateLabel: (days: number) => string;
  fxMoveLabel: string;
  purchasingPowerLabel: string;
  seasonBadge: (month: string) => string;
  hiddenGemBadge: string;
  searchHotelsLabel: (stars: string) => string;
  searchFlightsLabel: string;
  footerDisclosure: string;
  privacyPolicyLink: string;
  termsLink: string;
  liveBadge: string;
  cachedBadge: string;
  fallbackBadge: (asOf: string) => string;
  months: string[];
  countries: Record<string, string>;
  tags: Record<string, string>;
};

const months_en = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const months_he = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
const months_es = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const months_fr = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

const countries_en: Record<string, string> = { IL: "Israel", US: "United States", GB: "United Kingdom", DE: "Germany", FR: "France", CA: "Canada", AU: "Australia", BR: "Brazil", IN: "India", JP: "Japan", ZA: "South Africa", MX: "Mexico", PL: "Poland", TR: "Turkey", AE: "UAE" };
const countries_he: Record<string, string> = { IL: "ישראל", US: "ארה\"ב", GB: "בריטניה", DE: "גרמניה", FR: "צרפת", CA: "קנדה", AU: "אוסטרליה", BR: "ברזיל", IN: "הודו", JP: "יפן", ZA: "דרום אפריקה", MX: "מקסיקו", PL: "פולין", TR: "טורקיה", AE: "איחוד האמירויות" };
const countries_es: Record<string, string> = { IL: "Israel", US: "Estados Unidos", GB: "Reino Unido", DE: "Alemania", FR: "Francia", CA: "Canadá", AU: "Australia", BR: "Brasil", IN: "India", JP: "Japón", ZA: "Sudáfrica", MX: "México", PL: "Polonia", TR: "Turquía", AE: "EAU" };
const countries_fr: Record<string, string> = { IL: "Israël", US: "États-Unis", GB: "Royaume-Uni", DE: "Allemagne", FR: "France", CA: "Canada", AU: "Australie", BR: "Brésil", IN: "Inde", JP: "Japon", ZA: "Afrique du Sud", MX: "Mexique", PL: "Pologne", TR: "Turquie", AE: "É.A.U." };

const tags_en: Record<string, string> = { lake: "Lake", architecture: "Architecture", islands: "Islands", art: "Art", surfing: "Surfing", gardens: "Gardens", history: "History", mountains: "Mountains", beaches: "Beaches", nature: "Nature", unique: "Unique", wine: "Wine", village: "Village", bigcity: "Big city" };
const tags_he: Record<string, string> = { lake: "אגם", architecture: "אדריכלות", islands: "איים", art: "אמנות", surfing: "גלישה", gardens: "גנים", history: "היסטוריה", mountains: "הרים", beaches: "חופים", nature: "טבע", unique: "ייחודי", wine: "יין", village: "כפרי", bigcity: "עיר גדולה" };
const tags_es: Record<string, string> = { lake: "Lago", architecture: "Arquitectura", islands: "Islas", art: "Arte", surfing: "Surf", gardens: "Jardines", history: "Historia", mountains: "Montañas", beaches: "Playas", nature: "Naturaleza", unique: "Único", wine: "Vino", village: "Pueblo", bigcity: "Gran ciudad" };
const tags_fr: Record<string, string> = { lake: "Lac", architecture: "Architecture", islands: "Îles", art: "Art", surfing: "Surf", gardens: "Jardins", history: "Histoire", mountains: "Montagnes", beaches: "Plages", nature: "Nature", unique: "Unique", wine: "Vin", village: "Village", bigcity: "Grande ville" };

const dict: Record<Lang, Dict> = {
  en: {
    brandTag: "FX Trip Compass",
    heroTitle1: "Cheap destinations based on",
    heroTitleHighlight: "your exchange rate",
    heroTitle2: ", not what everyone else searches for",
    heroSubtitle: "Every flight site shows dollar prices. Here we compute what your money is worth *right now* against every currency on earth — and where the rate has moved most in your favor over the last year or five.",
    whereFrom: "Where are you traveling from?",
    homeCurrencyLabel: "Your home currency",
    tabCheapLabel: "Cheapest right now",
    tabCheapSub: "Ranked by total trip cost in ",
    tabMoversLabel: "Biggest currency movers",
    tabMoversSub: "Ranked by verified FX movement",
    moversSliderLabel: "Look back",
    moversYearsUnit: "years",
    moversNoHistoryNote: "Historical rates come from a free, daily-updated public rate archive covering 200+ currencies. A handful of very obscure currencies may occasionally be missing a specific date — those destinations just won't appear for that lookback period.",
    filterMonth: "Travel month",
    filterDays: "Trip length (days)",
    filterBudget: "Max total budget",
    filterBudgetPlaceholder: "No limit",
    filterMinStars: "Minimum hotel stars",
    filterHiddenGemsOnly: "Hidden gems only",
    includeFlightsLabel: "Include flight cost in ranking",
    flightsUnavailableShort: "not connected yet",
    flightsUnavailableTooltip: "We don't have a live flights data connection yet, so this stays off rather than show you a guessed price.",
    excludedNote: (n) => `${n} destinations aren't shown for you — active conflict zones, or destinations where political history is still too sensitive for the average traveler. This list is curated manually and doesn't auto-update after political shifts.`,
    noResultsTitle: "No results with these filters",
    noResultsSub: "Try widening the budget, changing the month, or lowering the star requirement.",
    estimateLabel: (days) => `${days}-day estimate (excl. flights)`,
    fxMoveLabel: "FX move",
    purchasingPowerLabel: "What $100 buys you there",
    seasonBadge: (m) => `Best in ${m}`,
    hiddenGemBadge: "Hidden gem",
    searchHotelsLabel: (stars) => `Search hotels (${stars}+)`,
    searchFlightsLabel: "Search flights",
    footerDisclosure: "\"Cheapest right now\" ranks destinations by purchasing power using a Big Mac Index-style benchmark (The Economist's own published data where available, a GDP-based estimate elsewhere) rather than made-up budget figures. Exchange rates (current and historical) are fetched live from a free, open, daily-updated public rate archive (fawazahmed0/currency-api, served via jsDelivr's CDN, 200+ currencies). If that ever fails to load, the site falls back to a labeled offline snapshot rather than showing silently stale numbers. All conversions pivot through USD at full precision — never rounded mid-calculation. Hotel links go to real Booking.com search results with dates and star class pre-filled; full embedded pricing would require an official Booking.com Affiliate Partner API key.",
    privacyPolicyLink: "Privacy Policy",
    termsLink: "Terms of Service",
    liveBadge: "Live rates",
    cachedBadge: "Cached rates",
    fallbackBadge: (asOf) => `Offline snapshot (${asOf})`,
    months: months_en,
    countries: countries_en,
    tags: tags_en,
  },
  he: {
    brandTag: "FX Trip Compass",
    heroTitle1: "יעדים זולים לפי",
    heroTitleHighlight: "השער שלך",
    heroTitle2: ", לא לפי מה שכולם מחפשים",
    heroSubtitle: "כל אתר טיסות מראה מחירים דולריים. פה מחשבים כמה שווה הכסף שלך *עכשיו* מול כל מטבע בעולם — וגם איפה השער זז הכי הרבה לטובתך בשנה או ב-5 השנים האחרונות.",
    whereFrom: "מהיכן אתה נוסע?",
    homeCurrencyLabel: "מטבע הבית שלך",
    tabCheapLabel: "יעדים זולים עכשיו",
    tabCheapSub: "מדורגים לפי עלות כוללת ב-",
    tabMoversLabel: "השערים שהוזלו הכי הרבה",
    tabMoversSub: "מדורגים לפי תזוזת שער מאומתת",
    moversSliderLabel: "כמה אחורה",
    moversYearsUnit: "שנים",
    moversNoHistoryNote: "הנתונים ההיסטוריים מגיעים מארכיון שערים ציבורי חינמי שמתעדכן יומית ומכסה מעל 200 מטבעות. מטבע אקזוטי נדיר במיוחד עלול לפעמים לחסר תאריך ספציפי — היעד הזה פשוט לא יופיע לתקופה הזו.",
    filterMonth: "חודש הנסיעה",
    filterDays: "משך הטיול (ימים)",
    filterBudget: "תקציב מקסימלי",
    filterBudgetPlaceholder: "ללא הגבלה",
    filterMinStars: "מינימום כוכבים למלון",
    filterHiddenGemsOnly: "פינות נסתרות בלבד",
    includeFlightsLabel: "כלול עלות טיסה בדירוג",
    flightsUnavailableShort: "עדיין לא מחובר",
    flightsUnavailableTooltip: "אין לנו עדיין חיבור לנתוני טיסות בזמן אמת, אז זה נשאר כבוי במקום להראות לך מחיר מנוחש.",
    excludedNote: (n) => `${n} יעדים לא מוצגים עבורך — אזורי סכסוך פעיל, או יעדים שההיסטוריה המדינית ביניכם עדיין רגישה מדי לתייר ממוצע. הרשימה נשמרת ידנית ולא מתעדכנת אוטומטית אחרי שינויים פוליטיים.`,
    noResultsTitle: "אין תוצאות עם הפילטרים האלה",
    noResultsSub: "נסה להרחיב את התקציב, לשנות חודש, או להוריד את דרישת הכוכבים.",
    estimateLabel: (days) => `הערכה ל-${days} ימים (בלי טיסות)`,
    fxMoveLabel: "תזוזת שער",
    purchasingPowerLabel: "מה 100$ קונה לך שם",
    seasonBadge: (m) => `עונה מומלצת ב${m}`,
    hiddenGemBadge: "פינה נסתרת",
    searchHotelsLabel: (stars) => `חפש מלונות (${stars}+)`,
    searchFlightsLabel: "חפש טיסות",
    footerDisclosure: "\"יעדים זולים עכשיו\" מדורג לפי כוח קנייה, בסגנון מדד ביג מק (נתונים אמיתיים של The Economist היכן שקיימים, הערכה מבוססת תמ\"ג היכן שלא) ולא לפי מספרי תקציב מומצאים. שערי החליפין (נוכחיים והיסטוריים) נמשכים בזמן אמת מארכיון שערים ציבורי חינמי שמתעדכן יומית (fawazahmed0/currency-api, דרך רשת ה-CDN של jsDelivr, מעל 200 מטבעות). אם הטעינה נכשלת, האתר עובר לנתוני גיבוי מתויגים בבירור במקום להציג בשקט מספרים ישנים. כל המרה עוברת דרך דולר ארה\"ב בדיוק מלא — לעולם לא מעוגלת באמצע החישוב. קישורי המלונות מובילים לחיפוש אמיתי ב-Booking.com עם תאריכים ורמת כוכבים ממולאים; תמחור מוטמע מלא ידרוש מפתח API רשמי של Booking.com Affiliate Partner.",
    privacyPolicyLink: "מדיניות פרטיות",
    termsLink: "תנאי שימוש",
    liveBadge: "שערים חיים",
    cachedBadge: "שערים שמורים",
    fallbackBadge: (asOf) => `נתוני גיבוי (${asOf})`,
    months: months_he,
    countries: countries_he,
    tags: tags_he,
  },
  es: {
    brandTag: "FX Trip Compass",
    heroTitle1: "Destinos baratos según",
    heroTitleHighlight: "tu tipo de cambio",
    heroTitle2: ", no lo que busca todo el mundo",
    heroSubtitle: "Cada web de vuelos muestra precios en dólares. Aquí calculamos cuánto vale tu dinero *ahora mismo* frente a cada moneda del mundo — y dónde el tipo de cambio se ha movido más a tu favor en el último año o en cinco.",
    whereFrom: "¿Desde dónde viajas?",
    homeCurrencyLabel: "Tu moneda local",
    tabCheapLabel: "Más barato ahora mismo",
    tabCheapSub: "Ordenado por coste total del viaje en ",
    tabMoversLabel: "Monedas más devaluadas",
    tabMoversSub: "Ordenado por movimiento cambiario verificado",
    moversSliderLabel: "Mirar atrás",
    moversYearsUnit: "años",
    moversNoHistoryNote: "Los datos históricos provienen de un archivo público gratuito actualizado a diario que cubre más de 200 monedas. Alguna moneda muy poco común podría faltar en una fecha concreta — ese destino simplemente no aparecerá para ese periodo.",
    filterMonth: "Mes del viaje",
    filterDays: "Duración (días)",
    filterBudget: "Presupuesto máximo total",
    filterBudgetPlaceholder: "Sin límite",
    filterMinStars: "Estrellas mínimas del hotel",
    filterHiddenGemsOnly: "Solo joyas escondidas",
    includeFlightsLabel: "Incluir coste de vuelo en el ranking",
    flightsUnavailableShort: "aún no conectado",
    flightsUnavailableTooltip: "Todavía no tenemos una conexión de datos de vuelos en vivo, así que esto queda desactivado en vez de mostrarte un precio adivinado.",
    excludedNote: (n) => `${n} destinos no se muestran para ti — zonas en conflicto activo, o destinos cuya historia política sigue siendo demasiado sensible para el viajero medio. Esta lista se mantiene manualmente y no se actualiza automáticamente tras cambios políticos.`,
    noResultsTitle: "Sin resultados con estos filtros",
    noResultsSub: "Prueba a ampliar el presupuesto, cambiar el mes, o bajar el requisito de estrellas.",
    estimateLabel: (days) => `Estimación de ${days} días (sin vuelos)`,
    fxMoveLabel: "Movimiento cambiario",
    purchasingPowerLabel: "Lo que compran $100 allí",
    seasonBadge: (m) => `Mejor en ${m}`,
    hiddenGemBadge: "Joya escondida",
    searchHotelsLabel: (stars) => `Buscar hoteles (${stars}+)`,
    searchFlightsLabel: "Buscar vuelos",
    footerDisclosure: "\"Más barato ahora mismo\" clasifica los destinos por poder adquisitivo usando un índice estilo Big Mac (datos reales de The Economist donde están disponibles, una estimación basada en el PIB en el resto) en lugar de cifras de presupuesto inventadas. Los tipos de cambio (actuales e históricos) se obtienen en vivo desde un archivo público gratuito actualizado a diario (fawazahmed0/currency-api, servido vía la CDN de jsDelivr, 200+ monedas). Si la carga falla, el sitio usa datos sin conexión claramente etiquetados en vez de mostrar números desactualizados en silencio. Todas las conversiones pasan por el dólar con precisión total, nunca redondeadas a mitad de cálculo. Los enlaces de hoteles llevan a resultados reales de Booking.com con fechas y categoría de estrellas prerrellenadas.",
    privacyPolicyLink: "Política de Privacidad",
    termsLink: "Términos de Servicio",
    liveBadge: "Tipos en vivo",
    cachedBadge: "Tipos en caché",
    fallbackBadge: (asOf) => `Datos sin conexión (${asOf})`,
    months: months_es,
    countries: countries_es,
    tags: tags_es,
  },
  fr: {
    brandTag: "FX Trip Compass",
    heroTitle1: "Destinations pas chères selon",
    heroTitleHighlight: "votre taux de change",
    heroTitle2: ", pas ce que tout le monde recherche",
    heroSubtitle: "Chaque site de vols affiche des prix en dollars. Ici, on calcule ce que vaut votre argent *maintenant* face à chaque devise du monde — et où le taux a le plus évolué en votre faveur sur un an ou cinq ans.",
    whereFrom: "D'où partez-vous ?",
    homeCurrencyLabel: "Votre devise locale",
    tabCheapLabel: "Le moins cher en ce moment",
    tabCheapSub: "Classé par coût total du séjour en ",
    tabMoversLabel: "Devises les plus dépréciées",
    tabMoversSub: "Classé par mouvement de change vérifié",
    moversSliderLabel: "Regarder en arrière",
    moversYearsUnit: "ans",
    moversNoHistoryNote: "Les données historiques proviennent d'une archive publique gratuite mise à jour quotidiennement, couvrant plus de 200 devises. Une devise très rare peut occasionnellement manquer pour une date donnée — cette destination n'apparaîtra simplement pas pour cette période.",
    filterMonth: "Mois du voyage",
    filterDays: "Durée du séjour (jours)",
    filterBudget: "Budget total maximum",
    filterBudgetPlaceholder: "Sans limite",
    filterMinStars: "Étoiles minimum de l'hôtel",
    filterHiddenGemsOnly: "Pépites cachées uniquement",
    includeFlightsLabel: "Inclure le coût du vol dans le classement",
    flightsUnavailableShort: "pas encore connecté",
    flightsUnavailableTooltip: "Nous n'avons pas encore de connexion de données de vols en direct, donc ceci reste désactivé plutôt que d'afficher un prix deviné.",
    excludedNote: (n) => `${n} destinations ne sont pas affichées pour vous — zones de conflit actif, ou destinations dont l'histoire politique reste trop sensible pour le voyageur moyen. Cette liste est tenue à jour manuellement et ne se met pas à jour automatiquement après un changement politique.`,
    noResultsTitle: "Aucun résultat avec ces filtres",
    noResultsSub: "Essayez d'élargir le budget, de changer de mois, ou de baisser l'exigence d'étoiles.",
    estimateLabel: (days) => `Estimation sur ${days} jours (hors vols)`,
    fxMoveLabel: "Mouvement de change",
    purchasingPowerLabel: "Ce que 100$ vous achète là-bas",
    seasonBadge: (m) => `Idéal en ${m}`,
    hiddenGemBadge: "Pépite cachée",
    searchHotelsLabel: (stars) => `Chercher des hôtels (${stars}+)`,
    searchFlightsLabel: "Chercher des vols",
    footerDisclosure: "Le moins cher en ce moment classe les destinations par pouvoir d'achat selon un indice de type Big Mac (données réelles de The Economist quand disponibles, estimation basée sur le PIB sinon) plutôt que des chiffres de budget inventés. Les taux de change (actuels et historiques) sont récupérés en direct depuis une archive publique gratuite mise à jour quotidiennement (fawazahmed0/currency-api, servie via le CDN de jsDelivr, 200+ devises). En cas d'échec, le site utilise des données hors ligne clairement signalées plutôt que d'afficher silencieusement des chiffres périmés. Toutes les conversions passent par le dollar à pleine précision — jamais arrondies en cours de calcul. Les liens d'hôtels mènent à de vrais résultats Booking.com avec dates et catégorie d'étoiles pré-remplies.",
    privacyPolicyLink: "Politique de confidentialité",
    termsLink: "Conditions d'utilisation",
    liveBadge: "Taux en direct",
    cachedBadge: "Taux en cache",
    fallbackBadge: (asOf) => `Instantané hors ligne (${asOf})`,
    months: months_fr,
    countries: countries_fr,
    tags: tags_fr,
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const I18nContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "fxtrip.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    return saved && dict[saved] ? saved : "en";
  });

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  useEffect(() => {
    const meta = LANGUAGES.find((x) => x.code === lang)!;
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
  }, [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function currentDir(lang: Lang): "ltr" | "rtl" {
  return LANGUAGES.find((l) => l.code === lang)!.dir;
}
