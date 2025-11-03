"use client";
import { Header } from '@/components/layout/header';
import Calculator from '@/components/calculator/calculator';
import History from '@/components/calculator/history';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-dvh bg-muted/20">
      <Header />
      <main className="flex-1 items-start p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <Calculator />
          </div>
          <div className="lg:col-span-1">
            <History />
          </div>
        </div>
      </main>
    </div>
  );
}
