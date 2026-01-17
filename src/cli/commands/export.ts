/**
 * Export Command
 * Export designs to PDF or PNG
 */

import { existsSync } from 'fs';
import { join, resolve } from 'path';
import chalk from 'chalk';
import ora from 'ora';

export interface ExportOptions {
  format: 'pdf' | 'png';
  output?: string;
}

export async function exportDesign(path: string, options: ExportOptions): Promise<void> {
  const spinner = ora();
  const outputDir = path || './output';
  const format = options.format || 'pdf';

  // Check if output directory exists
  if (!existsSync(outputDir)) {
    console.error(chalk.red(`Directory not found: ${outputDir}`));
    console.log(chalk.gray('Run "build create <prompt>" first to generate a design.'));
    process.exit(1);
  }

  const indexPath = join(outputDir, 'index.html');
  if (!existsSync(indexPath)) {
    console.error(chalk.red(`No index.html found in ${outputDir}`));
    process.exit(1);
  }

  console.log(chalk.cyan('═══════════════════════════════════════════════════════════'));
  console.log(chalk.white.bold(`  Exporting to ${format.toUpperCase()}`));
  console.log(chalk.cyan('═══════════════════════════════════════════════════════════'));
  console.log();

  try {
    // Dynamic import of puppeteer (optional dependency)
    let puppeteer;
    try {
      puppeteer = await import('puppeteer');
    } catch {
      console.error(chalk.red('Puppeteer not installed.'));
      console.log(chalk.gray('Install it with: bun add puppeteer'));
      console.log();
      console.log(chalk.yellow('Alternative: Open the HTML file in Chrome and use Print > Save as PDF'));
      process.exit(1);
    }

    spinner.start(chalk.gray(`Rendering ${format.toUpperCase()}...`));

    // Launch browser
    const browser = await puppeteer.default.launch({
      headless: true,
    });

    const page = await browser.newPage();

    // Navigate to the HTML file
    const fileUrl = `file://${resolve(indexPath)}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Wait a bit for fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Determine output path
    const outputPath = options.output || join(outputDir, `design.${format}`);

    if (format === 'pdf') {
      // Export as PDF
      await page.pdf({
        path: outputPath,
        format: 'Letter',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
    } else {
      // Export as PNG
      await page.screenshot({
        path: outputPath,
        fullPage: true,
        type: 'png',
      });
    }

    await browser.close();

    spinner.succeed(chalk.green('Export complete!'));

    console.log();
    console.log(chalk.gray('  Output: ') + chalk.white(outputPath));
    console.log();

    // Try to open the file
    try {
      const { execSync } = await import('child_process');
      execSync(`open "${outputPath}"`, { stdio: 'ignore' });
    } catch {
      // Ignore if open command fails
    }
  } catch (error) {
    spinner.fail(chalk.red('Export failed'));

    if (error instanceof Error) {
      console.error(chalk.red('\nError: ') + error.message);
    }

    process.exit(1);
  }
}
