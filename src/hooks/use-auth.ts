"use client";
import { useUser as useFirebaseUser } from '@/firebase';

export const useAuth = () => {
    return useFirebaseUser();
};

export const useUser = useAuth;
