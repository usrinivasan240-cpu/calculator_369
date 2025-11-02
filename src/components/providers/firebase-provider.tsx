"use client";

import { FirebaseClientProvider } from '@/firebase/client-provider';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      {children}
    </FirebaseClientProvider>
  );
}
