/**
 * Deploy Command
 * Deploy designs to Cloudflare Pages
 */
export interface DeployOptions {
    name?: string;
}
export declare function deploy(path: string, options: DeployOptions): Promise<void>;
