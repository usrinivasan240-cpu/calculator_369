"use server";
// This file is no longer used and can be safely deleted.
// We are keeping it to avoid breaking the build process if it's imported elsewhere.
export async function getAdaptiveMode(expression: string) {
    return { mode: 'Standard' as const };
}
