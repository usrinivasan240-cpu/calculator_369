
export const currencies = [
  "USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD", "INR"
] as const;

export type Currency = (typeof currencies)[number];
