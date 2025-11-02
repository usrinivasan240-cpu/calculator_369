
"use client";

import { useState, useCallback, useEffect } from 'react';
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
        math.import({
            import: undefined,
            createUnit: undefined,
            evaluate: undefined,
            parse: undefined,
            simplify: undefined,
            derivative: undefined,
        }, { override: true });
    }
};

export type CalculatorMode = 'Standard' | 'Scientific';

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<CalculatorMode>('Standard');
  const [isAiSwitching, setIsAiSwitching] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const debouncedExpression = useDebounce(expression, 500);

  useEffect(() => {
    createMathInstance(mode);
  }, [mode]);

  useEffect(() => {
    if (debouncedExpression && !isAiSwitching) {
        getAdaptiveMode(debouncedExpression).then(res => {
            if (res.mode !== mode) {
                setIsAiSwitching(true);
                setMode(res.mode);
                setTimeout(() => setIsAiSwitching(false), 100);
            }
        });
    } else if (!debouncedExpression) {
        setMode('Standard');
    }
  }, [debouncedExpression, mode, isAiSwitching]);

  const handleCalculate = useCallback(async () => {
    if (!expression) return;
    try {
      let evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
      const calculatedResult = math.evaluate(evalExpression);
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
          setMode(newMode);
          setExpression('');
          setResult('');
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
