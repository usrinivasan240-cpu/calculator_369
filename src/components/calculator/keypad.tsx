
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
    
    const scientificKeys = keys.filter(key => key.mode === 'Scientific');
    const numberKeys = keys.filter(key => key.type === 'number');
    const operatorKeys = keys.filter(key => key.type === 'operator' && key.mode === 'All');
    const actionKeys = keys.filter(key => key.type === 'action');
    const functionKeys = keys.filter(key => key.type === 'function' && key.mode !== 'Scientific');

    const renderKey = (key: KeyDefinition) => (
        <motion.div key={key.value} layout className={key.className || ''}>
            <motion.div whileTap={{ scale: 0.95 }} className="h-full">
                 <Button
                    onClick={() => onButtonClick(key.value)}
                    className={`w-full h-16 text-xl font-semibold ${key.className || (key.type === 'operator' || key.type === 'action' || key.type === 'function' ? 'bg-secondary' : '')}`}
                    variant={key.type === 'number' ? 'outline' : 'default'}
                    aria-label={typeof key.label === 'string' ? key.label : key.value}
                >
                    {key.label}
                </Button>
            </motion.div>
        </motion.div>
    );

    return (
        <div className="grid grid-cols-1 gap-2">
            {mode === 'Scientific' && (
                <div className="grid grid-cols-4 gap-2 mb-2">
                    {scientificKeys.map(renderKey)}
                </div>
            )}
            
            <div className="grid grid-cols-5 gap-2">
                {/* Numbers on the left */}
                <div className="col-span-3 grid grid-cols-3 gap-2">
                    {actionKeys.filter(k => k.value !== '=' && k.value !== 'C').map(renderKey)}
                    {functionKeys.map(renderKey)}
                    {actionKeys.find(k => k.value ==='C') && renderKey(actionKeys.find(k => k.value ==='C')!)}
                    
                    {numberKeys.filter(k => k.value !== '0' && k.value !== '.').sort((a,b) => parseInt(b.value) - parseInt(a.value)).map(renderKey)}
                    {numberKeys.filter(k => k.value === '0' || k.value === '.').map(renderKey)}
                </div>

                {/* Operators on the right */}
                <div className="col-span-2 grid grid-cols-2 gap-2">
                    {operatorKeys.map(renderKey)}
                    {actionKeys.filter(k => k.value === '=').map(renderKey)}
                </div>
            </div>
        </div>
    );
}
