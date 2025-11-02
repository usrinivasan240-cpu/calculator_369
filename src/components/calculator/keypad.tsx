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
    const visibleKeys = keys.filter(key => key.mode === 'All' || key.mode === mode);
    
    const scientificKeys = keys.filter(key => key.mode === 'Scientific');

    const standardKeys = keys.filter(key => key.mode === 'All');

    return (
        <div className="grid grid-cols-4 gap-2">
            {mode === 'Scientific' && scientificKeys.map((key) => (
                <motion.div key={key.value} layout className={key.className || ''}>
                    <Button
                        onClick={() => onButtonClick(key.value)}
                        className={`w-full h-16 text-xl font-semibold ${key.type === 'operator' || key.type === 'action' ? 'bg-secondary' : ''}`}
                        variant={key.type === 'number' ? 'outline' : 'default'}
                        aria-label={typeof key.label === 'string' ? key.label : key.value}
                    >
                        {key.label}
                    </Button>
                </motion.div>
            ))}
             {standardKeys.map((key) => (
                <motion.div key={key.value} layout className={key.className || ''}>
                    <Button
                        onClick={() => onButtonClick(key.value)}
                        className={`w-full h-16 text-xl font-semibold ${key.className || (key.type === 'operator' || key.type === 'action' ? 'bg-secondary' : '')}`}
                        variant={key.type === 'number' ? 'outline' : 'default'}
                        aria-label={typeof key.label === 'string' ? key.label : key.value}
                        whileTap={{ scale: 0.95 }}
                    >
                        {key.label}
                    </Button>
                </motion.div>
            ))}
        </div>
    );
}
