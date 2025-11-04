
'use server';

/**
 * @fileOverview A Genkit flow for fetching real-time currency exchange rates.
 *
 * - getExchangeRates - A function that fetches exchange rates for a given base currency.
 * - ExchangeRateInput - The input type for the getExchangeRates function.
 * - ExchangeRates - The return type for the getExchangeRates function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExchangeRateInputSchema = z.object({
  baseCurrency: z.string().length(3).describe('The 3-letter currency code of the base currency (e.g., "USD").'),
});
export type ExchangeRateInput = z.infer<typeof ExchangeRateInputSchema>;

const ExchangeRatesSchema = z.object({
  result: z.string(),
  base_code: z.string(),
  rates: z.record(z.number()).describe('An object mapping currency codes to their exchange rate relative to the base currency.'),
});
export type ExchangeRates = z.infer<typeof ExchangeRatesSchema>;


// This flow fetches data directly from an external API without using an LLM.
const getExchangeRatesFlow = ai.defineFlow(
  {
    name: 'getExchangeRatesFlow',
    inputSchema: ExchangeRateInputSchema,
    outputSchema: ExchangeRatesSchema,
  },
  async ({ baseCurrency }) => {
    // Using a free, no-API-key-required exchange rate provider
    const url = `https://open.er-api.com/v6/latest/${baseCurrency}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
      }
      const data = await response.json();

      // Validate the received data against our Zod schema
      const validationResult = ExchangeRatesSchema.safeParse(data);
      if (!validationResult.success) {
          console.error("Currency API response validation error:", validationResult.error);
          throw new Error("Invalid data format received from the currency API.");
      }

      return validationResult.data;
    } catch (error) {
      console.error("Error in getExchangeRatesFlow: ", error);
      // Re-throw the error to be handled by the caller
      throw new Error(`Could not fetch exchange rates for ${baseCurrency}.`);
    }
  }
);


export async function getExchangeRates(input: ExchangeRateInput): Promise<ExchangeRates> {
  return getExchangeRatesFlow(input);
}

    