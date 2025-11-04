
"use client";

import { Button } from '@/components/ui/button';
import { keys, KeyDefinition } from './key-definitions';
import { CalculatorMode } from './calculator';
import { motion } from "framer-motion";

interface KeypadProps {
    onButtonClick: (value: string) => void;
    mode: CalculatorMode;
}

const Keypad: React.FC<KeypadProps> = ({ onButtonClick, mode }) => {
    const standardKeys = keys.filter(key => key.mode === 'All');
    const scientificKeys = keys.filter(key => key.mode === 'Scientific');

    const renderKey = (key: KeyDefinition | undefined) => {
        if (!key) return <div />;
        return (
            <motion.div
                key={key.value + key.mode + key.order}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className={key.className}
            >
                <motion.div whileTap={{ scale: 0.95 }} className="h-full">
                    <Button
                        onClick={() => onButtonClick(key.value)}
                        className={`w-full h-12 text-lg font-medium transition-colors duration-150 ${key.className || (key.type === 'number' ? 'bg-background hover:bg-muted' : 'bg-secondary hover:bg-muted')}`}
                        variant="outline"
                        aria-label={typeof key.label === 'string' ? key.label : key.value}
                    >
                        {key.label}
                    </Button>
                </motion.div>
            </motion.div>
        );
    }
    
    return (
        <div className={`grid gap-2 ${mode === 'Scientific' ? 'grid-cols-10' : 'grid-cols-4'}`}>
            
            {/* Scientific Keys */}
            {mode === 'Scientific' && (
                <motion.div layout className="col-span-6 grid grid-cols-6 gap-2">
                    {scientificKeys.sort((a, b) => a.order - b.order).map(renderKey)}
                </motion.div>
            )}

            {/* Standard Keys */}
            <div className={`col-span-4 grid grid-cols-4 gap-2`}>
                {renderKey(standardKeys.find(k => k.value === 'C'))}
                {renderKey(standardKeys.find(k => k.value === '⌫'))}
                {renderKey(standardKeys.find(k => k.value === '%'))}
                {renderKey(standardKeys.find(k => k.value === '÷'))}
                
                {renderKey(keys.find(k => k.value === '7'))}
                {renderKey(keys.find(k => k.value === '8'))}
                {renderKey(keys.find(k => k.value === '9'))}
                {renderKey(standardKeys.find(k => k.value === '×'))}

                {renderKey(keys.find(k => k.value === '4'))}
                {renderKey(keys.find(k => k.value === '5'))}
                {renderKey(keys.find(k => k.value === '6'))}
                {renderKey(standardKeys.find(k => k.value === '-'))}

                {renderKey(keys.find(k => k.value === '1'))}
                {renderKey(keys.find(k => k.value === '2'))}
                {renderKey(keys.find(k => k.value === '3'))}
                {renderKey(standardKeys.find(k => k.value === '+'))}

                {renderKey(keys.find(k => k.value === '0'))}
                {renderKey(keys.find(k => k.value === '.'))}
                {renderKey(standardKeys.find(k => k.value === '='))}
            </div>
        </div>
    );
};

export default Keypad;
