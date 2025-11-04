
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
  }, [expression, toast, mathInstance]);

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
    } else if (['bin'].includes(value)) {
      try {
        const currentValue = result || expression;
        if (currentValue && !isNaN(Number(currentValue))) {
          const num = parseInt(currentValue, 10);
          if (!isNaN(num)) {
            let conversionResult;
            if (value === 'bin') {
                conversionResult = num.toString(2);
            }
            setExpression(`dec_to_${value}(${currentValue})`);
            setResult(conversionResult!);
          } else {
             toast({
                variant: "destructive",
                title: "Invalid Number",
                description: "Cannot convert a non-integer value.",
            });
          }
        } else {
            toast({
                variant: "destructive",
                title: "No Value to Convert",
                description: "Please enter a number before converting.",
            });
        }
      } catch (e: any) {
        setResult('Error');
        toast({
            variant: "destructive",
            title: "Conversion Error",
            description: e.message || "Could not perform base conversion.",
        });
      }
    } else if (value === '1/x') {
        setExpression((prev) => '1/(' + prev);
    } else if (value === 'x²') {
        setExpression((prev) => '(' + prev + ')^2');
    } else if (value === 'x³') {
        setExpression((prev) => '(' + prev + ')^3');
    } else if (value === '10^x') {
        setExpression((prev) => '10^(' + prev);
    } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'cbrt', 'asin', 'acos', 'atan', 'exp', 'n!'].includes(value)) {
        let funcName = value;
        if (value === 'n!') funcName = 'factorial';
        if (value === 'exp') funcName = 'exp';
        setExpression((prev) => funcName + '(' + prev);
    } else if (['(', ')', 'π', 'e'].includes(value)) {
        setExpression((prev) => prev + value);
    } else {
      setExpression((prev) => prev + value);
    }
  }, [handleCalculate, mathInstance, result, expression, toast]);

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
    <Card className="w-full max-w-sm md:max-w-3xl mx-auto shadow-2xl transition-all duration-300">
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
