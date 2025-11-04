
import { CalculatorMode } from "./calculator";

export interface KeyDefinition {
    label: string | React.ReactNode;
    value: string;
    type: 'number' | 'operator' | 'function' | 'action' | 'constant';
    mode: 'All' | CalculatorMode;
    className?: string;
    order: number;
}

export const keys: KeyDefinition[] = [
    // --- Scientific Keys ---
    { label: '(', value: '(', type: 'function', mode: 'Scientific', order: 1 },
    { label: ')', value: ')', type: 'function', mode: 'Scientific', order: 2 },
    { label: 'n!', value: 'n!', type: 'function', mode: 'Scientific', order: 3 },
    { label: 'Bin', value: 'bin', type: 'function', mode: 'Scientific', order: 4 },
    { label: 'π', value: 'pi', type: 'constant', mode: 'Scientific', order: 5 },
    { label: 'e', value: 'e', type: 'constant', mode: 'Scientific', order: 6 },
    
    { label: 'x²', value: 'x²', type: 'function', mode: 'Scientific', order: 11 },
    { label: 'x³', value: 'x³', type: 'function', mode: 'Scientific', order: 12 },
    { label: 'xʸ', value: '^', type: 'operator', mode: 'Scientific', order: 13 },
    { label: '√', value: 'sqrt', type: 'function', mode: 'Scientific', order: 14 },
    { label: '∛', value: 'cbrt', type: 'function', mode: 'Scientific', order: 15 },
    { label: '1/x', value: '1/x', type: 'function', mode: 'Scientific', order: 16 },

    { label: 'sin', value: 'sin', type: 'function', mode: 'Scientific', order: 21 },
    { label: 'cos', value: 'cos', type: 'function', mode: 'Scientific', order: 22 },
    { label: 'tan', value: 'tan', type: 'function', mode: 'Scientific', order: 23 },
    { label: 'log', value: 'log', type: 'function', mode: 'Scientific', order: 24 },
    { label: 'ln', value: 'ln', type: 'function', mode: 'Scientific', order: 25 },
    { label: 'eˣ', value: 'exp', type: 'function', mode: 'Scientific', order: 26 },

    { label: 'sin⁻¹', value: 'asin', type: 'function', mode: 'Scientific', order: 31 },
    { label: 'cos⁻¹', value: 'acos', type: 'function', mode: 'Scientific', order: 32 },
    { label: 'tan⁻¹', value: 'atan', type: 'function', mode: 'Scientific', order: 33 },
    { label: '10ˣ', value: '10^x', type: 'function', mode: 'Scientific', order: 34 },
    { label: 'Mod', value: 'Mod', type: 'operator', mode: 'Scientific', order: 35 },
    { label: '|x|', value: '|x|', type: 'function', mode: 'Scientific', order: 36 },

    { label: 'nCr', value: 'combinations', type: 'function', mode: 'Scientific', order: 41 },
    { label: 'nPr', value: 'permutations', type: 'function', mode: 'Scientific', order: 42 },

    
    // --- Standard Keys (also in scientific) ---
    // Actions
    { label: 'C', value: 'C', type: 'action', mode: 'All', order: 101 },
    { label: '⌫', value: '⌫', type: 'action', mode: 'All', order: 102 },
    { label: '%', value: '%', type: 'function', mode: 'All', order: 103 },
    { label: '=', value: '=', type: 'action', mode: 'All', className: 'bg-accent hover:bg-accent/90 text-accent-foreground', order: 104 },

    // Operators
    { label: '÷', value: '÷', type: 'operator', mode: 'All', order: 201 },
    { label: '×', value: '×', type: 'operator', mode: 'All', order: 202 },
    { label: '−', value: '-', type: 'operator', mode: 'All', order: 203 },
    { label: '+', value: '+', type: 'operator', mode: 'All', order: 204 },
    
    // Numbers
    { label: '7', value: '7', type: 'number', mode: 'All', order: 307 },
    { label: '8', value: '8', type: 'number', mode: 'All', order: 308 },
    { label: '9', value: '9', type: 'number', mode: 'All', order: 309 },
    { label: '4', value: '4', type: 'number', mode: 'All', order: 304 },
    { label: '5', value: '5', type: 'number', mode: 'All', order: 305 },
    { label: '6', value: '6', type: 'number', mode: 'All', order: 306 },
    { label: '1', value: '1', type: 'number', mode: 'All', order: 301 },
    { label: '2', value: '2', type: 'number', mode: 'All', order: 302 },
    { label: '3', value: '3', type: 'number', mode: 'All', order: 303 },
    { label: '0', value: '0', type: 'number', mode: 'All', className: 'col-span-2', order: 300 },
    { label: '.', value: '.', type: 'number', mode: 'All', order: 310 },
];
