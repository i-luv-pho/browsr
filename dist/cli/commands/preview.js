/**
 * Preview Command
 * Start a local dev server to preview designs
 */
import { createServer } from 'http';
import { join, extname } from 'path';
import { existsSync, readFileSync, statSync } from 'fs';
import { exec } from 'child_process';
import chalk from 'chalk';
// MIME types for common file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
};
export async function preview(path, options) {
    const port = parseInt(options.port, 10) || 3000;
    const outputDir = path || './output';
    // Check if output directory exists
    if (!existsSync(outputDir)) {
        console.error(chalk.red(`Directory not found: ${outputDir}`));
        console.log(chalk.gray('Run "build create <prompt>" first to generate a design.'));
        process.exit(1);
    }
    // Check if index.html exists
    const indexPath = join(outputDir, 'index.html');
    if (!existsSync(indexPath)) {
        console.error(chalk.red(`No index.html found in ${outputDir}`));
        process.exit(1);
    }
    console.log(chalk.cyan('═══════════════════════════════════════════════════════════'));
    console.log(chalk.white.bold('  DesignCraft Preview Server'));
    console.log(chalk.cyan('═══════════════════════════════════════════════════════════'));
    console.log();
    console.log(chalk.gray('  Serving:  ') + chalk.white(outputDir));
    console.log(chalk.gray('  Local:    ') + chalk.cyan(`http://localhost:${port}`));
    console.log();
    console.log(chalk.gray('  Press Ctrl+C to stop'));
    console.log();
    // Live reload script to inject
    const liveReloadScript = `
<script>
  // Live reload
  let lastModified = null;
  setInterval(async () => {
    try {
      const res = await fetch('/__check');
      const modified = await res.text();
      if (lastModified && modified !== lastModified) {
        location.reload();
      }
      lastModified = modified;
    } catch {}
  }, 1000);
</script>
`;
    // Create HTTP server
    const server = createServer((req, res) => {
        let filePath = req.url || '/';
        // Default to index.html
        if (filePath === '/') {
            filePath = '/index.html';
        }
        // Handle live reload check endpoint
        if (filePath === '/__check') {
            try {
                const stat = statSync(indexPath);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(stat.mtimeMs.toString());
            }
            catch {
                res.writeHead(500);
                res.end('Error');
            }
            return;
        }
        const fullPath = join(outputDir, filePath);
        // Check if file exists
        if (!existsSync(fullPath)) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }
        try {
            // Get MIME type
            const ext = extname(fullPath);
            const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
            // Read and serve the file
            let content = readFileSync(fullPath);
            // Inject live reload script into HTML files
            if (ext === '.html') {
                let htmlContent = content.toString('utf-8');
                htmlContent = htmlContent.replace('</body>', liveReloadScript + '</body>');
                content = Buffer.from(htmlContent);
            }
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content);
        }
        catch (error) {
            res.writeHead(500);
            res.end('Server Error');
        }
    });
    server.listen(port, () => {
        // Open browser on macOS
        try {
            exec(`open http://localhost:${port}`);
        }
        catch {
            // Ignore if open command fails
        }
    });
    // Keep the process running
    await new Promise(() => { });
}
