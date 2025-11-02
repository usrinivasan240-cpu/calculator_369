"use server";
import { adaptMode } from "@/ai/flows/adaptive-mode-switching";

export async function getAdaptiveMode(expression: string) {
    if (!expression || expression.trim() === '') {
        return { mode: 'Standard' as const };
    }
    // Only call AI if expression contains potential scientific characters
    const scientificChars = /[a-z√^!]/i;
    if (!scientificChars.test(expression)) {
        return { mode: 'Standard' as const };
    }

    try {
        const result = await adaptMode({ expression });
        return result;
    } catch (error) {
        console.error("Error in getAdaptiveMode:", error);
        // Fallback to standard mode on error
        return { mode: 'Standard' as const };
    }
}
