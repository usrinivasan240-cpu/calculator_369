
"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CalculatorDisplay from './display';
import Keypad from './keypad';
import { addCalculation } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { create, all, type MathJsStatic } from 'mathjs';
import { getAdaptiveMode } from '@/app/actions/calculator';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser, useFirestore } from '@/firebase';

let math: MathJsStatic;

const createMathInstance = (mode: CalculatorMode) => {
    const config = {
        epsilon: 1e-12,
        matrix: 'Matrix',
        number: 'number',
        precision: 64,
        predictable: false,
        randomSeed: null
    };
    math = create(all, config);

    if (mode === 'Standard') {
        const disabledFunctions = [
            'import', 'createUnit', 'evaluate', 'parse', 'simplify', 'derivative',
            'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
            'asinh', 'acosh', 'atanh', 'log', 'log10', 'ln', 'exp', 'sqrt', 'cbrt',
            'pow', 'factorial'
        ];
        const replacements = disabledFunctions.reduce((acc, funcName) => {
            acc[funcName] = () => { throw new Error(`Function ${funcName} is not available in Standard mode`); };
            return acc;
        }, {} as Record<string, any>);

        math.import(replacements, { override: true });
    }
};

export type CalculatorMode = 'Standard' | 'Scientific';

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<CalculatorMode>('Standard');
  const manualModeSwitch = useRef(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const debouncedExpression = useDebounce(expression, 500);

  useEffect(() => {
    createMathInstance(mode);
  }, [mode]);

  useEffect(() => {
    if (manualModeSwitch.current) {
        return;
    }

    if (debouncedExpression) {
        getAdaptiveMode(debouncedExpression).then(res => {
            if (res.mode !== mode) {
                setMode(res.mode);
            }
        });
    } else if (mode !== 'Standard') {
        // do not switch back if expression is empty
    }
  }, [debouncedExpression, mode]);

  const handleCalculate = useCallback(async () => {
    if (!expression) return;
    try {
      let evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
      
      // Basic check for open parentheses to prevent errors
      const openParen = (evalExpression.match(/\(/g) || []).length;
      const closeParen = (evalExpression.match(/\)/g) || []).length;
      if (openParen > closeParen) {
        evalExpression += ')'.repeat(openParen - closeParen);
      }

      const calculatedResult = math.evaluate(evalExpression);
      // Avoid evaluating to functions or other non-numeric results
      if (typeof calculatedResult === 'function' || typeof calculatedResult === 'undefined' || calculatedResult === null) {
          throw new Error("Invalid evaluation result");
      }
      const formattedResult = String(Number(calculatedResult.toFixed(10)));
      setResult(formattedResult);

      if (user && firestore) {
        addCalculation(user.uid, { expression, result: formattedResult }, firestore);
      }
    } catch (error) {
      setResult('Error');
      toast({
        variant: "destructive",
        title: "Invalid Expression",
        description: "Please check your calculation.",
      });
    }
  }, [expression, user, toast, firestore]);

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
      setExpression((prev) => `(${prev}) / 100`);
    } else if (value === '1/x') {
      setExpression((prev) => `1 / (${prev})`);
    } else if (value === 'x²') {
      setExpression((prev) => `(${prev})^2`);
    } else if (value === 'x³') {
      setExpression((prev) => `(${prev})^3`);
    } else if (value === '√') {
      setExpression((prev) => `sqrt(${prev})`);
    } else if (value === '∛') {
        setExpression((prev) => `cbrt(${prev})`);
    } else if (value === 'n!') {
      setExpression((prev) => `factorial(${prev})`);
    } else if (['sin', 'cos', 'tan', 'log', 'ln'].includes(value)) {
        setExpression((prev) => prev + value + '(');
    } else {
      setExpression((prev) => prev + value);
    }
  }, [handleCalculate]);

  const handleModeChange = (newMode: CalculatorMode) => {
      if (mode !== newMode) {
          manualModeSwitch.current = true;
          setMode(newMode);
          setExpression('');
          setResult('');
          // After 1 second, allow automatic mode switching again
          setTimeout(() => {
            manualModeSwitch.current = false;
          }, 1000);
      }
  }

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

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
