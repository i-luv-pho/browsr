/**
 * Export Command
 * Export designs to PDF or PNG
 */
export interface ExportOptions {
    format: 'pdf' | 'png';
    output?: string;
}
export declare function exportDesign(path: string, options: ExportOptions): Promise<void>;
