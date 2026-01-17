/**
 * Deploy Command
 * Deploy designs to Cloudflare Pages
 */

import { existsSync } from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

export interface DeployOptions {
  name?: string;
}

/**
 * Generate a random project name
 */
function generateProjectName(): string {
  const adjectives = [
    'swift', 'bright', 'cosmic', 'stellar', 'rapid', 'sleek', 'bold', 'vivid',
    'crisp', 'clean', 'sharp', 'pure', 'prime', 'elite', 'ultra', 'nova'
  ];
  const nouns = [
    'design', 'craft', 'studio', 'forge', 'works', 'labs', 'hub', 'deck',
    'page', 'site', 'view', 'space', 'zone', 'base', 'core', 'edge'
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);

  return `${adj}-${noun}-${num}`;
}

export async function deploy(path: string, options: DeployOptions): Promise<void> {
  const spinner = ora();
  const outputDir = path || './output';
  const projectName = options.name || generateProjectName();

  // Check if output directory exists
  if (!existsSync(outputDir)) {
    console.error(chalk.red(`Directory not found: ${outputDir}`));
    console.log(chalk.gray('Run "build create <prompt>" first to generate a design.'));
    process.exit(1);
  }

  // Check if wrangler is installed
  try {
    execSync('which wrangler', { stdio: 'ignore' });
  } catch {
    console.error(chalk.red('Wrangler CLI not found.'));
    console.log(chalk.gray('Install it with: npm install -g wrangler'));
    console.log(chalk.gray('Then authenticate with: wrangler login'));
    process.exit(1);
  }

  console.log(chalk.cyan('═══════════════════════════════════════════════════════════'));
  console.log(chalk.white.bold('  Deploying to Cloudflare Pages'));
  console.log(chalk.cyan('═══════════════════════════════════════════════════════════'));
  console.log();
  console.log(chalk.gray('  Project:  ') + chalk.white(projectName));
  console.log(chalk.gray('  Source:   ') + chalk.white(outputDir));
  console.log();

  try {
    // Deploy to Cloudflare Pages
    spinner.start(chalk.gray('Uploading to Cloudflare...'));

    const result = execSync(
      `wrangler pages deploy ${outputDir} --project-name=${projectName}`,
      { encoding: 'utf-8' }
    );

    spinner.succeed(chalk.green('Deployed successfully!'));

    // Extract the URL from wrangler output
    const urlMatch = result.match(/https:\/\/[^\s]+\.pages\.dev/);
    const deployUrl = urlMatch ? urlMatch[0] : `https://${projectName}.pages.dev`;

    console.log();
    console.log(chalk.cyan('═══════════════════════════════════════════════════════════'));
    console.log(chalk.white.bold('  Deployment Complete!'));
    console.log(chalk.cyan('═══════════════════════════════════════════════════════════'));
    console.log();
    console.log(chalk.gray('  Live URL: ') + chalk.cyan(deployUrl));
    console.log();
    console.log(chalk.gray('  Your design is now live on the web!'));
    console.log(chalk.gray('  Share this URL with anyone.'));
    console.log();

    // Try to open the URL
    try {
      execSync(`open ${deployUrl}`, { stdio: 'ignore' });
    } catch {
      // Ignore if open command fails
    }
  } catch (error) {
    spinner.fail(chalk.red('Deployment failed'));

    if (error instanceof Error) {
      console.error(chalk.red('\nError: ') + error.message);
    }

    console.log(chalk.gray('\nTroubleshooting:'));
    console.log(chalk.gray('  1. Make sure you\'re logged in: wrangler login'));
    console.log(chalk.gray('  2. Check your Cloudflare account has Pages enabled'));
    console.log(chalk.gray('  3. Try a different project name with: build deploy -n my-project'));

    process.exit(1);
  }
}
