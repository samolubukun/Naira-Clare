const CACHE_KEY = "nairaclare_currency_rates_v2";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const currencies = [
  { code: "NGN", symbol: "₦", label: "NGN" },
  { code: "USD", symbol: "$", label: "USD" },
  { code: "GBP", symbol: "£", label: "GBP" },
  { code: "EUR", symbol: "€", label: "EUR" },
];

export async function getExchangeRates() {
  if (typeof window === "undefined") return null;

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { rates, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return rates;
    }
  }
  try {
    // Switching to ExchangeRate-API (Free Tier) as it supports NGN reliably
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await response.json();
    
    if (data && data.rates) {
      const rates = {
        USD: 1,
        NGN: data.rates.NGN,
        EUR: data.rates.EUR,
        GBP: data.rates.GBP,
      };

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ rates, timestamp: Date.now() })
      );
      return rates;
    }
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
  }

  return null;
}

export function convertToNGN(amount, fromCurrency, rates) {
  if (!rates || fromCurrency === "NGN") return amount;
  
  // Rate is USD-based
  // amount (in fromCurrency) / rates[fromCurrency] = amount in USD
  // (amount in USD) * rates['NGN'] = amount in NGN
  const inUSD = amount / rates[fromCurrency];
  return inUSD * rates.NGN;
}
