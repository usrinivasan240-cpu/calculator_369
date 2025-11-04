
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const GST_RATES = ['3', '5', '12', '18', '28'];
type AmountType = 'exclusive' | 'inclusive';

export default function GstCalculator() {
  const [amount, setAmount] = useState('1000');
  const [gstRate, setGstRate] = useState('18');
  const [amountType, setAmountType] = useState<AmountType>('exclusive');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const calculatedValues = useMemo(() => {
    const numAmount = parseFloat(amount);
    const rate = parseFloat(gstRate);

    if (isNaN(numAmount) || isNaN(rate)) {
      return {
        baseAmount: '0.00',
        cgst: '0.00',
        sgst: '0.00',
        gstAmount: '0.00',
        totalAmount: '0.00',
      };
    }

    let baseAmount: number, gstAmount: number;

    if (amountType === 'exclusive') {
      baseAmount = numAmount;
      gstAmount = baseAmount * (rate / 100);
    } else {
      // Inclusive
      baseAmount = numAmount / (1 + rate / 100);
      gstAmount = numAmount - baseAmount;
    }

    const totalAmount = baseAmount + gstAmount;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    return {
      baseAmount: baseAmount.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  }, [amount, gstRate, amountType]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indian GST Calculator</CardTitle>
        <CardDescription>
          Calculate Goods and Services Tax for different slabs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                    id="amount"
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="e.g., 1000"
                    className="text-lg"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="gst-rate">GST Rate (%)</Label>
                <Select value={gstRate} onValueChange={setGstRate}>
                    <SelectTrigger id="gst-rate">
                    <SelectValue placeholder="Select GST Rate" />
                    </SelectTrigger>
                    <SelectContent>
                    {GST_RATES.map((rate) => (
                        <SelectItem key={rate} value={rate}>
                        {rate}%
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        
        <div className="space-y-2">
            <Label>Amount Type</Label>
            <RadioGroup
                value={amountType}
                onValueChange={(value) => setAmountType(value as AmountType)}
                className="flex space-x-4"
            >
                <div className="flex items-center space-x-2">
                <RadioGroupItem value="exclusive" id="exclusive" />
                <Label htmlFor="exclusive" className="font-normal">GST Exclusive</Label>
                </div>
                <div className="flex items-center space-x-2">
                <RadioGroupItem value="inclusive" id="inclusive" />
                <Label htmlFor="inclusive" className="font-normal">GST Inclusive</Label>
                </div>
            </RadioGroup>
        </div>
        
        <Card className="bg-muted p-4">
            <div className="space-y-2 text-sm">
                 <h4 className="font-medium text-foreground mb-3 text-base">Calculation Details:</h4>
                 <div className="flex justify-between">
                     <span className="text-muted-foreground">Base Amount:</span>
                     <span className="font-medium">₹{calculatedValues.baseAmount}</span>
                 </div>
                  <div className="flex justify-between">
                     <span className="text-muted-foreground">CGST ({parseFloat(gstRate)/2}%):</span>
                     <span className="font-medium">₹{calculatedValues.cgst}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-muted-foreground">SGST ({parseFloat(gstRate)/2}%):</span>
                     <span className="font-medium">₹{calculatedValues.sgst}</span>
                 </div>
                 <div className="flex justify-between border-t pt-2 mt-2">
                     <span className="text-muted-foreground">Total GST:</span>
                     <span className="font-medium">₹{calculatedValues.gstAmount}</span>
                 </div>
            </div>
             <div className="flex justify-between items-center mt-4 border-t pt-4">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">₹{calculatedValues.totalAmount}</span>
            </div>
        </Card>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Calculations are based on the selected GST rate and amount type. CGST and SGST are split equally.
        </p>
      </CardFooter>
    </Card>
  );
}
