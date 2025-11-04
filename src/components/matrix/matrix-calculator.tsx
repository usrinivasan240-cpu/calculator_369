
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { create, all, type MathJsStatic } from 'mathjs';

const math: MathJsStatic = create(all, {});

type MatrixOperation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'transposeA'
  | 'transposeB'
  | 'inverseA'
  | 'inverseB'
  | 'detA'
  | 'detB';

export default function MatrixCalculator() {
  const [matrixA, setMatrixA] = useState('[[1, 2], [3, 4]]');
  const [matrixB, setMatrixB] = useState('[[5, 6], [7, 8]]');
  const [operation, setOperation] = useState<MatrixOperation>('add');
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  const formatMatrix = (matrix: any): string => {
    if (typeof matrix === 'number') {
      return matrix.toString();
    }
    if (math.isMatrix(matrix)) {
      const arr = matrix.toArray();
      // Pretty print the matrix
      if (Array.isArray(arr) && arr.length > 0 && Array.isArray(arr[0])) {
         return '[\n' + arr.map(row => `  [${row.join(', ')}]`).join(',\n') + '\n]';
      }
      return JSON.stringify(arr, null, 2);
    }
    return 'Invalid Matrix';
  };

  const calculate = () => {
    try {
      const matA = math.evaluate(matrixA);
      const matB = math.evaluate(matrixB);

      let calcResult: any;

      switch (operation) {
        case 'add':
          calcResult = math.add(matA, matB);
          break;
        case 'subtract':
          calcResult = math.subtract(matA, matB);
          break;
        case 'multiply':
          calcResult = math.multiply(matA, matB);
          break;
        case 'transposeA':
          calcResult = math.transpose(matA);
          break;
        case 'transposeB':
          calcResult = math.transpose(matB);
          break;
        case 'inverseA':
          calcResult = math.inv(matA);
          break;
        case 'inverseB':
          calcResult = math.inv(matB);
          break;
        case 'detA':
          calcResult = math.det(matA);
          break;
        case 'detB':
          calcResult = math.det(matB);
          break;
        default:
          throw new Error('Unsupported operation');
      }

      setResult(formatMatrix(calcResult));
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Calculation Error',
        description:
          error.message || 'Please check your matrix formatting and dimensions.',
      });
      setResult('');
    }
  };

  const isUnaryOperation = ['transposeA', 'transposeB', 'inverseA', 'inverseB', 'detA', 'detB'].includes(operation);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matrix & Vector Calculator</CardTitle>
        <CardDescription>
          Enter matrices in array format, e.g., [[1, 2], [3, 4]].
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="matrixA">Matrix A</Label>
            <Textarea
              id="matrixA"
              value={matrixA}
              onChange={(e) => setMatrixA(e.target.value)}
              placeholder="[[1, 2], [3, 4]]"
              className="font-mono h-32"
            />
          </div>
          <div className={`space-y-2 ${isUnaryOperation ? 'opacity-50' : ''}`}>
            <Label htmlFor="matrixB">Matrix B</Label>
            <Textarea
              id="matrixB"
              value={matrixB}
              onChange={(e) => setMatrixB(e.target.value)}
              placeholder="[[5, 6], [7, 8]]"
              className="font-mono h-32"
              disabled={isUnaryOperation}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Operation</Label>
          <Select
            value={operation}
            onValueChange={(val) => setOperation(val as MatrixOperation)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">A + B (Addition)</SelectItem>
              <SelectItem value="subtract">A - B (Subtraction)</SelectItem>
              <SelectItem value="multiply">A * B (Multiplication)</SelectItem>
              <SelectItem value="transposeA">Transpose(A)</SelectItem>
              <SelectItem value="transposeB">Transpose(B)</SelectItem>
              <SelectItem value="inverseA">Inverse(A)</SelectItem>
              <SelectItem value="inverseB">Inverse(B)</SelectItem>
              <SelectItem value="detA">Determinant(A)</SelectItem>
              <SelectItem value="detB">Determinant(B)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={calculate} className="w-full">
          Calculate
        </Button>
        {result && (
          <div className="space-y-2">
            <Label>Result</Label>
            <Card className="bg-muted p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                <code>{result}</code>
              </pre>
            </Card>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Note: Ensure matrices have compatible dimensions for the selected
          operation.
        </p>
      </CardFooter>
    </Card>
  );
}
