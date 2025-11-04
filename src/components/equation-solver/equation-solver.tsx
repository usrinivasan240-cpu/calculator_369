
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { solveAlgebraicEquation, type SolutionStep } from '@/ai/flows/equation-solver';
import TeacherMode from '../calculator/teacher-mode';
import { Loader2 } from 'lucide-react';

export default function EquationSolver() {
  const [equation, setEquation] = useState('2x + 10 = 20');
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSolve = async () => {
    if (!equation.includes('=')) {
        toast({
            variant: 'destructive',
            title: 'Invalid Equation',
            description: 'Please enter a valid equation with an equals sign (=).',
        });
        return;
    }
    
    setIsLoading(true);
    setSolutionSteps([]);

    try {
      const result = await solveAlgebraicEquation({ equation });
      if (result.steps && result.steps.length > 0) {
        setSolutionSteps(result.steps);
      } else {
        toast({
            variant: 'destructive',
            title: 'Unable to Solve',
            description: 'The AI could not find a step-by-step solution for this equation.',
        });
      }
    } catch (error) {
      console.error('Equation solving failed:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to solve the equation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Algebraic Equation Solver</CardTitle>
        <CardDescription>
          Enter an algebraic equation (e.g., 2x + 5 = 15) to see the step-by-step solution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex w-full max-w-md items-center space-x-2">
          <Input
            type="text"
            placeholder="e.g., 3x - 4 = 11"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSolve()}
          />
          <Button onClick={handleSolve} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Solve'}
          </Button>
        </div>

        {(isLoading || solutionSteps.length > 0) && (
            <div className="pt-4">
                <TeacherMode steps={solutionSteps} isLoading={isLoading} />
            </div>
        )}

      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Powered by AI. Solutions are for single-variable linear and quadratic equations.
        </p>
      </CardFooter>
    </Card>
  );
}
