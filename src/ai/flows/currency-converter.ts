'use server';
/**
 * @fileOverview A flow for converting currencies using live exchange rates.
 *
 * - convertCurrency - A function that returns the converted currency amount.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input and Output schemas are now defined in the client component
// and passed into this server action.
export type CurrencyConversionInput = {
  from: string;
  to: string;
  amount: number;
}
export type CurrencyConversionOutput = {
  convertedAmount: number;
}


// This tool fetches the exchange rate from an external API.
const getExchangeRateTool = ai.defineTool(
  {
    name: 'getExchangeRate',
    description: 'Get the exchange rate between two currencies.',
    inputSchema: z.object({
      from: z.string().describe('The currency to convert from.'),
      to: z.string().describe('The currency to convert to.'),
    }),
    outputSchema: z.object({
      rate: z.number().describe('The conversion rate.'),
    }),
  },
  async ({ from, to }) => {
    console.log(`Fetching exchange rate for ${from} to ${to}`);
    try {
      // We are using a free API that doesn't require a key.
      const response = await fetch(`https://open.exchangerate-api.com/v6/latest/${from}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rates. Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.result === 'error') {
        throw new Error(`API Error: ${data['error-type']}`);
      }
      const rate = data.rates[to];
      if (!rate) {
        throw new Error(`Rate for currency "${to}" not found.`);
      }
      return { rate };
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      // Re-throw the error to be handled by the flow
      throw error;
    }
  }
);


const currencyConverterFlow = ai.defineFlow(
  {
    name: 'currencyConverterFlow',
    inputSchema: z.object({
        from: z.string(),
        to: z.string(),
        amount: z.number(),
    }),
    outputSchema: z.object({
        convertedAmount: z.number(),
    }),
  },
  async ({ from, to, amount }) => {

    const { output: toolOutput } = await ai.generate({
        prompt: `Get the exchange rate from ${from} to ${to}`,
        tools: [getExchangeRateTool],
        model: 'googleai/gemini-2.5-flash',
    });

    if (!toolOutput) {
        throw new Error('Could not get exchange rate from the tool.');
    }

    const rate = (toolOutput[0].output as any).rate;
    const convertedAmount = amount * rate;

    return { convertedAmount };
  }
);

export async function convertCurrency(input: CurrencyConversionInput): Promise<CurrencyConversionOutput> {
    try {
        return await currencyConverterFlow(input);
    } catch(e) {
        console.error("Currency conversion failed", e);
        // Fallback for when the tool fails, this can happen if the API is down
        // or if the model fails to call the tool.
        return { convertedAmount: 0 };
    }
}
