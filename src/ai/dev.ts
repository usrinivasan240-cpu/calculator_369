
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/adaptive-mode-switching.ts';
import '@/ai/flows/expression-solver.ts';
import '@/ai/flows/equation-solver.ts';
import '@/ai/flows/currency-converter.ts';

    