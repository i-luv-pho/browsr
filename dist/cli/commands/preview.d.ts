/**
 * Preview Command
 * Start a local dev server to preview designs
 */
export interface PreviewOptions {
    port: string;
}
export declare function preview(path: string, options: PreviewOptions): Promise<void>;
