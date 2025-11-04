
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

// Tariff rates for Tamil Nadu Domestic connections (LT-IA) as of mid-2024
// These are bi-monthly slabs. The calculation is based on total consumption over two months.
const TNEB_TARIFF = {
  fixed_charges_0_to_100: 0,
  fixed_charges_other: 50, // Bi-monthly fixed charges for consumption > 100 units
  slabs: [
    { up_to: 100, rate: 0, subsidy: true }, // 100 units subsidy
    { up_to: 200, rate: 2.25 }, // For units 101-200
    { up_to: 400, rate: 4.5 }, // For units 201-400
    { up_to: 500, rate: 6.0 }, // For units 401-500
    { up_to: 600, rate: 8.0 }, // For units 501-600
    { up_to: 800, rate: 9.0 }, // For units 601-800
    { up_to: 1000, rate: 10.0 }, // For units 801-1000
    { up_to: Infinity, rate: 11.0 }, // For units above 1000
  ],
};

export default function EBBillCalculator() {
  const [units, setUnits] = useState('100');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setUnits(value);
    }
  };

  const calculatedBill = useMemo(() => {
    const consumedUnits = parseInt(units, 10);
    if (isNaN(consumedUnits) || consumedUnits < 0) {
      return { total: '0.00', breakdown: [] as string[] };
    }

    let billAmount = 0;
    const breakdown: string[] = [];
    
    // All consumers get the first 100 units free
    const chargeableUnits = consumedUnits > 100 ? consumedUnits - 100 : 0;
    if (consumedUnits > 0) {
        breakdown.push(`First 100 units: Free`);
    }

    if (consumedUnits <= 500) {
      // Slab calculation for consumption up to 500 units
      let remainingUnits = chargeableUnits;
      
      // 101-200
      if (remainingUnits > 0) {
        const unitsInSlab = Math.min(remainingUnits, 100);
        const cost = unitsInSlab * TNEB_TARIFF.slabs[1].rate;
        billAmount += cost;
        breakdown.push(`${unitsInSlab} units @ ₹${TNEB_TARIFF.slabs[1].rate.toFixed(2)}: ₹${cost.toFixed(2)}`);
        remainingUnits -= unitsInSlab;
      }
      
      // 201-400
      if (remainingUnits > 0) {
        const unitsInSlab = Math.min(remainingUnits, 200);
        const cost = unitsInSlab * TNEB_TARIFF.slabs[2].rate;
        billAmount += cost;
        breakdown.push(`${unitsInSlab} units @ ₹${TNEB_TARIFF.slabs[2].rate.toFixed(2)}: ₹${cost.toFixed(2)}`);
        remainingUnits -= unitsInSlab;
      }
      
      // 401-500
      if (remainingUnits > 0) {
        const unitsInSlab = Math.min(remainingUnits, 100);
        const cost = unitsInSlab * TNEB_TARIFF.slabs[3].rate;
        billAmount += cost;
        breakdown.push(`${unitsInSlab} units @ ₹${TNEB_TARIFF.slabs[3].rate.toFixed(2)}: ₹${cost.toFixed(2)}`);
        remainingUnits -= unitsInSlab;
      }

    } else {
      // Telescopic calculation for consumption above 500 units
      let remainingUnits = consumedUnits;
      let lastSlabEnd = 0;
      
      for(const slab of TNEB_TARIFF.slabs) {
          if (remainingUnits > 0) {
              const unitsInSlab = Math.min(remainingUnits, slab.up_to - lastSlabEnd);
              if (unitsInSlab > 0) {
                  const cost = unitsInSlab * slab.rate;
                  billAmount += cost;
                  breakdown.push(`${unitsInSlab} units @ ₹${slab.rate.toFixed(2)}: ₹${cost.toFixed(2)}`);
                  remainingUnits -= unitsInSlab;
                  lastSlabEnd = slab.up_to;
              }
          }
      }
    }

    // Add fixed charges
    let fixedCharges = 0;
    if (consumedUnits > 100) {
        fixedCharges = TNEB_TARIFF.fixed_charges_other;
        breakdown.push(`Fixed Charges (Bi-monthly): ₹${fixedCharges.toFixed(2)}`);
    } else {
        breakdown.push(`Fixed Charges: Free`);
    }

    const total = billAmount + fixedCharges;
    
    return { total: total.toFixed(2), breakdown };
  }, [units]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tamil Nadu EB Bill Calculator</CardTitle>
        <CardDescription>
          Estimate your bi-monthly electricity bill for domestic (LT-IA)
          connections.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="units">Bi-monthly Consumption (Units)</Label>
          <Input
            id="units"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={units}
            onChange={handleInputChange}
            placeholder="e.g., 350"
            className="text-lg"
          />
        </div>
        <Card className="bg-muted p-4">
            <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Estimated Bill:</span>
                <span className="text-2xl font-bold text-primary">₹{calculatedBill.total}</span>
            </div>
            {calculatedBill.breakdown.length > 0 && (
                <div className="space-y-1 text-sm text-muted-foreground">
                    <h4 className="font-medium text-foreground mb-2">Calculation Breakdown:</h4>
                    {calculatedBill.breakdown.map((line, index) => (
                        <p key={index} className="flex justify-between">
                            <span>{line.split(':')[0]}:</span>
                            <span>{line.split(':')[1]}</span>
                        </p>
                    ))}
                </div>
            )}
        </Card>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Disclaimer: This is an estimate based on current tariff rates and does
          not include arrears or other adjustments. Rates are subject to change.
        </p>
      </CardFooter>
    </Card>
  );
}
