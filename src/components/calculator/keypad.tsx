
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
    const standardFunctionKeys = keys.filter(key => key.mode === 'Standard');
    const sharedActionKeys = keys.filter(key => key.mode === 'All' && (key.type === 'action' || key.type === 'function'));
    const operatorKeys = keys.filter(key => key.mode === 'All' && key.type === 'operator');
    const numberAndUtilKeys = keys.filter(k => k.mode === 'All' && (k.type === 'number' || k.value === '='));

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

    const actionKeysToShow = mode === 'Standard' 
        ? [...sharedActionKeys, ...standardFunctionKeys, ...operatorKeys].sort((a, b) => keys.indexOf(a) - keys.indexOf(b))
        : [...sharedActionKeys, ...operatorKeys].sort((a, b) => keys.indexOf(a) - keys.indexOf(b));
    
    // Make sure C, backspace, %, bin are on one row and division is at the end for standard
    const topRowKeys = keys.filter(k => ['C', '⌫', '%', 'bin'].includes(k.value));
    const operatorRowKeys = keys.filter(k => k.type === 'operator' && k.mode === 'All');

    return (
        <div className="grid grid-cols-1 gap-2">
            {mode === 'Scientific' && (
                <div className="grid grid-cols-4 gap-2 mb-2">
                    {scientificKeys.map(renderKey)}
                </div>
            )}
            
            <div className="grid grid-cols-4 gap-2">
                {topRowKeys.filter(k => mode === 'Standard' ? true : k.value !== 'bin').map(renderKey)}
                {mode === 'Standard' && <div />} 
            </div>

            <div className="grid grid-cols-4 gap-2">
                {keys.filter(k => k.value >= '7' && k.value <= '9').map(renderKey)}
                {keys.filter(k => k.value === '×').map(renderKey)}
            </div>

            <div className="grid grid-cols-4 gap-2">
                {keys.filter(k => k.value >= '4' && k.value <= '6').map(renderKey)}
                {keys.filter(k => k.value === '-').map(renderKey)}
            </div>

            <div className="grid grid-cols-4 gap-2">
                {keys.filter(k => k.value >= '1' && k.value <= '3').map(renderKey)}
                {keys.filter(k => k.value === '+').map(renderKey)}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
                 {keys.filter(k => k.mode === 'All' && (k.type === 'number' || k.value === '.') && !['1','2','3','4','5','6','7','8','9'].includes(k.value) ).map(renderKey)}
                 {keys.filter(k => k.value === '=').map(renderKey)}
            </div>
        </div>
    );
}
