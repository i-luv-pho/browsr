/**
 * Create Command
 * Generate a new design from a natural language prompt
 */
export interface CreateOptions {
    type?: string;
    style?: string;
    output: string;
    preview: boolean;
}
export declare function create(prompt: string, options: CreateOptions): Promise<void>;
