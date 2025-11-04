
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { currencies, type Currency } from '@/lib/currencies';
import { convertCurrency } from '@/ai/flows/currency-converter';

type ConversionCategory = 'Temperature' | 'Length' | 'Currency';
type TemperatureUnit = 'Celsius' | 'Fahrenheit' | 'Kelvin';
type LengthUnit = 'Kilometers' | 'Miles';

const tempUnits: TemperatureUnit[] = ['Celsius', 'Fahrenheit', 'Kelvin'];
const lengthUnits: LengthUnit[] = ['Kilometers', 'Miles'];

export default function Converter() {
    const [category, setCategory] = useState<ConversionCategory>('Temperature');
    const [inputValue, setInputValue] = useState<string>('1');
    
    // Temperature state
    const [fromTemp, setFromTemp] = useState<TemperatureUnit>('Celsius');
    const [toTemp, setToTemp] = useState<TemperatureUnit>('Fahrenheit');

    // Length state
    const [fromLength, setFromLength] = useState<LengthUnit>('Kilometers');
    const [toLength, setToLength] = useState<LengthUnit>('Miles');

    // Currency state
    const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
    const [toCurrency, setToCurrency] = useState<Currency>('EUR');
    const [convertedCurrencyValue, setConvertedCurrencyValue] = useState<string>('');
    const [isConverting, setIsConverting] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and a single decimal point
        if (/^-?\d*\.?\d*$/.test(value)) {
            setInputValue(value);
        }
    };
    
    const handleCurrencyConversion = useCallback(async () => {
        const amount = parseFloat(inputValue);
        if (isNaN(amount) || !fromCurrency || !toCurrency) return;

        setIsConverting(true);
        try {
            const result = await convertCurrency({ from: fromCurrency, to: toCurrency, amount });
            setConvertedCurrencyValue(result.convertedAmount.toFixed(2));
        } catch (error) {
            console.error("Conversion failed", error);
            setConvertedCurrencyValue('Error');
        } finally {
            setIsConverting(false);
        }
    }, [inputValue, fromCurrency, toCurrency]);

    useEffect(() => {
        if (category === 'Currency') {
            handleCurrencyConversion();
        }
    }, [inputValue, fromCurrency, toCurrency, category, handleCurrencyConversion]);

    const convertedValue = useMemo(() => {
        const num = parseFloat(inputValue);
        if (isNaN(num)) return '';

        if (category === 'Temperature') {
            let celsiusVal: number;
            // Convert input to Celsius first
            switch (fromTemp) {
                case 'Celsius':
                    celsiusVal = num;
                    break;
                case 'Fahrenheit':
                    celsiusVal = (num - 32) * 5 / 9;
                    break;
                case 'Kelvin':
                    celsiusVal = num - 273.15;
                    break;
            }

            // Convert from Celsius to target unit
            let result: number;
            switch (toTemp) {
                case 'Celsius':
                    result = celsiusVal;
                    break;
                case 'Fahrenheit':
                    result = celsiusVal * 9 / 5 + 32;
                    break;
                case 'Kelvin':
                    result = celsiusVal + 273.15;
                    break;
            }
            return result.toFixed(2);
        }

        if (category === 'Length') {
            let kmVal: number;
             // Convert input to Kilometers first
             switch (fromLength) {
                case 'Kilometers':
                    kmVal = num;
                    break;
                case 'Miles':
                    kmVal = num * 1.60934;
                    break;
            }

            // Convert from Kilometers to target unit
            let result: number;
            switch(toLength) {
                case 'Kilometers':
                    result = kmVal;
                    break;
                case 'Miles':
                    result = kmVal / 1.60934;
                    break;
            }
            return result.toFixed(4);
        }

        return '';
    }, [inputValue, category, fromTemp, toTemp, fromLength, toLength]);
    
    const renderUnitConverter = (
        units: string[], 
        fromUnit: string, 
        setFromUnit: (unit: any) => void, 
        toUnit: string, 
        setToUnit: (unit: any) => void
    ) => (
         <div className="p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                        <SelectTrigger>
                            <SelectValue placeholder={`From ${category}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {units.map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input
                        type="text"
                        className="text-2xl h-16"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="space-y-2">
                     <Select value={toUnit} onValueChange={setToUnit}>
                        <SelectTrigger>
                            <SelectValue placeholder={`To ${category}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {units.map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Card className="flex items-center justify-start text-2xl h-16 px-3 bg-background">
                         {convertedValue}
                    </Card>
                </div>
            </div>
        </div>
    );
    
    const renderCurrencyConverter = () => (
         <div className="p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                    <Select value={fromCurrency} onValueChange={(val) => setFromCurrency(val as Currency)}>
                        <SelectTrigger>
                            <SelectValue placeholder="From Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input
                        type="text"
                        className="text-2xl h-16"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="space-y-2">
                     <Select value={toCurrency} onValueChange={(val) => setToCurrency(val as Currency)}>
                        <SelectTrigger>
                            <SelectValue placeholder="To Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Card className="flex items-center justify-start text-2xl h-16 px-3 bg-background">
                         {isConverting ? '...' : convertedCurrencyValue}
                    </Card>
                </div>
            </div>
        </div>
    );


    return (
        <div className="space-y-4">
             <Tabs value={category} onValueChange={(val) => setCategory(val as ConversionCategory)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="Temperature">Temperature</TabsTrigger>
                    <TabsTrigger value="Length">Length</TabsTrigger>
                    <TabsTrigger value="Currency">Currency</TabsTrigger>
                </TabsList>
                <TabsContent value="Temperature">
                    {renderUnitConverter(tempUnits, fromTemp, setFromTemp, toTemp, setToTemp)}
                </TabsContent>
                <TabsContent value="Length">
                    {renderUnitConverter(lengthUnits, fromLength, setFromLength, toLength, setToLength)}
                </TabsContent>
                <TabsContent value="Currency">
                   {renderCurrencyConverter()}
                </TabsContent>
            </Tabs>
        </div>
    );
}
