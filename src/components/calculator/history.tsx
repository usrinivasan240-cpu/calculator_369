"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { History as HistoryIcon } from 'lucide-react';

export default function History() {
  return (
    <Card className="h-full flex flex-col min-h-[600px] max-h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HistoryIcon className="h-6 w-6" />
          Calculation History
        </CardTitle>
        <CardDescription>Your recent calculations would be saved here.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <p>Login is required to save history.</p>
          <p className="text-sm">This feature is currently disabled.</p>
        </div>
      </CardContent>
    </Card>
  );
}
