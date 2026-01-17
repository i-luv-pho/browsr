/**
 * Create Command
 * Generate a new design from a natural language prompt
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { detectArchetype, getArchetype } from '../../archetypes';
import { generate } from '../../engine/generator';
import { preview } from './preview';

export interface CreateOptions {
  type?: string;
  style?: string;
  output: string;
  preview: boolean;
}

export async function create(prompt: string, options: CreateOptions): Promise<void> {
  const spinner = ora();

  try {
    // Step 1: Detect or use specified archetype
    spinner.start(chalk.gray('Analyzing your request...'));

    let archetype;
    if (options.type) {
      archetype = getArchetype(options.type);
      if (!archetype) {
        spinner.fail(chalk.red(`Unknown design type: ${options.type}`));
        console.log(chalk.gray('Run "browsrtypes" to see available types'));
        return;
      }
    } else {
      archetype = detectArchetype(prompt);
    }

    spinner.succeed(chalk.green(`Detected: ${archetype.name}`));

    // Step 2: Generate the design
    spinner.start(chalk.gray(`Generating ${archetype.name}...`));

    const design = await generate(archetype, prompt, options.style);

    spinner.succeed(chalk.green(`Generated in ${(design.generationTime / 1000).toFixed(1)}s`));

    // Step 3: Write output files
    spinner.start(chalk.gray('Writing files...'));

    // Ensure output directory exists
    const outputDir = options.output;
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Write the HTML file
    const htmlPath = join(outputDir, 'index.html');
    writeFileSync(htmlPath, design.html, 'utf-8');

    // Write metadata
    const metadataPath = join(outputDir, 'design.json');
    writeFileSync(
      metadataPath,
      JSON.stringify(
        {
          archetype: design.archetype.id,
          style: design.style,
          prompt: design.prompt,
          generatedAt: new Date().toISOString(),
          generationTime: design.generationTime,
        },
        null,
        2
      ),
      'utf-8'
    );

    spinner.succeed(chalk.green(`Files written to ${outputDir}/`));

    // Summary
    console.log();
    console.log(chalk.cyan('═══════════════════════════════════════════════════════════'));
    console.log(chalk.white.bold('  Design Generated Successfully!'));
    console.log(chalk.cyan('═══════════════════════════════════════════════════════════'));
    console.log();
    console.log(chalk.gray('  Type:     ') + chalk.white(archetype.name));
    console.log(chalk.gray('  Style:    ') + chalk.white(design.style));
    console.log(chalk.gray('  Time:     ') + chalk.white(`${(design.generationTime / 1000).toFixed(1)}s`));
    console.log(chalk.gray('  Output:   ') + chalk.white(htmlPath));
    console.log();
    console.log(chalk.gray('  Next steps:'));
    console.log(chalk.gray('    • ') + chalk.white(`open ${htmlPath}`) + chalk.gray(' - View in browser'));
    console.log(chalk.gray('    • ') + chalk.white('browsrpreview') + chalk.gray(' - Start dev server'));
    console.log(chalk.gray('    • ') + chalk.white('browsrdeploy') + chalk.gray(' - Deploy to web'));
    console.log(chalk.gray('    • ') + chalk.white('browsrexport --format pdf') + chalk.gray(' - Export to PDF'));
    console.log();

    // Step 4: Auto-preview if enabled
    if (options.preview) {
      console.log(chalk.yellow('Starting preview server...'));
      console.log();
      await preview(outputDir, { port: '3000' });
    }
  } catch (error) {
    spinner.fail(chalk.red('Generation failed'));

    if (error instanceof Error) {
      console.error(chalk.red('\nError: ') + error.message);

      if (error.message.includes('API')) {
        console.log(chalk.gray('\nMake sure ANTHROPIC_API_KEY is set in your environment.'));
      }
    }

    process.exit(1);
  }
}
