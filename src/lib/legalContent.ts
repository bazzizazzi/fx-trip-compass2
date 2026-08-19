export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = { title: string; updated: string; intro: string; sections: LegalSection[] };

// NOTE on scope: this reflects what the site ACTUALLY does today - no user
// accounts yet, no email collection, localStorage for preferences only,
// affiliate outbound links with opaque (non-PII) click IDs. Update this file
// the moment accounts/SSO/bookings tracking ships - don't let it go stale.
// [BRACKETED] placeholders need the operator's real business/contact details
// filled in before this is relied on as an actual legal document - this is a
// solid starting draft, not a substitute for a lawyer's review.

export const LEGAL_CONTENT: Record<string, { privacy: LegalDoc; terms: LegalDoc }> = {
  en: {
    privacy: {
      title: "Privacy Policy",
      updated: "Last updated: August 2026",
      intro:
        "FX Trip Compass (\"we\", \"the site\") is a travel-planning comparison tool. This policy explains what information the site handles and why. We aim to collect as little personal data as possible.",
      sections: [
        {
          heading: "What we collect",
          body: [
            "Right now, the site does not require an account, and we do not collect your name, email, or any identifying information to use it.",
            "Your language and home-country selections are saved in your browser's local storage only - this stays on your device and is never sent to our servers.",
            "When you click an outbound link to a partner (Booking.com, Trip.com, Viator, or others), we generate a random, non-identifying click ID to attribute the referral for commission purposes. This ID contains no personal information - no email, name, or IP address is embedded in it.",
            "Our server logs standard technical request data (e.g. IP address, for abuse prevention and rate limiting) for a short period, as any web server does. We do not combine this with any tracking profile.",
          ],
        },
        {
          heading: "Cookies and local storage",
          body: [
            "We use browser local storage (not cookies) to remember your language and home-currency choice. This is functional storage, not used for advertising or cross-site tracking.",
            "Partner sites you're redirected to (Booking.com, Trip.com, etc.) have their own cookies and tracking, governed by their own privacy policies.",
          ],
        },
        {
          heading: "Third-party data sources",
          body: [
            "Exchange rate data comes from a public, free rate archive (fawazahmed0/currency-api, via jsDelivr's CDN). Purchasing-power comparisons use The Economist's public Big Mac Index data. Neither source receives any information about you - these are one-way public data fetches.",
          ],
        },
        {
          heading: "Your rights (GDPR / CCPA and similar)",
          body: [
            "Because we currently collect no personal data tied to an identifiable person, there is generally nothing to access, correct, or delete on our end. If that changes (e.g., when account features launch), this policy will be updated first, and you will be able to request access to, correction of, or deletion of your data by contacting us at [CONTACT EMAIL].",
          ],
        },
        {
          heading: "Children",
          body: ["This site is not directed at children under 16 and we do not knowingly collect data from them."],
        },
        {
          heading: "Changes to this policy",
          body: ["If our data practices change - for example, when user accounts launch - we will update this page and the \"last updated\" date above."],
        },
        {
          heading: "Contact",
          body: ["Questions about this policy: [CONTACT EMAIL]. Operator: [COMPANY / INDIVIDUAL NAME], [JURISDICTION]."],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      updated: "Last updated: August 2026",
      intro:
        "By using FX Trip Compass, you agree to the following terms. Please read them before using the site.",
      sections: [
        {
          heading: "What this site is",
          body: [
            "FX Trip Compass is an informational travel-planning comparison tool. It helps you compare destinations by currency purchasing power and exchange-rate movement, and links out to third-party booking sites.",
            "We do not sell flights, hotels, or tours ourselves. All bookings are completed on the partner site (e.g. Booking.com, Trip.com, Viator), under that partner's own terms.",
          ],
        },
        {
          heading: "Affiliate disclosure",
          body: [
            "This site earns a commission when you book through some of the outbound links we provide (an \"affiliate\" or \"referral\" relationship). This does not change the price you pay. We link to a given partner because of our commercial relationship with them, not because we have independently verified they offer the best price - always compare before booking.",
          ],
        },
        {
          heading: "Accuracy of information",
          body: [
            "Exchange rates, purchasing-power comparisons, and cost estimates on this site are for general trip-planning purposes only and are not financial advice. Rates can be delayed, cached, or (rarely) unavailable, in which case we show a clearly labeled fallback rather than a live one - always verify the actual rate/price with your bank or the booking provider before making financial decisions.",
            "Destination descriptions, suggested travel months, and estimated costs are general guidance, not guarantees.",
          ],
        },
        {
          heading: "No warranty",
          body: [
            "This site is provided \"as is\", without warranties of any kind, express or implied, to the maximum extent permitted by law.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "To the maximum extent permitted by law, [COMPANY / INDIVIDUAL NAME] is not liable for any indirect, incidental, or consequential damages arising from your use of this site or any booking made through a linked partner site.",
          ],
        },
        {
          heading: "Governing law",
          body: ["These terms are governed by the laws of [JURISDICTION - to be confirmed by the operator]."],
        },
        {
          heading: "Contact",
          body: ["Questions about these terms: [CONTACT EMAIL]."],
        },
      ],
    },
  },
  he: {
    privacy: {
      title: "מדיניות פרטיות",
      updated: "עדכון אחרון: אוגוסט 2026",
      intro:
        "FX Trip Compass (\"אנחנו\", \"האתר\") הוא כלי השוואה לתכנון טיולים. מדיניות זו מסבירה אילו מידע האתר מטפל בו ולמה. אנחנו שואפים לאסוף כמה שפחות מידע אישי.",
      sections: [
        {
          heading: "מה אנחנו אוספים",
          body: [
            "כרגע, האתר לא דורש חשבון, ואנחנו לא אוספים שם, אימייל, או כל מידע מזהה כדי להשתמש בו.",
            "בחירת השפה והמדינה שלך נשמרות ב-local storage של הדפדפן בלבד - זה נשאר במכשיר שלך ולעולם לא נשלח לשרתים שלנו.",
            "כשאתה לוחץ על קישור יוצא לשותף (Booking.com, Trip.com, Viator, ואחרים), אנחנו יוצרים מזהה קליק אקראי ולא-מזהה כדי לייחס את ההפניה לצורך עמלה. המזהה הזה לא מכיל שום מידע אישי - לא אימייל, שם, או כתובת IP.",
            "השרת שלנו רושם מידע טכני סטנדרטי (למשל כתובת IP, למניעת שימוש לרעה והגבלת קצב) לתקופה קצרה, כמו כל שרת ווב. אנחנו לא משלבים את זה עם פרופיל מעקב כלשהו.",
          ],
        },
        {
          heading: "עוגיות ואחסון מקומי",
          body: [
            "אנחנו משתמשים ב-local storage של הדפדפן (לא עוגיות) כדי לזכור את בחירת השפה והמטבע שלך. זה אחסון פונקציונלי, לא לצורכי פרסום או מעקב חוצה-אתרים.",
            "אתרי שותפים שאליהם אתה מופנה (Booking.com, Trip.com וכו') כוללים עוגיות ומעקב משלהם, בהתאם למדיניות הפרטיות שלהם.",
          ],
        },
        {
          heading: "מקורות מידע צד-שלישי",
          body: [
            "נתוני שערי החליפין מגיעים מארכיון שערים ציבורי וחינמי (fawazahmed0/currency-api, דרך רשת ה-CDN של jsDelivr). השוואות כוח קנייה משתמשות בנתוני מדד ביג מק הפומביים של The Economist. אף אחד מהמקורות האלה לא מקבל שום מידע עליך - אלה משיכות מידע חד-כיווניות בלבד.",
          ],
        },
        {
          heading: "הזכויות שלך (GDPR / CCPA ודומיהם)",
          body: [
            "מכיוון שכרגע אנחנו לא אוספים מידע אישי המשויך לאדם מזוהה, בדרך כלל אין מה לגשת אליו, לתקן, או למחוק אצלנו. אם זה ישתנה (למשל, כשתכונת חשבונות תושק), מדיניות זו תעודכן קודם, ותוכל לבקש גישה, תיקון, או מחיקה של המידע שלך בפנייה ל-[CONTACT EMAIL].",
          ],
        },
        {
          heading: "קטינים",
          body: ["אתר זה לא מיועד לילדים מתחת לגיל 16 ואנחנו לא אוספים ביודעין מידע מהם."],
        },
        {
          heading: "שינויים במדיניות זו",
          body: ["אם נהלי המידע שלנו ישתנו - למשל, כשחשבונות משתמש יושקו - נעדכן את העמוד הזה ואת תאריך העדכון האחרון למעלה."],
        },
        {
          heading: "יצירת קשר",
          body: ["שאלות לגבי מדיניות זו: [CONTACT EMAIL]. מפעיל: [COMPANY / INDIVIDUAL NAME], [JURISDICTION]."],
        },
      ],
    },
    terms: {
      title: "תנאי שימוש",
      updated: "עדכון אחרון: אוגוסט 2026",
      intro: "בשימוש ב-FX Trip Compass, אתה מסכים לתנאים הבאים. אנא קרא אותם לפני השימוש באתר.",
      sections: [
        {
          heading: "מה זה האתר הזה",
          body: [
            "FX Trip Compass הוא כלי מידע להשוואת יעדי טיול. הוא עוזר לך להשוות יעדים לפי כוח קנייה של מטבעות ותזוזת שערי חליפין, ומקשר החוצה לאתרי הזמנה של צד שלישי.",
            "אנחנו לא מוכרים טיסות, מלונות, או סיורים בעצמנו. כל ההזמנות מתבצעות באתר השותף (למשל Booking.com, Trip.com, Viator), לפי התנאים של אותו שותף.",
          ],
        },
        {
          heading: "גילוי שותפות (Affiliate)",
          body: [
            "אתר זה מרוויח עמלה כשאתה מזמין דרך חלק מהקישורים היוצאים שאנחנו מספקים (קשר \"שותפים\" / \"אפיליאייט\"). זה לא משנה את המחיר שאתה משלם. אנחנו מקשרים לשותף מסוים בגלל הקשר העסקי שלנו איתו, לא בגלל שווידאנו באופן עצמאי שהוא מציע את המחיר הטוב ביותר - תמיד תשווה לפני הזמנה.",
          ],
        },
        {
          heading: "דיוק המידע",
          body: [
            "שערי חליפין, השוואות כוח קנייה, והערכות עלות באתר זה הן למטרות תכנון טיול כלליות בלבד ואינן ייעוץ פיננסי. שערים עלולים להיות מושהים, שמורים במטמון, או (לעתים רחוקות) לא זמינים, ובמקרה כזה אנחנו מציגים שער גיבוי מתויג בבירור במקום שער חי - תמיד ודא את השער/מחיר האמיתי מול הבנק שלך או ספק ההזמנות לפני קבלת החלטות פיננסיות.",
            "תיאורי יעדים, חודשי נסיעה מומלצים, והערכות עלות הם הדרכה כללית, לא הבטחות.",
          ],
        },
        {
          heading: "אין אחריות",
          body: ["אתר זה מסופק \"כמות שהוא\" (as is), ללא אחריות מכל סוג, מפורשת או משתמעת, במידה המרבית המותרת בחוק."],
        },
        {
          heading: "הגבלת אחריות",
          body: ["במידה המרבית המותרת בחוק, [COMPANY / INDIVIDUAL NAME] לא יישא באחריות לכל נזק עקיף, מקרי, או תוצאתי הנובע משימושך באתר זה או מהזמנה כלשהי שבוצעה דרך אתר שותף מקושר."],
        },
        {
          heading: "דין חל",
          body: ["תנאים אלה כפופים לדיני [JURISDICTION - לאישור על ידי המפעיל]."],
        },
        {
          heading: "יצירת קשר",
          body: ["שאלות לגבי תנאים אלה: [CONTACT EMAIL]."],
        },
      ],
    },
  },
  es: {
    privacy: {
      title: "Política de Privacidad",
      updated: "Última actualización: agosto de 2026",
      intro:
        "FX Trip Compass (\"nosotros\", \"el sitio\") es una herramienta de comparación para planificar viajes. Esta política explica qué información maneja el sitio y por qué.",
      sections: [
        {
          heading: "Qué recopilamos",
          body: [
            "Actualmente, el sitio no requiere cuenta, y no recopilamos tu nombre, email, ni información identificable para usarlo.",
            "Tu idioma y país de origen se guardan solo en el almacenamiento local de tu navegador - nunca se envía a nuestros servidores.",
            "Al hacer clic en un enlace a un socio (Booking.com, Trip.com, Viator, u otros), generamos un ID de clic aleatorio y no identificable para atribuir la referencia. No contiene información personal.",
            "Nuestro servidor registra datos técnicos estándar (p. ej. IP, para prevención de abuso) brevemente, como cualquier servidor web.",
          ],
        },
        {
          heading: "Cookies y almacenamiento local",
          body: [
            "Usamos almacenamiento local del navegador (no cookies) para recordar tu idioma y moneda. Es almacenamiento funcional, no publicitario.",
            "Los sitios socios (Booking.com, Trip.com, etc.) tienen sus propias cookies, regidas por sus políticas.",
          ],
        },
        {
          heading: "Fuentes de datos de terceros",
          body: [
            "Los tipos de cambio provienen de un archivo público gratuito (fawazahmed0/currency-api, vía jsDelivr). Las comparaciones de poder adquisitivo usan datos públicos del Big Mac Index de The Economist.",
          ],
        },
        {
          heading: "Tus derechos (RGPD / CCPA)",
          body: [
            "Como no recopilamos datos personales identificables actualmente, generalmente no hay nada que acceder o eliminar. Si esto cambia, esta política se actualizará primero. Contacto: [CONTACT EMAIL].",
          ],
        },
        {
          heading: "Menores",
          body: ["Este sitio no está dirigido a menores de 16 años."],
        },
        {
          heading: "Cambios a esta política",
          body: ["Actualizaremos esta página si nuestras prácticas de datos cambian."],
        },
        {
          heading: "Contacto",
          body: ["[CONTACT EMAIL]. Operador: [COMPANY / INDIVIDUAL NAME], [JURISDICTION]."],
        },
      ],
    },
    terms: {
      title: "Términos de Servicio",
      updated: "Última actualización: agosto de 2026",
      intro: "Al usar FX Trip Compass, aceptas los siguientes términos.",
      sections: [
        {
          heading: "Qué es este sitio",
          body: [
            "Herramienta informativa de comparación de viajes por poder adquisitivo y tipo de cambio, que enlaza a sitios de reserva de terceros.",
            "No vendemos vuelos, hoteles ni tours - las reservas se completan en el sitio del socio.",
          ],
        },
        {
          heading: "Divulgación de afiliación",
          body: ["Ganamos comisión en algunas reservas por enlaces salientes. Esto no cambia tu precio. Compara siempre antes de reservar."],
        },
        {
          heading: "Exactitud de la información",
          body: [
            "Tipos de cambio y estimaciones son orientativos, no asesoramiento financiero. Verifica siempre con tu banco o el proveedor.",
          ],
        },
        {
          heading: "Sin garantía",
          body: ["Este sitio se proporciona \"tal cual\", sin garantías de ningún tipo."],
        },
        {
          heading: "Limitación de responsabilidad",
          body: ["[COMPANY / INDIVIDUAL NAME] no es responsable de daños indirectos derivados del uso de este sitio."],
        },
        {
          heading: "Ley aplicable",
          body: ["[JURISDICTION - a confirmar]."],
        },
        {
          heading: "Contacto",
          body: ["[CONTACT EMAIL]."],
        },
      ],
    },
  },
  fr: {
    privacy: {
      title: "Politique de confidentialité",
      updated: "Dernière mise à jour : août 2026",
      intro:
        "FX Trip Compass (\"nous\", \"le site\") est un outil de comparaison pour la planification de voyages. Cette politique explique quelles informations le site traite et pourquoi.",
      sections: [
        {
          heading: "Ce que nous collectons",
          body: [
            "Le site ne nécessite pas de compte, et nous ne collectons ni nom, ni email, ni information identifiable.",
            "Votre langue et pays d'origine sont enregistrés uniquement dans le stockage local du navigateur.",
            "En cliquant sur un lien partenaire, nous générons un identifiant de clic aléatoire non identifiant, sans information personnelle.",
            "Notre serveur enregistre des données techniques standard (adresse IP) brièvement, comme tout serveur web.",
          ],
        },
        {
          heading: "Cookies et stockage local",
          body: [
            "Nous utilisons le stockage local (pas de cookies) pour mémoriser votre langue et devise. Stockage fonctionnel uniquement.",
            "Les sites partenaires ont leurs propres cookies, régis par leurs propres politiques.",
          ],
        },
        {
          heading: "Sources de données tierces",
          body: ["Taux de change : archive publique gratuite (fawazahmed0/currency-api, via jsDelivr). Pouvoir d'achat : données publiques du Big Mac Index de The Economist."],
        },
        {
          heading: "Vos droits (RGPD / CCPA)",
          body: ["Nous ne collectons actuellement aucune donnée personnelle identifiable. Si cela change, cette politique sera mise à jour en premier. Contact : [CONTACT EMAIL]."],
        },
        {
          heading: "Enfants",
          body: ["Ce site ne s'adresse pas aux enfants de moins de 16 ans."],
        },
        {
          heading: "Modifications",
          body: ["Nous mettrons à jour cette page si nos pratiques changent."],
        },
        {
          heading: "Contact",
          body: ["[CONTACT EMAIL]. Opérateur : [COMPANY / INDIVIDUAL NAME], [JURISDICTION]."],
        },
      ],
    },
    terms: {
      title: "Conditions d'utilisation",
      updated: "Dernière mise à jour : août 2026",
      intro: "En utilisant FX Trip Compass, vous acceptez les conditions suivantes.",
      sections: [
        {
          heading: "Ce qu'est ce site",
          body: [
            "Outil informatif de comparaison de voyages par pouvoir d'achat et taux de change, renvoyant vers des sites de réservation tiers.",
            "Nous ne vendons pas nous-mêmes de vols, hôtels ou circuits - les réservations se font sur le site du partenaire.",
          ],
        },
        {
          heading: "Divulgation d'affiliation",
          body: ["Nous percevons une commission sur certaines réservations via nos liens sortants. Cela ne change pas votre prix. Comparez toujours avant de réserver."],
        },
        {
          heading: "Exactitude des informations",
          body: ["Taux de change et estimations sont indicatifs, pas un conseil financier. Vérifiez toujours auprès de votre banque ou du fournisseur."],
        },
        {
          heading: "Aucune garantie",
          body: ["Ce site est fourni \"tel quel\", sans garantie d'aucune sorte."],
        },
        {
          heading: "Limitation de responsabilité",
          body: ["[COMPANY / INDIVIDUAL NAME] n'est pas responsable des dommages indirects découlant de l'utilisation de ce site."],
        },
        {
          heading: "Loi applicable",
          body: ["[JURISDICTION - à confirmer]."],
        },
        {
          heading: "Contact",
          body: ["[CONTACT EMAIL]."],
        },
      ],
    },
  },
};
