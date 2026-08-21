import json

with open('src/data/destinations.json') as f:
    dests = json.load(f)

new = [
    {
        "id": "d60", "name": "האנוי", "nameEn": "Hanoi", "country": "וייטנאם", "countryEn": "Vietnam",
        "countryCode": "VN", "currencyCode": "VND", "region": "Asia", "lat": 21.03,
        "bestMonths": [10, 11, 12, 3], "avgDailyBudgetUSD": 30, "minStars": [2, 3, 4],
        "hiddenGem": False, "description": "בירת וייטנאם עם רובע עתיק תוסס ואגם מרכזי.",
        "descriptionEn": "Vietnam's capital, with a lively old quarter and a central lake.",
        "theme": "city", "tags": ["היסטוריה", "עיר גדולה"], "tagKeys": ["history", "bigcity"],
    },
    {
        "id": "d61", "name": "אובוד", "nameEn": "Ubud", "country": "אינדונזיה", "countryEn": "Indonesia",
        "countryCode": "ID", "currencyCode": "IDR", "region": "Asia", "lat": -8.51,
        "bestMonths": [5, 6, 7, 8, 9], "avgDailyBudgetUSD": 32, "minStars": [3, 4, 5],
        "hiddenGem": False, "description": "מרכז התרבות והיוגה של באלי, בין טרסות אורז ומקדשים.",
        "descriptionEn": "Bali's cultural and yoga hub, amid rice terraces and temples.",
        "theme": "village", "tags": ["טבע", "גנים"], "tagKeys": ["nature", "gardens"],
    },
    {
        "id": "d62", "name": "סיאם ריפ", "nameEn": "Siem Reap", "country": "קמבודיה", "countryEn": "Cambodia",
        "countryCode": "KH", "currencyCode": "KHR", "region": "Asia", "lat": 13.36,
        "bestMonths": [11, 12, 1, 2], "avgDailyBudgetUSD": 28, "minStars": [3, 4, 5],
        "hiddenGem": False, "description": "השער לאנגקור וואט, עם רחוב מסעדות ושווקי לילה תוססים.",
        "descriptionEn": "The gateway to Angkor Wat, with a lively restaurant strip and night markets.",
        "theme": "historic", "tags": ["היסטוריה", "עיר גדולה"], "tagKeys": ["history", "bigcity"],
    },
    {
        "id": "d63", "name": "וייטיאן", "nameEn": "Vientiane", "country": "לאוס", "countryEn": "Laos",
        "countryCode": "LA", "currencyCode": "LAK", "region": "Asia", "lat": 17.97,
        "bestMonths": [11, 12, 1, 2], "avgDailyBudgetUSD": 26, "minStars": [2, 3, 4],
        "hiddenGem": False, "description": "בירה רגועה על גדות המקונג, בלי הכאוס של ערי בירה אחרות באזור.",
        "descriptionEn": "A relaxed Mekong-side capital, without the chaos of other regional capitals.",
        "theme": "city", "tags": ["היסטוריה"], "tagKeys": ["history"],
    },
    {
        "id": "d64", "name": "פוקהרה", "nameEn": "Pokhara", "country": "נפאל", "countryEn": "Nepal",
        "countryCode": "NP", "currencyCode": "NPR", "region": "Asia", "lat": 28.21,
        "bestMonths": [10, 11, 3, 4], "avgDailyBudgetUSD": 24, "minStars": [2, 3, 4],
        "hiddenGem": False, "description": "עיר האגם השנייה בגודלה בנפאל, בסיס לטרק אנאפורנה.",
        "descriptionEn": "Nepal's second lake city, base camp for the Annapurna trek.",
        "theme": "mountain", "tags": ["הרים", "אגם"], "tagKeys": ["mountains", "lake"],
    },
    {
        "id": "d65", "name": "מומבסה", "nameEn": "Mombasa", "country": "קניה", "countryEn": "Kenya",
        "countryCode": "KE", "currencyCode": "KES", "region": "Africa", "lat": -4.04,
        "bestMonths": [1, 2, 7, 8, 9], "avgDailyBudgetUSD": 40, "minStars": [3, 4],
        "hiddenGem": False, "description": "עיר החוף השנייה בגודלה בקניה, עם השפעה סוואהילית וערבית.",
        "descriptionEn": "Kenya's second coastal city, with strong Swahili and Arab influences.",
        "theme": "coast", "tags": ["חופים", "היסטוריה"], "tagKeys": ["beaches", "history"],
    },
    {
        "id": "d66", "name": "דאר א-סלאם", "nameEn": "Dar es Salaam", "country": "טנזניה", "countryEn": "Tanzania",
        "countryCode": "TZ", "currencyCode": "TZS", "region": "Africa", "lat": -6.79,
        "bestMonths": [6, 7, 8, 9], "avgDailyBudgetUSD": 38, "minStars": [3, 4],
        "hiddenGem": False, "description": "העיר הגדולה ביותר בטנזניה, שער לזנזיבר וספארי.",
        "descriptionEn": "Tanzania's largest city, gateway to Zanzibar and safaris.",
        "theme": "coast", "tags": ["חופים", "עיר גדולה"], "tagKeys": ["beaches", "bigcity"],
    },
    {
        "id": "d67", "name": "אלכסנדריה", "nameEn": "Alexandria", "country": "מצרים", "countryEn": "Egypt",
        "countryCode": "EG", "currencyCode": "EGP", "region": "Africa", "lat": 31.2,
        "bestMonths": [4, 5, 10, 11], "avgDailyBudgetUSD": 28, "minStars": [3, 4],
        "hiddenGem": False, "description": "עיר החוף התיכונית ההיסטורית של מצרים, פחות תיירותית מקהיר.",
        "descriptionEn": "Egypt's historic Mediterranean port city, less touristed than Cairo.",
        "theme": "coast", "tags": ["חופים", "היסטוריה"], "tagKeys": ["beaches", "history"],
    },
    {
        "id": "d68", "name": "פס", "nameEn": "Fez", "country": "מרוקו", "countryEn": "Morocco",
        "countryCode": "MA", "currencyCode": "MAD", "region": "Africa", "lat": 34.03,
        "bestMonths": [4, 5, 9, 10], "avgDailyBudgetUSD": 35, "minStars": [3, 4],
        "hiddenGem": False, "description": "העיר העתיקה השמורה ביותר במרוקו, עם המדינה הגדולה בעולם.",
        "descriptionEn": "Morocco's best-preserved old city, home to the world's largest car-free urban area.",
        "theme": "historic", "tags": ["היסטוריה", "אדריכלות"], "tagKeys": ["history", "architecture"],
    },
    {
        "id": "d69", "name": "ג'איפור", "nameEn": "Jaipur", "country": "הודו", "countryEn": "India",
        "countryCode": "IN", "currencyCode": "INR", "region": "Asia", "lat": 26.91,
        "bestMonths": [11, 12, 1, 2], "avgDailyBudgetUSD": 26, "minStars": [3, 4, 5],
        "hiddenGem": False, "description": "עיר הוורוד, פינה במשולש הזהב ההודי הקלאסי.",
        "descriptionEn": "The Pink City, a corner of India's classic Golden Triangle.",
        "theme": "historic", "tags": ["היסטוריה", "אדריכלות"], "tagKeys": ["history", "architecture"],
    },
    {
        "id": "d70", "name": "סבו", "nameEn": "Cebu City", "country": "פיליפינים", "countryEn": "Philippines",
        "countryCode": "PH", "currencyCode": "PHP", "region": "Asia", "lat": 10.32,
        "bestMonths": [1, 2, 3, 4], "avgDailyBudgetUSD": 32, "minStars": [3, 4],
        "hiddenGem": False, "description": "העיר השנייה בגודלה בפיליפינים, שער לאיים המרכזיים.",
        "descriptionEn": "The Philippines' second-largest city, gateway to the central islands.",
        "theme": "city", "tags": ["חופים", "עיר גדולה"], "tagKeys": ["beaches", "bigcity"],
    },
]

dests.extend(new)
with open('src/data/destinations.json', 'w') as f:
    json.dump(dests, f, ensure_ascii=False, indent=2)

print(f"Added {len(new)} anchor destinations. Total now: {len(dests)}")
hidden = sum(1 for x in dests if x['hiddenGem'])
print(f"Hidden gems: {hidden}, anchors: {len(dests)-hidden}, ratio 1:{hidden/(len(dests)-hidden):.1f}")
