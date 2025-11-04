
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
    const standardKeys = keys.filter(key => key.mode === 'All');

    const renderKey = (key: KeyDefinition) => (
        <motion.div key={key.value} layout className={key.className || ''}>
            <motion.div whileTap={{ scale: 0.95 }} className="h-full">
                 <Button
                    onClick={() => onButtonClick(key.value)}
                    className={`w-full h-16 text-xl font-semibold ${key.className || (key.type === 'operator' || key.type === 'action' || key.type === 'function' || key.type === 'constant' ? 'bg-secondary' : '')}`}
                    variant={key.type === 'number' ? 'outline' : 'default'}
                    aria-label={typeof key.label === 'string' ? key.label : key.value}
                >
                    {key.label}
                </Button>
            </motion.div>
        </motion.div>
    );

    return (
        <motion.div layout className="grid grid-cols-1 gap-2">
            <motion.div 
                layout
                className="grid grid-cols-1 gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: mode === 'Scientific' ? 1 : 0, height: mode === 'Scientific' ? 'auto' : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: 'hidden' }}
            >
                {mode === 'Scientific' && (
                    <div className="grid grid-cols-4 gap-2 mb-2">
                        {scientificKeys.map(renderKey)}
                    </div>
                )}
            </motion.div>
            
            <motion.div layout className="grid grid-cols-4 gap-2">
                {standardKeys.filter(k => k.type !== 'number' && k.value !== '=').map(renderKey)}

                {standardKeys.filter(k => k.type === 'number' && k.value !== '0' && k.value !== '.').sort((a,b) => parseInt(a.value) - parseInt(b.value)).reverse().map(renderKey)}
                
                {standardKeys.filter(k => k.type === 'number' && (k.value === '0' || k.value === '.')).map(renderKey)}

                {standardKeys.find(k => k.value === '=') && renderKey(standardKeys.find(k => k.value === '=')!)}
            </motion.div>
        </motion.div>
    );
}
