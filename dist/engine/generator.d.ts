/**
 * Design Generator
 * Calls Claude API to generate HTML/CSS designs
 */
import type { Archetype } from '../archetypes';
export interface GeneratedDesign {
    html: string;
    archetype: Archetype;
    style: string;
    prompt: string;
    generationTime: number;
}
/**
 * Generate a design using Claude
 */
export declare function generate(archetype: Archetype, userInput: string, style?: string): Promise<GeneratedDesign>;
/**
 * Quick generation without archetype detection
 */
export declare function quickGenerate(userInput: string, type?: string, style?: string): Promise<string>;
/**
 * Stream generation for real-time output
 */
export declare function streamGenerate(archetype: Archetype, userInput: string, style?: string): AsyncGenerator<string, void, unknown>;
