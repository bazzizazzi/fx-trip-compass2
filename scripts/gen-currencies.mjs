// Generates src/data/currencies.json
// Every rate is "units of CURRENCY per 1 USD" — this single convention is what
// lets us cross-convert ANY pair (e.g. ILS -> JPY) accurately without storing
// every possible pair. See src/lib/fx.ts for the cross-rate math + why we
// never round intermediate USD legs.
//
// Sample/illustrative data (this sandbox has no live FX API access — see README
// for how to wire in a real provider like exchangerate.host or Open Exchange Rates).

import { writeFileSync } from "fs";

const currencies = [
  // code, name, symbol, region, rate now, rate 1y ago, rate 5y ago
  ["USD", "US Dollar", "$", "Americas", 1, 1, 1],
  ["ILS", "Israeli Shekel", "₪", "Middle East", 3.702, 3.81, 3.24],
  ["EUR", "Euro", "€", "Europe", 0.9238, 0.955, 0.845],
  ["GBP", "British Pound", "£", "Europe", 0.7814, 0.804, 0.732],
  ["CHF", "Swiss Franc", "Fr", "Europe", 0.8851, 0.905, 0.918],
  ["JPY", "Japanese Yen", "¥", "Asia", 157.82, 152.4, 106.1],
  ["KRW", "South Korean Won", "₩", "Asia", 1421.5, 1385.2, 1180.3],
  ["CNY", "Chinese Yuan", "¥", "Asia", 7.183, 7.24, 6.46],
  ["TWD", "Taiwan Dollar", "NT$", "Asia", 32.47, 31.9, 28.05],
  ["HKD", "Hong Kong Dollar", "HK$", "Asia", 7.802, 7.81, 7.75],
  ["THB", "Thai Baht", "฿", "Asia", 34.18, 35.1, 31.2],
  ["VND", "Vietnamese Dong", "₫", "Asia", 25410, 24950, 23100],
  ["IDR", "Indonesian Rupiah", "Rp", "Asia", 16148, 15850, 14250],
  ["PHP", "Philippine Peso", "₱", "Asia", 58.34, 56.9, 49.6],
  ["MYR", "Malaysian Ringgit", "RM", "Asia", 4.452, 4.68, 4.15],
  ["SGD", "Singapore Dollar", "S$", "Asia", 1.309, 1.34, 1.35],
  ["INR", "Indian Rupee", "₹", "Asia", 87.42, 83.6, 74.3],
  ["LKR", "Sri Lankan Rupee", "Rs", "Asia", 298.4, 305.1, 186.5],
  ["NPR", "Nepalese Rupee", "Rs", "Asia", 139.8, 133.8, 118.9],
  ["KHR", "Cambodian Riel", "៛", "Asia", 4085, 4080, 4085],
  ["LAK", "Lao Kip", "₭", "Asia", 21750, 21300, 9450],
  ["MNT", "Mongolian Tugrik", "₮", "Asia", 3452, 3400, 2850],
  ["AUD", "Australian Dollar", "A$", "Oceania", 1.534, 1.51, 1.31],
  ["NZD", "New Zealand Dollar", "NZ$", "Oceania", 1.682, 1.63, 1.4],
  ["FJD", "Fijian Dollar", "FJ$", "Oceania", 2.291, 2.24, 2.11],
  ["CAD", "Canadian Dollar", "C$", "Americas", 1.404, 1.36, 1.27],
  ["MXN", "Mexican Peso", "MX$", "Americas", 18.72, 17.1, 20.1],
  ["GTQ", "Guatemalan Quetzal", "Q", "Americas", 7.72, 7.75, 7.68],
  ["CRC", "Costa Rican Colón", "₡", "Americas", 505.3, 530.8, 615.4],
  ["DOP", "Dominican Peso", "RD$", "Americas", 60.21, 58.9, 56.4],
  ["BRL", "Brazilian Real", "R$", "Americas", 5.552, 5.12, 5.35],
  ["ARS", "Argentine Peso", "$", "Americas", 1265.4, 985.2, 95.1],
  ["COP", "Colombian Peso", "COL$", "Americas", 4102, 4020, 3720],
  ["PEN", "Peruvian Sol", "S/", "Americas", 3.748, 3.7, 3.62],
  ["CLP", "Chilean Peso", "CLP$", "Americas", 945.6, 920.3, 785.2],
  ["UYU", "Uruguayan Peso", "$U", "Americas", 41.85, 40.2, 43.6],
  ["ZAR", "South African Rand", "R", "Africa", 18.14, 18.6, 15.1],
  ["EGP", "Egyptian Pound", "E£", "Africa", 49.52, 47.9, 15.7],
  ["MAD", "Moroccan Dirham", "MAD", "Africa", 9.954, 9.98, 9.05],
  ["TND", "Tunisian Dinar", "DT", "Africa", 3.081, 3.1, 2.79],
  ["KES", "Kenyan Shilling", "KSh", "Africa", 129.3, 132.8, 108.2],
  ["TZS", "Tanzanian Shilling", "TSh", "Africa", 2510, 2530, 2310],
  ["GHS", "Ghanaian Cedi", "GH₵", "Africa", 15.62, 14.2, 5.9],
  ["XOF", "West African CFA Franc", "CFA", "Africa", 605.3, 622.4, 550.1],
  ["NAD", "Namibian Dollar", "N$", "Africa", 18.14, 18.6, 15.1],
  ["TRY", "Turkish Lira", "₺", "Europe", 39.82, 32.6, 8.45],
  ["GEL", "Georgian Lari", "₾", "Europe", 2.724, 2.68, 3.11],
  ["AMD", "Armenian Dram", "֏", "Europe", 398.2, 387.5, 480.6],
  ["AZN", "Azerbaijani Manat", "₼", "Europe", 1.702, 1.7, 1.7],
  ["RSD", "Serbian Dinar", "din", "Europe", 108.3, 111.9, 99.4],
  ["BGN", "Bulgarian Lev", "лв", "Europe", 1.806, 1.868, 1.653],
  ["RON", "Romanian Leu", "lei", "Europe", 4.583, 4.57, 4.14],
  ["HUF", "Hungarian Forint", "Ft", "Europe", 385.4, 357.2, 300.1],
  ["PLN", "Polish Złoty", "zł", "Europe", 4.021, 4.05, 3.79],
  ["CZK", "Czech Koruna", "Kč", "Europe", 22.94, 23.4, 21.6],
  ["ALL", "Albanian Lek", "L", "Europe", 92.5, 95.8, 104.2],
  ["MKD", "Macedonian Denar", "ден", "Europe", 56.94, 58.7, 52.1],
  ["BAM", "Bosnian Mark", "KM", "Europe", 1.807, 1.868, 1.653],
  ["ISK", "Icelandic Króna", "kr", "Europe", 138.5, 137.1, 129.8],
  ["NOK", "Norwegian Krone", "kr", "Europe", 10.85, 10.6, 8.65],
  ["SEK", "Swedish Krona", "kr", "Europe", 10.35, 10.4, 8.9],
  ["DKK", "Danish Krone", "kr", "Europe", 6.897, 7.12, 6.3],
  ["JOD", "Jordanian Dinar", "JD", "Middle East", 0.709, 0.709, 0.709],
  ["RUB", "Russian Ruble", "₽", "Europe", 92.5, 91.2, 74.1],
  ["UAH", "Ukrainian Hryvnia", "₴", "Europe", 41.6, 39.8, 27.3],
];

const data = currencies.map(([code, name, symbol, region, now, y1, y5]) => ({
  code,
  name,
  symbol,
  region,
  usdRate: now,
  usdRateYearAgo: y1,
  usdRate5yAgo: y5,
}));

writeFileSync(
  new URL("../src/data/currencies.json", import.meta.url),
  JSON.stringify(data, null, 2)
);
console.log(`Wrote ${data.length} currencies`);
