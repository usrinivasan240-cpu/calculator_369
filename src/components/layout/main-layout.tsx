"use client";
import { Header } from '@/components/layout/header';
import Calculator from '@/components/calculator/calculator';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-dvh bg-muted/20">
      <Header />
      <main className="flex-1 items-start p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-1 flex justify-center">
            <Calculator />
          </div>
        </div>
      </main>
    </div>
  );
}
