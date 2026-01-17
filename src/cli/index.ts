/**
 * browsr CLI
 * Terminal AI builder for creating professional HTML/CSS designs
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { create } from './commands/create';
import { preview } from './commands/preview';
import { deploy } from './commands/deploy';
import { exportDesign } from './commands/export';
import { startChat } from './commands/chat';

const program = new Command();

// Hacker green theme
const g = chalk.green;
const gg = chalk.greenBright;
const gd = chalk.gray;

// ASCII art banner - HACKER GREEN
const banner = `
${g('╔═══════════════════════════════════════════════════════════════╗')}
${g('║')}                                                               ${g('║')}
${g('║')}   ${gg('██████╗ ██████╗  ██████╗ ██╗    ██╗███████╗██████╗')}         ${g('║')}
${g('║')}   ${gg('██╔══██╗██╔══██╗██╔═══██╗██║    ██║██╔════╝██╔══██╗')}        ${g('║')}
${g('║')}   ${gg('██████╔╝██████╔╝██║   ██║██║ █╗ ██║███████╗██████╔╝')}        ${g('║')}
${g('║')}   ${gg('██╔══██╗██╔══██╗██║   ██║██║███╗██║╚════██║██╔══██╗')}        ${g('║')}
${g('║')}   ${gg('██████╔╝██║  ██║╚██████╔╝╚███╔███╔╝███████║██║  ██║')}        ${g('║')}
${g('║')}   ${gg('╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝')}        ${g('║')}
${g('║')}                                                               ${g('║')}
${g('║')}   ${gd('FREE AI design generation • Powered by Groq')}                ${g('║')}
${g('║')}   ${gd('Create professional HTML/CSS from natural language')}         ${g('║')}
${g('║')}                                                               ${g('║')}
${g('╚═══════════════════════════════════════════════════════════════╝')}
`;

program
  .name('browsr')
  .description('browsr - FREE AI design builder that outputs real HTML/CSS/JS')
  .version('2.1.0')
  .addHelpText('beforeAll', banner);

// Create command - main design generation
program
  .command('create')
  .description('Create a new design from a natural language prompt')
  .argument('<prompt>', 'Description of what to create')
  .option('-t, --type <type>', 'Design type (pitch-deck, resume, poster, instagram, youtube-thumb, etc.)')
  .option('-s, --style <style>', 'Style variant (minimal, bold, elegant, modern, professional)', 'professional')
  .option('-o, --output <dir>', 'Output directory', './output')
  .option('--no-preview', 'Skip automatic preview')
  .action(async (prompt: string, options) => {
    console.log(banner);
    console.log();
    await create(prompt, options);
  });

// Preview command
program
  .command('preview')
  .description('Start a preview server for your design')
  .argument('[path]', 'Path to the design directory', './output')
  .option('-p, --port <port>', 'Port to run the preview server', '3000')
  .action(preview);

// Deploy command
program
  .command('deploy')
  .description('Deploy your design to Cloudflare Pages')
  .argument('[path]', 'Path to the design directory', './output')
  .option('-n, --name <name>', 'Project name for the deployment')
  .action(deploy);

// Export command
program
  .command('export')
  .description('Export your design to PDF or PNG')
  .argument('[path]', 'Path to the design directory', './output')
  .option('-f, --format <format>', 'Export format (pdf, png)', 'pdf')
  .option('-o, --output <file>', 'Output file path')
  .action(exportDesign);

// List archetypes command
program
  .command('types')
  .description('List all available design types')
  .action(() => {
    console.log(g('\nAvailable design types:\n'));

    const types = [
      { name: 'pitch-deck', desc: 'Startup pitch deck for investors' },
      { name: 'resume', desc: 'Professional resume/CV' },
      { name: 'poster', desc: 'Event poster or promotional material' },
      { name: 'instagram', desc: 'Instagram post (1080x1080)' },
      { name: 'youtube-thumb', desc: 'YouTube thumbnail (1280x720)' },
      { name: 'infographic', desc: 'Data visualization infographic' },
      { name: 'flyer', desc: 'Event or promotional flyer' },
      { name: 'business-card', desc: 'Professional business card' },
      { name: 'logo', desc: 'Brand logo design' },
      { name: 'portfolio', desc: 'Portfolio presentation' },
      { name: 'study-guide', desc: 'Educational study guide' },
      { name: 'flashcards', desc: 'Study flashcards' },
      { name: 'research-poster', desc: 'Academic research poster' },
      { name: 'quote', desc: 'Quote graphic for social media' },
      { name: 'certificate', desc: 'Achievement certificate' },
    ];

    types.forEach(({ name, desc }) => {
      console.log(`  ${gg(name.padEnd(18))} ${gd(desc)}`);
    });

    console.log(g('\nStyles available: ') + chalk.white('minimal, bold, elegant, modern, professional'));
    console.log(gd('\nExample: browsr create "A pitch deck for my AI startup" -t pitch-deck -s modern\n'));
  });

// Chat mode - interactive like Claude Code (default)
program
  .command('chat', { isDefault: true })
  .description('Start browsr in interactive chat mode (like Claude Code)')
  .action(async () => {
    await startChat();
  });

program.parse();
