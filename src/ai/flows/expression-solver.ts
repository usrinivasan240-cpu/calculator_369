'use server';
/**
 * @fileOverview A flow for providing step-by-step solutions to mathematical expressions.
 *
 * - solveExpression - A function that returns a step-by-step solution for a given expression.
 * - SolveExpressionInput - The input type for the solveExpression function.
 * - SolveExpressionOutput - The return type for the solveExpression function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the Zod schema for input validation
const SolveExpressionInputSchema = z.object({
  expression: z.string().describe('The mathematical expression to be solved.'),
});
export type SolveExpressionInput = z.infer<typeof SolveExpressionInputSchema>;

// Define the Zod schema for a single step in the solution
const SolutionStepSchema = z.object({
    step: z.string().describe('The specific calculation or operation being performed in this step.'),
    explanation: z.string().describe('A clear, simple explanation of why this step is being taken.'),
    result: z.string().describe('The intermediate result of the expression after this step is completed.'),
});

// Define the Zod schema for the final output
const SolveExpressionOutputSchema = z.object({
  steps: z.array(SolutionStepSchema).describe('An array of steps to solve the expression.'),
  finalAnswer: z.string().describe('The final answer of the calculation.'),
});
export type SolveExpressionOutput = z.infer<typeof SolveExpressionOutputSchema>;
export type SolutionStep = z.infer<typeof SolutionStepSchema>;


const prompt = ai.definePrompt({
    name: 'expressionSolverPrompt',
    input: { schema: SolveExpressionInputSchema },
    output: { schema: SolveExpressionOutputSchema },
    prompt: `You are a friendly and encouraging math tutor. Your goal is to explain how to solve a mathematical expression in a clear, step-by-step manner.

    Analyze the following mathematical expression:
    Expression: {{{expression}}}

    Break down the solution into individual steps, following the order of operations (PEMDAS/BODMAS).

    For each step:
    1.  Identify the operation to perform (e.g., "evaluate the parentheses," "perform the multiplication").
    2.  Explain *why* you are doing that operation (e.g., "because it's inside parentheses," "multiplication comes before addition").
    3.  Show the result of the expression *after* that single operation is complete.

    Continue this process until you reach the final answer. The final 'result' in the last step should be the final answer.

    Present the entire solution in the required JSON format.`,
});


const expressionSolverFlow = ai.defineFlow(
  {
    name: 'expressionSolverFlow',
    inputSchema: SolveExpressionInputSchema,
    outputSchema: SolveExpressionOutputSchema,
  },
  async ({ expression }) => {
    const { output } = await prompt({ expression });
    if (!output) {
      throw new Error('Failed to get a solution from the AI model.');
    }
    return output;
  }
);


export async function solveExpression(input: SolveExpressionInput): Promise<SolveExpressionOutput> {
  return expressionSolverFlow(input);
}
