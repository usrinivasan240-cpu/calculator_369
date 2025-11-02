"use client";
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import Calculator from '@/components/calculator/calculator';
import History from '@/components/calculator/history';
import { Skeleton } from '@/components/ui/skeleton';

export default function MainLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex flex-col min-h-screen">
          <header className="flex h-16 items-center justify-between border-b px-4 md:px-6 container max-w-7xl">
            <Skeleton className="h-8 w-24" />
            <div className='flex items-center gap-4'>
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </header>
          <main className="flex-1 items-start p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="lg:col-span-2">
                <Skeleton className="h-[600px] w-full rounded-lg" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-[600px] w-full rounded-lg" />
              </div>
            </div>
          </main>
        </div>
    );
  }

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
