export const SUPPORTED_CURRENCIES = [
  { code: "USD", label: "USD – US Dollar" },
  { code: "EUR", label: "EUR – Euro" },
  { code: "GBP", label: "GBP – British Pound" },
  { code: "CAD", label: "CAD – Canadian Dollar" },
  { code: "AUD", label: "AUD – Australian Dollar" },
  { code: "NZD", label: "NZD – New Zealand Dollar" },
  { code: "CHF", label: "CHF – Swiss Franc" },
  { code: "JPY", label: "JPY – Japanese Yen" },
  { code: "SGD", label: "SGD – Singapore Dollar" },
  { code: "HKD", label: "HKD – Hong Kong Dollar" },
  { code: "SEK", label: "SEK – Swedish Krona" },
  { code: "NOK", label: "NOK – Norwegian Krone" },
  { code: "DKK", label: "DKK – Danish Krone" },
  { code: "MXN", label: "MXN – Mexican Peso" },
  { code: "BRL", label: "BRL – Brazilian Real" },
  { code: "INR", label: "INR – Indian Rupee" },
  { code: "ZAR", label: "ZAR – South African Rand" },
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]["code"];

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
