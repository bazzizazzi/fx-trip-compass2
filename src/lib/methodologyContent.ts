export type MethodologyDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

export const METHODOLOGY_CONTENT: Record<string, MethodologyDoc> = {
  en: {
    title: "How our indices work",
    updated: "Last updated: August 2026",
    intro:
      "\"Cheapest right now\" needs a way to compare what your money is actually worth in each destination - not just a raw exchange rate, but real purchasing power. Here's exactly what powers that number today, and what's coming next.",
    sections: [
      {
        heading: "Live today: the Big Mac Index",
        body: [
          "The Big Mac Index, published by The Economist since 1986, compares the price of a Big Mac in local currency across countries. It's a simple, widely recognized way to judge whether a currency is over- or under-valued, and by extension, whether your money goes further in one country than another.",
          "We use The Economist's own published data (updated twice a year) wherever it's available. For the handful of destinations in currencies The Economist doesn't track, we estimate a plausible price using a statistical model based on GDP per capita - and we label those specific numbers \"est.\" on the site so you always know which is which.",
          "We never mix the two silently. A real Economist figure and an estimated one are never shown as if they carry equal certainty.",
        ],
      },
      {
        heading: "Planned: a weighted composite score",
        body: [
          "A single index has blind spots - the Big Mac Index reflects one product, not a full trip. We're building toward a combined \"Score\" using several purpose-built tourism-cost indices, each weighted by how directly it reflects what a traveler actually spends money on:",
          "Post Office Worldwide Holiday Costs Barometer — 25% (a real basket of tourist items, built specifically to answer \"where does a traveler's money go furthest\")",
          "Backpacker Index — 25% (a real daily budget basket: accommodation, food, transport, one attraction, drinks)",
          "World Bank ICP - Restaurants & Hotels Price Level Index — 20% (the broadest official measure of restaurant/hotel price levels)",
          "WEF Hotel Price Index — 15% (real average daily hotel rates, midscale to upper-upscale)",
          "Numbeo (tourism-relevant categories only, not general cost of living) — 10%",
          "Big Mac Index — 5% (a well-known signal, but a single product, so a small weight)",
          "Each index uses a different scale, so before combining them we normalize every index onto the same 0-100 range before applying these weights - otherwise an index with naturally larger numbers would silently dominate the result.",
          "We have not yet sourced verified, reliable data for four of these six indices across our full destination list. Rather than fill the gaps with guesses, we're only combining indices once we have real, citable numbers for them - not before. This page will be updated the moment the composite score goes live, and we'll explain exactly what changed.",
        ],
      },
    ],
  },
  he: {
    title: "איך המדדים שלנו עובדים",
    updated: "עדכון אחרון: אוגוסט 2026",
    intro:
      "כדי לדרג \"יעדים זולים עכשיו\" צריך דרך להשוות כמה שווה הכסף שלך בכל יעד - לא רק שער חליפין גולמי, אלא כוח קנייה אמיתי. הנה בדיוק מה מפעיל את המספר הזה היום, ומה מתוכנן בהמשך.",
    sections: [
      {
        heading: "חי היום: מדד ביג מק",
        body: [
          "מדד ביג מק, שמפרסם The Economist מאז 1986, משווה את מחיר הביג מק במטבע מקומי בין מדינות. זו דרך פשוטה ומוכרת מאוד לשפוט האם מטבע מוערך-יתר או מוערך-חסר, ובהרחבה, האם הכסף שלך הולך רחוק יותר במדינה אחת מאשר באחרת.",
          "אנחנו משתמשים בנתונים הרשמיים של The Economist (מתעדכנים פעמיים בשנה) בכל מקום שהם זמינים. עבור מספר קטן של יעדים במטבעות ש-The Economist לא עוקב אחריהם, אנחנו מעריכים מחיר סביר באמצעות מודל סטטיסטי מבוסס תמ\"ג לנפש - ומתייגים את המספרים הספציפיים האלה כ\"משוער\" באתר כדי שתמיד תדע מה הוא מה.",
          "אנחנו לעולם לא מערבבים בין השניים בשקט. מספר אמיתי של The Economist ומספר מוערך לעולם לא מוצגים כאילו יש להם אותה רמת ודאות.",
        ],
      },
      {
        heading: "מתוכנן: ציון משוקלל משולב",
        body: [
          "למדד יחיד יש נקודות עיוורות - מדד ביג מק משקף מוצר אחד, לא טיול שלם. אנחנו בונים לקראת \"ציון\" משולב באמצעות כמה מדדי עלות-תיירות ייעודיים, כל אחד משוקלל לפי עד כמה הוא משקף באופן ישיר את מה שמטייל באמת מוציא עליו כסף:",
          "Post Office Worldwide Holiday Costs Barometer — 25% (סל אמיתי של פריטי תיירות, שנבנה בדיוק כדי לענות \"איפה הכסף של התייר הולך הכי רחוק\")",
          "Backpacker Index — 25% (סל תקציב יומי אמיתי: לינה, אוכל, תחבורה, אטרקציה אחת, משקאות)",
          "World Bank ICP - Restaurants & Hotels PLI — 20% (המדד הרשמי והרחב ביותר לרמת מחירי מסעדות/מלונות)",
          "WEF Hotel Price Index — 15% (מחירי חדרי מלון יומיים ממוצעים אמיתיים, מ-midscale עד upper-upscale)",
          "Numbeo (רכיבים רלוונטיים לתיירות בלבד, לא Cost of Living כללי) — 10%",
          "מדד ביג מק — 5% (סיגנל מוכר מאוד, אבל מוצר יחיד, ולכן משקל קטן)",
          "כל מדד משתמש בסקאלה שונה, אז לפני שילוב שלהם אנחנו מנרמלים כל מדד לאותו טווח 0-100 לפני החלת המשקלים - אחרת מדד עם מספרים גדולים באופן טבעי היה שולט בתוצאה בשקט.",
          "עדיין לא איתרנו נתונים מאומתים ואמינים לארבעה מתוך ששת המדדים האלה עבור כל רשימת היעדים שלנו. במקום למלא את הפערים בניחושים, אנחנו נשלב מדדים רק ברגע שיהיו לנו מספרים אמיתיים וניתנים לציטוט עבורם - לא לפני. עמוד זה יעודכן ברגע שהציון המשולב יעלה לאוויר, ונסביר בדיוק מה השתנה.",
        ],
      },
    ],
  },
  es: {
    title: "Cómo funcionan nuestros índices",
    updated: "Última actualización: agosto de 2026",
    intro:
      "Para clasificar \"lo más barato ahora mismo\" necesitamos comparar cuánto vale realmente tu dinero en cada destino. Esto es exactamente lo que impulsa esa cifra hoy, y lo que viene después.",
    sections: [
      {
        heading: "En vivo hoy: el Big Mac Index",
        body: [
          "El Big Mac Index, publicado por The Economist desde 1986, compara el precio de una Big Mac en moneda local entre países. Usamos los datos oficiales de The Economist donde están disponibles; para las pocas monedas que no cubren, estimamos un precio plausible con un modelo estadístico basado en el PIB per cápita, etiquetado claramente como \"est.\"",
        ],
      },
      {
        heading: "Planeado: una puntuación compuesta ponderada",
        body: [
          "Estamos construyendo una \"puntuación\" combinada usando varios índices de coste turístico, cada uno ponderado según cuán directamente refleja el gasto real de un viajero: Post Office Worldwide Holiday Costs Barometer (25%), Backpacker Index (25%), World Bank ICP - Restaurants & Hotels PLI (20%), WEF Hotel Price Index (15%), Numbeo componentes turísticos (10%), Big Mac Index (5%).",
          "Aún no tenemos datos verificados y fiables para cuatro de estos seis índices en toda nuestra lista de destinos. En lugar de rellenar los huecos con suposiciones, solo combinaremos índices cuando tengamos cifras reales y citables. Esta página se actualizará en cuanto la puntuación compuesta esté activa.",
        ],
      },
    ],
  },
  fr: {
    title: "Comment fonctionnent nos indices",
    updated: "Dernière mise à jour : août 2026",
    intro:
      "Pour classer \"le moins cher en ce moment\", nous devons comparer ce que vaut réellement votre argent dans chaque destination. Voici exactement ce qui alimente ce chiffre aujourd'hui, et ce qui arrive ensuite.",
    sections: [
      {
        heading: "En direct aujourd'hui : le Big Mac Index",
        body: [
          "Le Big Mac Index, publié par The Economist depuis 1986, compare le prix d'un Big Mac en monnaie locale entre pays. Nous utilisons les données officielles de The Economist quand elles sont disponibles ; pour les quelques devises non couvertes, nous estimons un prix plausible via un modèle statistique basé sur le PIB par habitant, clairement étiqueté \"est.\"",
        ],
      },
      {
        heading: "Prévu : un score composite pondéré",
        body: [
          "Nous construisons un \"score\" combiné utilisant plusieurs indices de coût touristique, chacun pondéré selon sa pertinence directe pour les dépenses réelles d'un voyageur : Post Office Worldwide Holiday Costs Barometer (25%), Backpacker Index (25%), World Bank ICP - Restaurants & Hotels PLI (20%), WEF Hotel Price Index (15%), composantes touristiques de Numbeo (10%), Big Mac Index (5%).",
          "Nous n'avons pas encore de données vérifiées et fiables pour quatre de ces six indices sur l'ensemble de nos destinations. Plutôt que de combler les lacunes par des suppositions, nous ne combinerons les indices qu'une fois disposer de chiffres réels et citables. Cette page sera mise à jour dès que le score composite sera actif.",
        ],
      },
    ],
  },
};
