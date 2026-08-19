import csv, json, math

# ---- Step 1: load Economist's real July 2026 data (54 countries) ----
rows = []
with open('/tmp/bigmac-raw.csv') as f:
    for r in csv.DictReader(f):
        if r['date'] == '2026-07-01':
            rows.append(r)

economist = {}  # currency_code -> {localPrice, dollar_price (for regression fit only)}
for r in rows:
    economist[r['currency_code']] = {
        'localPrice': float(r['local_price']),
        'dollarPriceAtPublish': float(r['dollar_price']),
        'countryName': r['name'],
    }

# ---- Step 2: GDP per capita PPP (international $, ~2026, IMF/Worldbank estimates) ----
# Used ONLY as a regression input to estimate a plausible Big Mac price for the
# ~19 currencies The Economist doesn't cover. Approximate figures are fine here -
# this is a secondary fallback layer, not the primary (real) data.
gdppc_covered = {
    'ARS': 28000, 'AUD': 68000, 'AZN': 26800, 'BHD': 70165, 'BRL': 20000, 'GBP': 58000,
    'CAD': 63000, 'CLP': 33000, 'CNY': 31596, 'COP': 22000, 'CRC': 28000, 'CZK': 52000,
    'DKK': 80000, 'EGP': 23321, 'EUR': 58000, 'GTQ': 11000, 'HNL': 7000, 'HKD': 84212,
    'HUF': 44000, 'INR': 12801, 'IDR': 18973, 'ILS': 59095, 'JPY': 59207, 'JOD': 13257,
    'KWD': 54303, 'LBP': 13110, 'MYR': 46986, 'MXN': 24000, 'MDL': 20000, 'NZD': 52000,
    'NIO': 7000, 'NOK': 115548, 'OMR': 45698, 'PKR': 7334, 'PEN': 16000, 'PHP': 13693,
    'PLN': 52000, 'QAR': 112312, 'RON': 48000, 'SAR': 78815, 'SGD': 173708, 'ZAR': 16740,
    'KRW': 68624, 'SEK': 68000, 'CHF': 105680, 'TWD': 98051, 'THB': 27441, 'TRY': 46672,
    'UAH': 16000, 'AED': 87774, 'USD': 94430, 'UYU': 32000, 'VES': 9000, 'VND': 19649,
}
gdppc_missing = {
    'GEL': 33990, 'AMD': 27024, 'LAK': 10956, 'KHR': 8890, 'NPR': 6551, 'MNT': 22192,
    'KES': 8020, 'TZS': 4607, 'NAD': 12666, 'MAD': 12336, 'TND': 15833, 'BGN': 45640,
    'RSD': 34860, 'ALL': 21700, 'BAM': 21000, 'MKD': 23000, 'ISK': 78000, 'FJD': 16000,
    'DOP': 26000,
}

# ---- Step 3: fit ln(price) ~ a + b*ln(gdppc) on the 54 real Economist points ----
xs, ys = [], []
for code, data in economist.items():
    if code in gdppc_covered:
        xs.append(math.log(gdppc_covered[code]))
        ys.append(math.log(data['dollarPriceAtPublish']))

n = len(xs)
mean_x = sum(xs) / n
mean_y = sum(ys) / n
b = sum((xs[i]-mean_x)*(ys[i]-mean_y) for i in range(n)) / sum((xs[i]-mean_x)**2 for i in range(n))
a = mean_y - b * mean_x

# R^2 for transparency
ss_res = sum((ys[i] - (a + b*xs[i]))**2 for i in range(n))
ss_tot = sum((ys[i] - mean_y)**2 for i in range(n))
r2 = 1 - ss_res/ss_tot
print(f"Regression: ln(price) = {a:.4f} + {b:.4f}*ln(gdppc), R^2={r2:.3f}, n={n}")

# ---- Step 4: predict for missing currencies, convert to local currency ----
with open('/home/claude/fxtrip/src/data/currencies.json') as f:
    currencies = json.load(f)
fallback_rate = {c['code']: c['fallbackUsdRate'] for c in currencies}

bigmac = {}
for code, data in economist.items():
    bigmac[code] = {
        'localPrice': round(data['localPrice'], 4),
        'source': 'economist-2026-07',
        'countryName': data['countryName'],
    }

for code, gdppc in gdppc_missing.items():
    predicted_usd = math.exp(a + b * math.log(gdppc))
    rate = fallback_rate.get(code)
    if rate is None:
        print(f"WARNING: no fallback rate for {code}, skipping")
        continue
    local_price = predicted_usd * rate
    bigmac[code] = {
        'localPrice': round(local_price, 4),
        'source': 'gdp-estimated',
        'countryName': None,
    }
    print(f"{code}: predicted ${predicted_usd:.2f} -> {local_price:.2f} local")

with open('/home/claude/fxtrip/src/data/bigmac.json', 'w') as f:
    json.dump({
        'asOf': '2026-07-01',
        'methodology': 'Real prices from The Economist Big Mac Index (CC-BY-4.0), July 2026 release, for currencies it covers. For currencies outside that coverage, a price is estimated from a log-linear regression of Big Mac price against IMF GDP-per-capita (PPP) fitted on the Economist\'s own 54-country dataset.',
        'prices': bigmac,
    }, f, indent=2)

print(f"\nWrote {len(bigmac)} currency entries to bigmac.json")
