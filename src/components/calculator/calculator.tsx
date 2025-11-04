
"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CalculatorDisplay from './display';
import Keypad from './keypad';
import { useToast } from '@/hooks/use-toast';
import { create, all, type MathJsStatic } from 'mathjs';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Converter from '@/components/converter/converter';
import GraphingCalculator from '../graphing/graphing-calculator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { solveExpression, type SolutionStep } from '@/ai/flows/expression-solver';
import TeacherMode from './teacher-mode';
import { Button } from '../ui/button';
import { Mic, MicOff, ChevronDown } from 'lucide-react';
import MatrixCalculator from '../matrix/matrix-calculator';
import EBBillCalculator from '../eb-bill/eb-bill-calculator';
import EquationSolver from '../equation-solver/equation-solver';
import GstCalculator from '../gst-calculator/gst-calculator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"


export type CalculatorMode = 'Standard' | 'Scientific';
export type AppMode = 'Calculator' | 'Converter' | 'Graphing' | 'Matrix' | 'EB Bill' | 'Solver' | 'GST';

const appModeLabels: Record<AppMode, string> = {
    Calculator: 'Calculator',
    Converter: 'Unit Converter',
    Graphing: 'Graphing Calculator',
    Matrix: 'Matrix Calculator',
    'EB Bill': 'EB Bill Calculator',
    Solver: 'Equation Solver',
    GST: 'GST Calculator'
};

const appModes: AppMode[] = ['Calculator', 'Converter', 'Graphing', 'Matrix', 'EB Bill', 'Solver', 'GST'];


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

// Extend the Window interface for SpeechRecognition
interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<CalculatorMode>('Standard');
  const [appMode, setAppMode] = useState<AppMode>('Calculator');
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([]);
  const [isSolving, setIsSolving] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);

  const { toast } = useToast();

  const mathInstance = useMemo(() => createMathInstance(), []);

  const handleCalculate = useCallback(async () => {
    if (!expression) return;
    setSolutionSteps([]);
    try {
        let evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        
        // Auto-correct repeated operators
        evalExpression = evalExpression.replace(/([+\-*/])\1+/g, '$1');

        const openParen = (evalExpression.match(/\(/g) || []).length;
        const closeParen = (evalExpression.match(/\)/g) || []).length;
        if (openParen > closeParen) {
            evalExpression += ')'.repeat(openParen - closeParen);
        }

        if (isTeacherMode) {
            setIsSolving(true);
            try {
                const solution = await solveExpression({ expression: evalExpression });
                setSolutionSteps(solution.steps);
                setResult(solution.finalAnswer);
            } catch (aiError) {
                console.error("Teacher mode failed:", aiError);
                toast({
                    variant: "destructive",
                    title: "Teacher Mode Failed",
                    description: "Could not generate a solution. Please try again.",
                });
                // Fallback to regular calculation
                const calculatedResult = mathInstance.evaluate(evalExpression);
                setResult(String(Number(calculatedResult.toFixed(10))));
            } finally {
                setIsSolving(false);
            }
        } else {
            const calculatedResult = mathInstance.evaluate(evalExpression);

            if (typeof calculatedResult === 'function' || typeof calculatedResult === 'undefined' || calculatedResult === null) {
                throw new Error("Invalid evaluation result");
            }
            const formattedResult = String(Number(calculatedResult.toFixed(10)));
            setResult(formattedResult);
        }

    } catch (error) {
      setResult('Error');
      toast({
        variant: "destructive",
        title: "Invalid Expression",
        description: "Please check your calculation.",
      });
    }
  }, [expression, toast, mathInstance, isTeacherMode]);

  const handleButtonClick = useCallback((value: string) => {
    setResult('');
    setSolutionSteps([]);
    if (value === '=') {
      handleCalculate();
    } else if (value === 'C') {
      setExpression('');
      setResult('');
      setSolutionSteps([]);
    } else if (value === '⌫') {
      setExpression((prev) => prev.slice(0, -1));
    } else if (value === '%') {
        setExpression((prev) => {
            try {
                if (!prev) return '';
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
        if (currentValue && !isNaN(Number(currentValue))) {
          const num = parseInt(currentValue, 10);
          if (!isNaN(num)) {
            let conversionResult;
            conversionResult = num.toString(2);
            
            setExpression(`dec_to_bin(${currentValue})`);
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
        setExpression((prev) => '1/(' + prev + ')');
    } else if (value === 'x²') {
        setExpression((prev) => '(' + prev + ')^2');
    } else if (value === 'x³') {
        setExpression((prev) => '(' + prev + ')^3');
    } else if (value === '10^x') {
        setExpression((prev) => '10^(' + prev + ')');
    } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'cbrt', 'asin', 'acos', 'atan', 'exp', 'permutations', 'combinations'].includes(value)) {
        setExpression((prev) => prev + value + '(');
    } else if (value === 'n!') {
        setExpression((prev) => prev + '!');
    } else if (value === '|x|') {
        setExpression((prev) => 'abs(' + prev + ')');
    } else if (value === 'Mod') {
        setExpression((prev) => prev + ' mod ');
    } else if (['(', ')', 'π', 'e'].includes(value)) {
        setExpression((prev) => prev + value);
    } else {
      setExpression((prev) => prev + value);
    }
  }, [handleCalculate, mathInstance, result, expression, toast]);

  useEffect(() => {
    const SpeechRecognition = (window as IWindow).SpeechRecognition || (window as IWindow).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: "destructive",
        title: "Browser Not Supported",
        description: "Your browser does not support voice recognition.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      let transcript = event.results[0][0].transcript;
      transcript = transcript.toLowerCase()
        .replace(/\s/g, '')
        .replace(/plus/g, '+')
        .replace(/minus/g, '−')
        .replace(/times/g, '×')
        .replace(/x/g, '×')
        .replace(/dividedby/g, '÷')
        .replace(/equals/g, '=')
        .replace(/point/g, '.');
      
      if(transcript.includes('=')) {
        const newExpression = transcript.slice(0, -1);
        setExpression(newExpression);
        // We need to use a function form of setExpression to get the latest state
        // and then call handleCalculate inside a useEffect that depends on a trigger.
        // Direct call might use stale state. A better way is to trigger calculation.
        // For simplicity here, we'll call it directly but this can be fragile.
        // A more robust solution might involve a separate state to trigger calculation.
        setExpression(newExpression);
        // A simple timeout can help ensure state is updated before calculation
        setTimeout(() => handleCalculate(), 0);

      } else {
        setExpression(transcript);
      }
    };

    recognition.onerror = (event: any) => {
        let description = "An unknown error occurred with voice recognition.";
        switch (event.error) {
            case 'not-allowed':
                description = "Microphone access was denied. Please allow microphone access in your browser settings.";
                break;
            case 'network':
                description = "A network error occurred. Please check your internet connection.";
                break;
            case 'no-speech':
                description = "No speech was detected. Please try speaking again.";
                break;
            case 'audio-capture':
                description = "There was a problem with your microphone.";
                break;
            case 'service-not-allowed':
                description = "Speech recognition service is not allowed by your browser or system settings.";
                break;
            case 'aborted':
                // This can happen if the user stops it manually, so we don't always want to show an error.
                // console.log('Speech recognition aborted.');
                break;
            default:
                 description = `An error occurred: ${event.error}`;
        }

        if (event.error !== 'aborted' && event.error !== 'no-speech') {
            toast({
                variant: "destructive",
                title: "Voice Error",
                description: description,
            });
        }
        setIsListening(false);
    };

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }
  }, [toast, handleCalculate]);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (error: any) {
        // The most common error here is "recognition has already started"
        if (error.message.includes('already started')) {
            // Silently ignore, as we are already listening.
            // Or ensure our state is correct.
            if (!isListening) {
                setIsListening(true);
            }
        } else {
            console.error("Could not start voice recognition: ", error);
            toast({
                variant: "destructive",
                title: "Voice Error",
                description: error.message || "Could not start voice recognition service.",
            });
            setIsListening(false);
        }
      }
    }
  };

  const handleModeChange = (newMode: CalculatorMode) => {
      if (mode !== newMode) {
          setMode(newMode);
          setExpression('');
          setResult('');
      }
  }
  
  const handleAppModeChange = (newMode: string) => {
    const validMode = newMode as AppMode;
    if (appMode !== validMode) {
        setAppMode(validMode);
        setExpression('');
        setResult('');
        setSolutionSteps([]);
    }
}

  useEffect(() => {
    if (appMode !== 'Calculator') return;
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
  }, [handleButtonClick, appMode]);

  return (
    <Card className="w-full max-w-sm md:max-w-4xl mx-auto shadow-2xl transition-all duration-300">
        <Tabs value={appMode} onValueChange={handleAppModeChange} className="w-full">
        <CardHeader>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        {appModeLabels[appMode]}
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                    {appModes.map((am) => (
                        <DropdownMenuItem key={am} onSelect={() => handleAppModeChange(am)}>
                            {appModeLabels[am]}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {appMode === 'Calculator' && (
                <div className="relative pt-2">
                    <CalculatorDisplay expression={expression} result={result} />
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-2 text-muted-foreground"
                        onClick={handleVoiceInput}
                    >
                        {isListening ? <MicOff /> : <Mic />}
                    </Button>
                </div>
            )}
        </CardHeader>
        <CardContent>
            
                <TabsContent value="Calculator" className="mt-0">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center space-x-2">
                            <Switch id="teacher-mode" checked={isTeacherMode} onCheckedChange={setIsTeacherMode} />
                            <Label htmlFor="teacher-mode">Teacher Mode</Label>
                        </div>
                        <Tabs value={mode} onValueChange={(value) => handleModeChange(value as CalculatorMode)} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="Standard">Standard</TabsTrigger>
                                <TabsTrigger value="Scientific">Scientific</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Keypad onButtonClick={handleButtonClick} mode={mode} />
                        { (isSolving || solutionSteps.length > 0) && (
                            <TeacherMode steps={solutionSteps} isLoading={isSolving} />
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="Converter" className="mt-0">
                    <Converter />
                </TabsContent>
                 <TabsContent value="Graphing" className="mt-0">
                    <GraphingCalculator />
                </TabsContent>
                <TabsContent value="Matrix" className="mt-0">
                    <MatrixCalculator />
                </TabsContent>
                 <TabsContent value="EB Bill" className="mt-0">
                    <EBBillCalculator />
                </TabsContent>
                <TabsContent value="Solver" className="mt-0">
                    <EquationSolver />
                </TabsContent>
                <TabsContent value="GST" className="mt-0">
                    <GstCalculator />
                </TabsContent>
            
        </CardContent>
        </Tabs>
    </Card>
  );
}
