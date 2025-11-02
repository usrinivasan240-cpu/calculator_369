
import { CalculatorMode } from "./calculator";

export interface KeyDefinition {
    label: string | React.ReactNode;
    value: string;
    type: 'number' | 'operator' | 'function' | 'action';
    mode: 'All' | CalculatorMode;
    className?: string;
}

export const keys: KeyDefinition[] = [
    // Scientific Row 1
    { label: 'sin', value: 'sin', type: 'function', mode: 'Scientific' },
    { label: 'cos', value: 'cos', type: 'function', mode: 'Scientific' },
    { label: 'tan', value: 'tan', type: 'function', mode: 'Scientific' },
    { label: 'log', value: 'log', type: 'function', mode: 'Scientific' },

    // Scientific Row 2
    { label: 'x²', value: 'x²', type: 'function', mode: 'Scientific' },
    { label: 'x³', value: 'x³', type: 'function', mode: 'Scientific' },
    { label: 'xʸ', value: '^', type: 'operator', mode: 'Scientific' },
    { label: '√', value: 'sqrt', type: 'function', mode: 'Scientific' },
    
    // Scientific Row 3
    { label: '∛', value: 'cbrt', type: 'function', mode: 'Scientific' },
    { label: '1/x', value: '1/x', type: 'function', mode: 'Scientific' },
    { label: 'n!', value: 'n!', type: 'function', mode: 'Scientific' },
    { label: 'Bin', value: 'bin', type: 'function', mode: 'Scientific' },
    
    // Scientific Row 4
    { label: '(', value: '(', type: 'operator', mode: 'Scientific' },
    { label: ')', value: ')', type: 'operator', mode: 'Scientific' },

    // Standard Actions
    { label: 'C', value: 'C', type: 'action', mode: 'All', className: 'bg-destructive/80 hover:bg-destructive text-destructive-foreground' },
    { label: '⌫', value: '⌫', type: 'action', mode: 'All' },
    { label: '%', value: '%', type: 'function', mode: 'All' },
    { label: '÷', value: '÷', type: 'operator', mode: 'All', className: 'bg-primary/80 hover:bg-primary text-primary-foreground' },

    // Numbers Row 1
    { label: '7', value: '7', type: 'number', mode: 'All' },
    { label: '8', value: '8', type: 'number', mode: 'All' },
    { label: '9', value: '9', type: 'number', mode: 'All' },
    { label: '×', value: '×', type: 'operator', mode: 'All', className: 'bg-primary/80 hover:bg-primary text-primary-foreground' },

    // Numbers Row 2
    { label: '4', value: '4', type: 'number', mode: 'All' },
    { label: '5', value: '5', type: 'number', mode: 'All' },
    { label: '6', value: '6', type: 'number', mode: 'All' },
    { label: '−', value: '-', type: 'operator', mode: 'All', className: 'bg-primary/80 hover:bg-primary text-primary-foreground' },

    // Numbers Row 3
    { label: '1', value: '1', type: 'number', mode: 'All' },
    { label: '2', value: '2', type: 'number', mode: 'All' },
    { label: '3', value: '3', type: 'number', mode: 'All' },
    { label: '+', value: '+', type: 'operator', mode: 'All', className: 'bg-primary/80 hover:bg-primary text-primary-foreground' },

    // Bottom Row
    { label: '0', value: '0', type: 'number', mode: 'All', className: 'col-span-2' },
    { label: '.', value: '.', type: 'number', mode: 'All' },
    { label: '=', value: '=', type: 'action', mode: 'All', className: 'bg-accent hover:bg-accent/90 text-accent-foreground' },
];
