"use client";

interface CalculatorDisplayProps {
    expression: string;
    result: string;
}

export default function CalculatorDisplay({ expression, result }: CalculatorDisplayProps) {
    return (
        <div className="bg-muted/50 rounded-lg p-4 text-right min-h-[100px] flex flex-col justify-end">
            <div className="text-muted-foreground text-xl break-all h-8 overflow-x-auto overflow-y-hidden">
                {expression || ' '}
            </div>
            <div className="text-foreground font-bold text-4xl h-12">
                {result || (expression ? ' ' : '0')}
            </div>
        </div>
    );
}
