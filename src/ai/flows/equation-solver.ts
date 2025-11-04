
'use server';
/**
 * @fileOverview A flow for providing step-by-step solutions to algebraic equations.
 *
 * - solveAlgebraicEquation - A function that returns a step-by-step solution for a given equation.
 * - AlgebraicEquationInputSchema - The input type for the solveAlgebraicEquation function.
 * - AlgebraicEquationOutputSchema - The return type for the solveAlgebraicEquation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the Zod schema for input validation
const AlgebraicEquationInputSchema = z.object({
  equation: z.string().describe('The algebraic equation to be solved, e.g., "2x + 5 = 15".'),
});
export type AlgebraicEquationInput = z.infer<typeof AlgebraicEquationInputSchema>;

// Re-using the SolutionStep schema from expression-solver
const SolutionStepSchema = z.object({
    step: z.string().describe('The algebraic manipulation being performed in this step (e.g., "Subtract 5 from both sides").'),
    explanation: z.string().describe('A clear, simple explanation of why this step is being taken (e.g., "To isolate the x term").'),
    result: z.string().describe('The state of the equation after this step is completed (e.g., "2x = 10").'),
});

// Define the Zod schema for the final output
const AlgebraicEquationOutputSchema = z.object({
  steps: z.array(SolutionStepSchema).describe('An array of steps to solve the equation.'),
  finalAnswer: z.string().describe('The final solution for the variable (e.g., "x = 5").'),
});

export type AlgebraicEquationOutput = z.infer<typeof AlgebraicEquationOutputSchema>;
export type SolutionStep = z.infer<typeof SolutionStepSchema>;


const prompt = ai.definePrompt({
    name: 'algebraicEquationSolverPrompt',
    input: { schema: AlgebraicEquationInputSchema },
    output: { schema: AlgebraicEquationOutputSchema },
    prompt: `You are an expert math tutor specializing in algebra. Your task is to solve the given algebraic equation step-by-step.

    Analyze the following equation:
    Equation: {{{equation}}}

    Your goal is to find the value of the variable (e.g., x, y, etc.).

    Break down the solution into clear, logical steps. For each step, you must:
    1.  State the action you are taking (e.g., "Subtract 10 from both sides," "Divide both sides by 2," "Apply the quadratic formula").
    2.  Provide a brief explanation for why you are taking that action (e.g., "To isolate the variable," "To simplify the expression").
    3.  Show the resulting, simplified equation after the action is performed.

    Continue this process until the variable is fully isolated and you have the final answer. The 'result' in the final step should be the final answer itself.

    If the equation is quadratic, solve it using factoring or the quadratic formula, explaining each part of the process.

    Present the entire solution in the required JSON format.`,
});


const equationSolverFlow = ai.defineFlow(
  {
    name: 'equationSolverFlow',
    inputSchema: AlgebraicEquationInputSchema,
    outputSchema: AlgebraicEquationOutputSchema,
  },
  async ({ equation }) => {
    const { output } = await prompt({ equation });
    if (!output) {
      throw new Error('Failed to get a solution from the AI model.');
    }
    return output;
  }
);

export async function solveAlgebraicEquation(input: AlgebraicEquationInput): Promise<AlgebraicEquationOutput> {
  return equationSolverFlow(input);
}
