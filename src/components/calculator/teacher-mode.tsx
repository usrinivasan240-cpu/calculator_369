'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import type { SolutionStep } from "@/ai/flows/expression-solver";

interface TeacherModeProps {
  steps: SolutionStep[];
  isLoading: boolean;
}

export default function TeacherMode({ steps, isLoading }: TeacherModeProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 pt-4">
        <h3 className="font-semibold text-lg">Step-by-step solution:</h3>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="pt-4">
        <h3 className="font-semibold text-lg mb-2">Step-by-step solution:</h3>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {steps.map((step, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs">
                        {index + 1}
                        </div>
                        <span className="font-medium text-left">{step.step}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pl-12">
                    <p className="text-muted-foreground mb-2">{step.explanation}</p>
                    <p className="font-mono bg-muted p-2 rounded-md text-sm">
                        Result: <span className="font-bold">{step.result}</span>
                    </p>
                </AccordionContent>
            </AccordionItem>
            ))}
        </Accordion>
    </div>
  );
}
