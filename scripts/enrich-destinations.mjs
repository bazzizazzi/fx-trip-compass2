import { readFileSync, writeFileSync } from "fs";

const enrich = {
  d1:  { descriptionEn: "A stone village straddling a shallow river, nicknamed the 'Venice of the Cotswolds' — not London, not Manchester.", countryEn: "England", theme: "village" },
  d2:  { descriptionEn: "A medieval port town with sloping cobbled streets in the south-east of England.", countryEn: "England", theme: "coast" },
  d3:  { descriptionEn: "Colourful half-timbered houses and canals — rural Alsace, not Paris.", countryEn: "France", theme: "village" },
  d4:  { descriptionEn: "A turquoise lake at the foot of the Alps, nicknamed the 'Venice of the Alps'.", countryEn: "France", theme: "lake" },
  d5:  { descriptionEn: "A stone village perched on a cliff amid the lavender fields of Provence.", countryEn: "France", theme: "village" },
  d6:  { descriptionEn: "An Etruscan hill town on a volcanic tuff outcrop in quiet Umbria.", countryEn: "Italy", theme: "village" },
  d7:  { descriptionEn: "A 9,000-year-old cave city in southern Italy, far less crowded than Tuscany.", countryEn: "Italy", theme: "historic" },
  d8:  { descriptionEn: "The most photogenic of the five Cinque Terre villages on the Italian Riviera.", countryEn: "Italy", theme: "coast" },
  d9:  { descriptionEn: "A walled medieval town an hour from Lisbon.", countryEn: "Portugal", theme: "historic" },
  d10: { descriptionEn: "A fishing village famous for the biggest waves on Earth, not just the Algarve.", countryEn: "Portugal", theme: "coast" },
  d11: { descriptionEn: "A Venetian-built port town in the Peloponnese, a quiet alternative to the islands.", countryEn: "Greece", theme: "coast" },
  d12: { descriptionEn: "Monasteries perched on giant rock pillars in central Greece.", countryEn: "Greece", theme: "mountain" },
  d13: { descriptionEn: "An alpine lakeside village and one of the most photographed views in Europe.", countryEn: "Austria", theme: "lake" },
  d14: { descriptionEn: "A medieval town wrapped in a river bend, two hours from Prague.", countryEn: "Czechia", theme: "village" },
  d15: { descriptionEn: "A fortified old town in Transylvania, legendary birthplace of Dracula.", countryEn: "Romania", theme: "historic" },
  d16: { descriptionEn: "A fjord-like Adriatic bay ringed by mountains, far cheaper than Croatia.", countryEn: "Montenegro", theme: "coast" },
  d17: { descriptionEn: "The 'city of love' in Georgia's Kakheti wine region, overlooking the Alazani valley.", countryEn: "Georgia", theme: "village" },
  d18: { descriptionEn: "Ancient defensive towers below the highest peaks of the Caucasus.", countryEn: "Georgia", theme: "mountain" },
  d19: { descriptionEn: "Armenia's 'Little Switzerland' — forests, monasteries, and mineral springs.", countryEn: "Armenia", theme: "mountain" },
  d20: { descriptionEn: "A city on seven hills, one of Europe's oldest, still barely touristed.", countryEn: "Bulgaria", theme: "historic" },
  d21: { descriptionEn: "Gateway to the Carpathians, a colourful Saxon town near Dracula's castle.", countryEn: "Romania", theme: "mountain" },
  d22: { descriptionEn: "A mountain town with a preserved samurai quarter, not crowded Kyoto.", countryEn: "Japan", theme: "village" },
  d23: { descriptionEn: "One of the world's most perfect Japanese gardens plus a quiet geisha district.", countryEn: "Japan", theme: "historic" },
  d24: { descriptionEn: "An art island with underground museums in Japan's Seto Inland Sea.", countryEn: "Japan", theme: "island" },
  d25: { descriptionEn: "An old lantern-lit trading port, not chaotic Ho Chi Minh City.", countryEn: "Vietnam", theme: "historic" },
  d26: { descriptionEn: "The 'inland Ha Long Bay' — rivers threading between limestone cliffs and rice fields.", countryEn: "Vietnam", theme: "mountain" },
  d27: { descriptionEn: "A Buddhist monastery town on the Mekong, unusually calm.", countryEn: "Laos", theme: "historic" },
  d28: { descriptionEn: "Colonial architecture and the bamboo railway, without Siem Reap's crowds.", countryEn: "Cambodia", theme: "village" },
  d29: { descriptionEn: "A quiet Bali rice valley — what Ubud looked like a decade ago.", countryEn: "Indonesia", theme: "village" },
  d30: { descriptionEn: "Gateway to Komodo Island and turquoise bays, far less known than Bali.", countryEn: "Indonesia", theme: "coast" },
  d31: { descriptionEn: "A UNESCO rice-terrace village in the Cordillera mountains.", countryEn: "Philippines", theme: "mountain" },
  d32: { descriptionEn: "A mystic island with waterfalls and turquoise water, barely touristed.", countryEn: "Philippines", theme: "island" },
  d33: { descriptionEn: "Colourful French quarters on the Bay of Bengal, not New Delhi.", countryEn: "India", theme: "coast" },
  d34: { descriptionEn: "Ruins of the Vijayanagara empire amid surreal boulder landscapes.", countryEn: "India", theme: "historic" },
  d35: { descriptionEn: "Trekking villages around Pokhara that aren't Kathmandu, with Annapurna views.", countryEn: "Nepal", theme: "mountain" },
  d36: { descriptionEn: "The blue city in the Rif mountains, entirely unlike Marrakesh.", countryEn: "Morocco", theme: "village" },
  d37: { descriptionEn: "A windswept Atlantic port town with a relaxed artists' market.", countryEn: "Morocco", theme: "coast" },
  d38: { descriptionEn: "The small town gateway to Petra's red rock, not just Amman.", countryEn: "Jordan", theme: "desert" },
  d39: { descriptionEn: "White-sand Mediterranean beaches, almost empty of foreign tourists.", countryEn: "Egypt", theme: "coast" },
  d40: { descriptionEn: "A colourful colonial town on the central plateau, calmer than Cancún.", countryEn: "Mexico", theme: "village" },
  d41: { descriptionEn: "The 'lagoon of seven colours' — a calm Caribbean alternative to Tulum.", countryEn: "Mexico", theme: "lake" },
  d42: { descriptionEn: "A colourful coffee village among the world's tallest wax palm valleys.", countryEn: "Colombia", theme: "village" },
  d43: { descriptionEn: "A colourful village on a man-made lake with a giant climbable rock, two hours from Medellín.", countryEn: "Colombia", theme: "lake" },
  d44: { descriptionEn: "A living Inca village still built on its original foundations, gateway to Machu Picchu.", countryEn: "Peru", theme: "mountain" },
  d45: { descriptionEn: "A green oasis ringed by giant sand dunes in the coastal desert.", countryEn: "Peru", theme: "desert" },
  d46: { descriptionEn: "An old Portuguese-Spanish port town across the water from Buenos Aires.", countryEn: "Uruguay", theme: "historic" },
  d47: { descriptionEn: "An adventure town at the foot of an active volcano and blue lakes.", countryEn: "Chile", theme: "mountain" },
  d48: { descriptionEn: "A German colonial town between the Namib desert and the cold Atlantic.", countryEn: "Namibia", theme: "desert" },
  d49: { descriptionEn: "Zanzibar's spice-trade old town, ahead of the well-known beaches.", countryEn: "Tanzania", theme: "historic" },
  d50: { descriptionEn: "A car-free Swahili island, one of East Africa's best-preserved old towns.", countryEn: "Kenya", theme: "island" },
  d51: { descriptionEn: "A huge, vibrant capital — a useful price reference point for Southeast Asia.", countryEn: "Thailand", theme: "city" },
  d52: { descriptionEn: "One of Western Europe's cheapest capitals, a solid reference point.", countryEn: "Portugal", theme: "city" },
  d53: { descriptionEn: "A European-feeling capital in South America, dramatically cheaper with the currency move.", countryEn: "Argentina", theme: "city" },
  d54: { descriptionEn: "A city on two continents, a price reference point for the Middle East-Europe corridor.", countryEn: "Turkey", theme: "city" },
  d55: { descriptionEn: "South Africa's coastal capital, a continental reference point.", countryEn: "South Africa", theme: "coast" },
  d56: { descriptionEn: "A cheap, lively Caucasus capital, a regional reference point.", countryEn: "Georgia", theme: "city" },
  d57: { descriptionEn: "A Central European cultural capital at an accessible price.", countryEn: "Poland", theme: "city" },
  d58: { descriptionEn: "A huge high-altitude metropolis, a reference point for Mexico prices.", countryEn: "Mexico", theme: "city" },
  d59: { descriptionEn: "Not currently shown as a recommended destination due to active war.", countryEn: "Ukraine", theme: "city" },
};

const raw = readFileSync(new URL("../src/data/destinations.json", import.meta.url), "utf-8");
const destinations = JSON.parse(raw);

const merged = destinations.map((d) => {
  const e = enrich[d.id];
  if (!e) throw new Error(`Missing enrichment for ${d.id}`);
  return { ...d, descriptionEn: e.descriptionEn, countryEn: e.countryEn, theme: e.theme };
});

writeFileSync(new URL("../src/data/destinations.json", import.meta.url), JSON.stringify(merged, null, 2));
console.log(`Enriched ${merged.length} destinations`);
