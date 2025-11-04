
"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { create, all, type MathJsStatic } from 'mathjs';
import { useToast } from '@/hooks/use-toast';

const math = create(all);

interface DataPoint {
    x: number;
    y: number;
}

export default function GraphingCalculator() {
    const [fnString, setFnString] = useState('x^2');
    const [data, setData] = useState<DataPoint[]>([]);
    const { toast } = useToast();

    const plotFunction = () => {
        try {
            const compiledFn = math.compile(fnString);
            const newData: DataPoint[] = [];
            for (let x = -10; x <= 10; x += 0.5) {
                const y = compiledFn.evaluate({ x });
                if (typeof y === 'number' && isFinite(y)) {
                    newData.push({ x, y });
                }
            }
            setData(newData);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Invalid Function',
                description: 'Could not parse or evaluate the function. Make sure it uses "x" as the variable.',
            });
            setData([]);
        }
    };

    // Initial plot
    useState(() => {
        plotFunction();
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Graphing Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="e.g., x^2 or sin(x)"
                        value={fnString}
                        onChange={(e) => setFnString(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && plotFunction()}
                    />
                    <Button onClick={plotFunction}>Plot</Button>
                </div>
                <div className="w-full h-[400px] bg-muted/30 rounded-lg p-4">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{
                                    top: 5,
                                    right: 20,
                                    left: -10,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="x" type="number" domain={[-10, 10]} ticks={[-10, -5, 0, 5, 10]} />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))'
                                    }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="y" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="flex items-center justify-center h-full text-muted-foreground">
                            Enter a function and click "Plot" to see the graph.
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                 <p className="text-xs text-muted-foreground">
                    Enter a function of <code className="bg-muted px-1 rounded-sm">x</code> to plot it.
                </p>
            </CardFooter>
        </Card>
    );
}
