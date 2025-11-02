"use client";

import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { UserNav } from '@/components/auth/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center max-w-7xl">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">
            FireCalc
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
