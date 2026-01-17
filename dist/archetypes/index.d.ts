/**
 * Archetype Registry
 * Defines all design types and their configurations
 */
export interface Archetype {
    id: string;
    name: string;
    description: string;
    structure: 'presentation' | 'single-page' | 'multi-page' | 'card' | 'identity';
    defaultStyle: 'minimal' | 'bold' | 'elegant' | 'modern' | 'professional';
    dimensions?: {
        width: number;
        height: number;
    };
    keywords: string[];
    promptPath: string;
}
export declare const archetypes: Archetype[];
/**
 * Detect archetype from user prompt
 * Uses keyword matching to identify the most likely design type
 */
export declare function detectArchetype(prompt: string): Archetype;
/**
 * Get archetype by ID
 */
export declare function getArchetype(id: string): Archetype | undefined;
/**
 * Get all archetype IDs
 */
export declare function getArchetypeIds(): string[];
