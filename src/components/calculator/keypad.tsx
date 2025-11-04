
"use client";

import { Button } from '@/components/ui/button';
import { keys, KeyDefinition } from './key-definitions';
import { CalculatorMode } from './calculator';
import { motion } from "framer-motion";

interface KeypadProps {
    onButtonClick: (value: string) => void;
    mode: CalculatorMode;
}

export default function Keypad({ onButtonClick, mode }: KeypadProps) {
    
    const standardKeys = keys.filter(key => key.mode === 'All');
    const scientificKeys = keys.filter(key => key.mode === 'Scientific');
    
    const renderKey = (key: KeyDefinition) => (
        <motion.div 
            key={key.value + key.order} 
            layout 
            className={key.className || ''}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1 }}
        >
            <motion.div whileTap={{ scale: 0.95 }} className="h-full">
                 <Button
                    onClick={() => onButtonClick(key.value)}
                    className={`w-full h-14 md:h-16 text-lg md:text-xl font-semibold ${key.className || (key.type === 'operator' || key.type === 'action' || key.type === 'function' || key.type === 'constant' ? 'bg-secondary' : '')}`}
                    variant={key.type === 'number' ? 'outline' : 'default'}
                    aria-label={typeof key.label === 'string' ? key.label : key.value}
                >
                    {key.label}
                </Button>
            </motion.div>
        </motion.div>
    );

    const standardGrid = (
        <div className="grid grid-cols-4 gap-2">
            {standardKeys.find(k => k.value === '%')}
            {standardKeys.find(k => k.value === 'C')}
            {standardKeys.find(k => k.value === '⌫')}
            {standardKeys.find(k => k.value === '÷')}
            
            {keys.find(k => k.value === '7')}
            {keys.find(k => k.value === '8')}
            {keys.find(k => k.value === '9')}
            {standardKeys.find(k => k.value === '×')}

            {keys.find(k => k.value === '4')}
            {keys.find(k => k.value === '5')}
            {keys.find(k => k.value === '6')}
            {standardKeys.find(k => k.value === '-')}

            {keys.find(k => k.value === '1')}
            {keys.find(k => k.value === '2')}
            {keys.find(k => k.value === '3')}
            {standardKeys.find(k => k.value === '+')}

            {keys.find(k => k.value === '0')}
            {keys.find(k => k.value === '.')}
            {standardKeys.find(k => k.value === '=')}
        </div>
    )

    return (
       <div className={`grid gap-2 grid-cols-1 ${mode === 'Scientific' ? 'md:grid-cols-[auto_400px]' : 'md:grid-cols-1'}`}>
            {mode === 'Scientific' && (
                 <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden md:grid grid-cols-6 gap-2">
                    {scientificKeys.sort((a,b) => a.order - b.order).map(renderKey)}
                </motion.div>
            )}

            <div className={`grid-cols-4 gap-2 ${mode === 'Scientific' ? 'grid' : 'hidden'}`}>
                {[
                    ...standardKeys.filter(k => k.value === '%' || k.value === 'C' || k.value === '⌫' || k.value === '÷'),
                    ...keys.filter(k => ['7','8','9'].includes(k.value)),
                    ...standardKeys.filter(k => k.value === '×'),
                    ...keys.filter(k => ['4','5','6'].includes(k.value)),
                    ...standardKeys.filter(k => k.value === '-'),
                     ...keys.filter(k => ['1','2','3'].includes(k.value)),
                    ...standardKeys.filter(k => k.value === '+'),
                    ...keys.filter(k => k.value === '0' || k.value === '.'),
                    ...standardKeys.filter(k => k.value === '='),
                ]
                .sort((a,b) => a.order - b.order)
                .map(renderKey)}
            </div>
             <div className={`grid ${mode === 'Standard' ? 'grid-cols-4' : 'hidden'} gap-2`}>
                 {[
                    ...standardKeys.filter(k => k.value === '%' || k.value === 'C' || k.value === '⌫' || k.value === '÷'),
                    ...keys.filter(k => ['7','8','9'].includes(k.value)),
                    ...standardKeys.filter(k => k.value === '×'),
                    ...keys.filter(k => ['4','5','6'].includes(k.value)),
                    ...standardKeys.filter(k => k.value === '-'),
                     ...keys.filter(k => ['1','2','3'].includes(k.value)),
                    ...standardKeys.filter(k => k.value === '+'),
                    ...keys.filter(k => k.value === '0' || k.value === '.'),
                    ...standardKeys.filter(k => k.value === '='),
                ]
                .sort((a,b) => a.order - b.order)
                .map(renderKey)}
            </div>
       </div>
    );
}
