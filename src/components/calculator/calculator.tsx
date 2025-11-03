
"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CalculatorDisplay from './display';
import Keypad from './keypad';
import { useToast } from '@/hooks/use-toast';
import { create, all, type MathJsStatic } from 'mathjs';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type CalculatorMode = 'Standard' | 'Scientific';

const createMathInstance = (): MathJsStatic => {
    const config = {
        epsilon: 1e-12,
        matrix: 'Matrix',
        number: 'number',
        precision: 64,
        predictable: false,
        randomSeed: null
    };
    const math = create(all, config);
    return math;
};

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<CalculatorMode>('Standard');

  const { toast } = useToast();

  const mathInstance = useMemo(() => createMathInstance(), []);

  const handleCalculate = useCallback(async () => {
    if (!expression) return;
    try {
      let evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      
      const openParen = (evalExpression.match(/\(/g) || []).length;
      const closeParen = (evalExpression.match(/\)/g) || []).length;
      if (openParen > closeParen) {
        evalExpression += ')'.repeat(openParen - closeParen);
      }
      
      const calculatedResult = mathInstance.evaluate(evalExpression);

      if (typeof calculatedResult === 'function' || typeof calculatedResult === 'undefined' || calculatedResult === null) {
          throw new Error("Invalid evaluation result");
      }
      const formattedResult = String(Number(calculatedResult.toFixed(10)));
      setResult(formattedResult);

    } catch (error) {
      setResult('Error');
      toast({
        variant: "destructive",
        title: "Invalid Expression",
        description: "Please check your calculation.",
      });
    }
  }, [expression, toast, mode, mathInstance]);

  const handleButtonClick = useCallback((value: string) => {
    setResult('');
    if (value === '=') {
      handleCalculate();
    } else if (value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === '⌫') {
      setExpression((prev) => prev.slice(0, -1));
    } else if (value === '%') {
        setExpression((prev) => {
            try {
                const currentVal = mathInstance.evaluate(prev);
                const newExpression = String(currentVal / 100);
                return newExpression;
            } catch {
                return prev;
            }
        });
    } else if (value === 'bin') {
      try {
        const currentValue = result || expression;
        if (currentValue) {
          const num = parseInt(currentValue, 10);
          if (!isNaN(num)) {
            const binaryResult = num.toString(2);
            const originalExpression = `dec_to_bin(${currentValue})`;
            setExpression(originalExpression);
            setResult(binaryResult);
          }
        }
      } catch (e) {
        setResult('Error');
      }
    } else if (value === '1/x') {
        if (mode === 'Standard') setMode('Scientific');
        setExpression((prev) => prev + '1/(');
    } else if (value === 'x²') {
        if (mode === 'Standard') setMode('Scientific');
        setExpression((prev) => prev + 'square(');
    } else if (value === 'x³') {
        if (mode === 'Standard') setMode('Scientific');
        setExpression((prev) => prev + 'cube(');
    } else if (value === 'n!') {
      if (mode === 'Standard') setMode('Scientific');
      setExpression((prev) => prev + 'factorial(');
    } else if (['sin', 'cos', 'tan', 'log', 'sqrt', 'cbrt'].includes(value)) {
        if (mode === 'Standard') setMode('Scientific');
        setExpression((prev) => prev + value + '(');
    } else if (['(', ')'].includes(value)) {
        setExpression((prev) => prev + value);
    } else {
      setExpression((prev) => prev + value);
    }
  }, [handleCalculate, mode, mathInstance, result, expression]);

  const handleModeChange = (newMode: CalculatorMode) => {
      if (mode !== newMode) {
          setMode(newMode);
          setExpression('');
          setResult('');
      }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        const { key } = event;
        if (/[0-9]/.test(key)) {
            handleButtonClick(key);
        } else if (key === '+') {
            handleButtonClick('+');
        } else if (key === '-') {
            handleButtonClick('−');
        } else if (key === '*') {
            handleButtonClick('×');
        } else if (key === '/') {
            handleButtonClick('÷');
        } else if (key === '.') {
            handleButtonClick('.');
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault(); // Prevent form submission or other default actions
            handleButtonClick('=');
        } else if (key === 'Backspace') {
            handleButtonClick('⌫');
        } else if (key === 'Escape') {
            handleButtonClick('C');
        } else if (key === '(') {
            handleButtonClick('(');
        } else if (key === ')') {
            handleButtonClick(')');
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleButtonClick]);

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl">
        <CardHeader>
            <CalculatorDisplay expression={expression} result={result} />
        </CardHeader>
        <CardContent>
            <Tabs value={mode} onValueChange={(value) => handleModeChange(value as CalculatorMode)} className="w-full mb-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="Standard">Standard</TabsTrigger>

                    <TabsTrigger value="Scientific">Scientific</TabsTrigger>
                </TabsList>
            </Tabs>
            <Keypad onButtonClick={handleButtonClick} mode={mode} />
        </CardContent>
    </Card>
  );
}
