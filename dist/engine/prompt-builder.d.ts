/**
 * Prompt Builder
 * Constructs AI prompts by combining master prompt + archetype + style + user input
 */
import type { Archetype } from '../archetypes';
/**
 * Build the complete prompt for AI generation
 */
export declare function buildPrompt(archetype: Archetype, userInput: string, style?: string): string;
/**
 * Get a simpler prompt for quick generation
 */
export declare function buildQuickPrompt(userInput: string, type?: string, style?: string): string;
