
"use client";

import { Button } from '@/components/ui/button';
import { keys } from './key-definitions';
import { CalculatorMode } from './calculator';
import { motion } from "framer-motion";

interface KeypadProps {
    onButtonClick: (value: string) => void;
    mode: CalculatorMode;
}

export default function Keypad({ onButtonClick, mode }: KeypadProps) {
    
    const scientificKeys = keys.filter(key => key.mode === 'Scientific');
    const numberKeys = keys.filter(key => key.type === 'number');
    const operatorKeys = keys.filter(key => key.type === 'operator' || key.type === 'action' || key.type === 'function');

    const renderKey = (key: (typeof keys)[number]) => (
        <motion.div key={key.value} layout className={key.className || ''}>
            <motion.div whileTap={{ scale: 0.95 }} className="h-full">
                 <Button
                    onClick={() => onButtonClick(key.value)}
                    className={`w-full h-16 text-xl font-semibold ${key.className || (key.type === 'operator' || key.type === 'action' ? 'bg-secondary' : '')}`}
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
                <div className="grid grid-cols-4 gap-2">
                    {scientificKeys.map(renderKey)}
                </div>
            )}
            <div className="grid grid-cols-4 gap-2">
                {keys.filter(k => k.mode === 'All' && k.type !== 'number' && k.value !== '=' && k.value !== '.').map(renderKey)}
            </div>
            <div className="grid grid-cols-4 gap-2">
                 {keys.filter(k => k.mode === 'All' && (k.type === 'number' || k.value === '.' || k.value === '=')).map(renderKey)}
            </div>
        </div>
    );
}
