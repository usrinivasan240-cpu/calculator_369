
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


const getExchangeRateTool = ai.defineTool(
    {
        name: 'getExchangeRate',
        description: 'Get the real-time exchange rate between two currencies from an API.',
        inputSchema: z.object({
            from: z.enum(currencies),
            to: z.enum(currencies),
        }),
        outputSchema: z.object({
            rate: z.number(),
        }),
    },
    async ({ from, to }) => {
        try {
            // Using a free exchange rate API (no API key required for this endpoint)
            const response = await fetch(`https://open.exchangerate-api.com/v6/latest/${from}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.result === 'error') {
                throw new Error(`API error: ${data['error-type']}`);
            }
            const rate = data.rates[to];
            if (!rate) {
                throw new Error(`Could not find rate for currency: ${to}`);
            }
            return { rate };
        } catch (error) {
            console.error("Error fetching live exchange rate:", error);
            // Fallback or re-throw
            throw new Error("Could not retrieve live exchange rate.");
        }
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
