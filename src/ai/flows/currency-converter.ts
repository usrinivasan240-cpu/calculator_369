
'use server';
/**
 * @fileOverview A flow for converting currencies using live exchange rates.
 *
 * - convertCurrency - A function that handles the currency conversion.
 * - CurrencyConversionInput - The input type for the convertCurrency function.
 * - CurrencyConversionOutput - The return type for the convertCurrency function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { currencies, type Currency } from '@/lib/currencies';


// Define the Zod schema for input validation
const CurrencyConversionInputSchema = z.object({
  from: z.enum(currencies).describe('The currency to convert from.'),
  to: z.enum(currencies).describe('The currency to convert to.'),
  amount: z.number().describe('The amount to convert.'),
});
export type CurrencyConversionInput = z.infer<typeof CurrencyConversionInputSchema>;

// Define the Zod schema for the output
const CurrencyConversionOutputSchema = z.object({
  convertedAmount: z.number().describe('The resulting amount after conversion.'),
});
export type CurrencyConversionOutput = z.infer<typeof CurrencyConversionOutputSchema>;

// Mock exchange rates - in a real-world scenario, you would fetch this from an API
const mockExchangeRates: Record<Currency, number> = {
  USD: 1, // Base currency
  EUR: 0.93,
  JPY: 157.0,
  GBP: 0.79,
  AUD: 1.5,
  CAD: 1.37,
  CHF: 0.9,
  CNY: 7.25,
  SEK: 10.5,
  NZD: 1.63,
  INR: 83.5,
};


const getExchangeRateTool = ai.defineTool(
    {
        name: 'getExchangeRate',
        description: 'Get the exchange rate between two currencies. This is a mock tool and does not use a live API.',
        inputSchema: z.object({
            from: z.enum(currencies),
            to: z.enum(currencies),
        }),
        outputSchema: z.object({
            rate: z.number(),
        }),
    },
    async ({ from, to }) => {
        const fromRate = mockExchangeRates[from];
        const toRate = mockExchangeRates[to];
        // Convert 'from' currency to USD, then USD to 'to' currency
        const rate = (1 / fromRate) * toRate;
        return { rate };
    }
);


const currencyConverterFlow = ai.defineFlow(
  {
    name: 'currencyConverterFlow',
    inputSchema: CurrencyConversionInputSchema,
    outputSchema: CurrencyConversionOutputSchema,
  },
  async ({ from, to, amount }) => {
    
    const { output: toolOutput } = await ai.runTool(getExchangeRateTool, { from, to });
    if (!toolOutput) {
        throw new Error('Could not get exchange rate');
    }
    const { rate } = toolOutput;

    const convertedAmount = amount * rate;

    return {
      convertedAmount,
    };
  }
);


export async function convertCurrency(input: CurrencyConversionInput): Promise<CurrencyConversionOutput> {
  return currencyConverterFlow(input);
}
