'use server';

/**
 * @fileOverview Determines the appropriate calculator mode (Standard/Scientific) based on the calculation input.
 *
 * - adaptMode - A function that determines the calculator mode based on the expression.
 * - AdaptModeInput - The input type for the adaptMode function.
 * - AdaptModeOutput - The return type for the adaptMode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptModeInputSchema = z.object({
  expression: z.string().describe('The calculation expression entered by the user.'),
});
export type AdaptModeInput = z.infer<typeof AdaptModeInputSchema>;

const AdaptModeOutputSchema = z.object({
  mode: z.enum(['Standard', 'Scientific']).describe('The determined mode for the calculator (Standard or Scientific).'),
});
export type AdaptModeOutput = z.infer<typeof AdaptModeOutputSchema>;

export async function adaptMode(input: AdaptModeInput): Promise<AdaptModeOutput> {
  return adaptModeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptModePrompt',
  input: {schema: AdaptModeInputSchema},
  output: {schema: AdaptModeOutputSchema},
  prompt: `Determine whether the following calculation expression requires the calculator to be in Standard or Scientific mode.\n\nExpression: {{{expression}}}\n\nRespond with Standard if it's a basic arithmetic operation, or Scientific if it involves advanced mathematical functions like trigonometry, logarithms, exponents, or factorials.\n\nMode:`,
});

const adaptModeFlow = ai.defineFlow(
  {
    name: 'adaptModeFlow',
    inputSchema: AdaptModeInputSchema,
    outputSchema: AdaptModeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
