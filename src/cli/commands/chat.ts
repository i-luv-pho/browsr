/**
 * Interactive Chat Mode
 * Like Claude Code - just talk and it does stuff
 */

import * as readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { exec } from 'child_process';

const anthropic = new Anthropic();

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are browsr, an AI design assistant that creates professional HTML/CSS designs. You are like Claude Code but for design.

IMPORTANT BEHAVIORS:
1. BE AUTONOMOUS - Just do things. Don't ask for permission or confirmation. The user trusts you.
2. BE CONVERSATIONAL - Talk naturally, not like a boring assistant.
3. BE PROACTIVE - If you see something that could be improved, do it.
4. ITERATE - When the user says "make it more X", modify the existing design.

WHAT YOU CAN DO:
- Generate HTML/CSS designs (posters, resumes, pitch decks, social media posts, etc.)
- Modify existing designs based on feedback
- Deploy designs
- Open previews

WHEN GENERATING DESIGNS:
- Output ONLY the HTML code wrapped in \`\`\`html ... \`\`\` code blocks
- Use premium aesthetics (Stripe/Linear quality, not generic Bootstrap)
- Make it fully responsive
- Use modern CSS (flexbox, grid, variables)
- Include all CSS inline in a <style> tag
- Use Inter font from Google Fonts

WHEN USER SAYS THINGS LIKE:
- "make it bluer" → modify the colors in the last design
- "add my name John" → update the text
- "make it bigger" → increase sizes
- "deploy it" → tell them you're deploying
- "show me" / "preview" → tell them you're opening preview

RESPONSE FORMAT:
- If generating/modifying a design: Include the full HTML in a code block, then a brief message
- If just chatting: Just respond naturally
- Keep responses SHORT unless outputting HTML

Current output directory: ./output
`;

let conversationHistory: Message[] = [];
let lastGeneratedHTML: string | null = null;
let outputDir = './output';

async function chat(userMessage: string): Promise<string> {
  conversationHistory.push({ role: 'user', content: userMessage });

  // Include last HTML context if exists
  let contextMessage = userMessage;
  if (lastGeneratedHTML && (
    userMessage.toLowerCase().includes('change') ||
    userMessage.toLowerCase().includes('make it') ||
    userMessage.toLowerCase().includes('modify') ||
    userMessage.toLowerCase().includes('update') ||
    userMessage.toLowerCase().includes('more') ||
    userMessage.toLowerCase().includes('less') ||
    userMessage.toLowerCase().includes('add') ||
    userMessage.toLowerCase().includes('remove')
  )) {
    contextMessage = `Current design HTML:\n\`\`\`html\n${lastGeneratedHTML}\n\`\`\`\n\nUser request: ${userMessage}\n\nModify the design based on the request. Output the complete updated HTML.`;
  }

  const messages = conversationHistory.map((msg, i) => ({
    role: msg.role as 'user' | 'assistant',
    content: i === conversationHistory.length - 1 ? contextMessage : msg.content
  }));

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages,
  });

  const textBlock = response.content.find(block => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No response');
  }

  const assistantMessage = textBlock.text;
  conversationHistory.push({ role: 'assistant', content: assistantMessage });

  // Extract and save HTML if present
  const htmlMatch = assistantMessage.match(/```html\s*([\s\S]*?)```/);
  if (htmlMatch) {
    lastGeneratedHTML = htmlMatch[1].trim();
    await saveDesign(lastGeneratedHTML);
  }

  return assistantMessage;
}

async function saveDesign(html: string): Promise<void> {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(outputPath, html);
}

function openPreview(): void {
  const outputPath = path.join(outputDir, 'index.html');
  if (fs.existsSync(outputPath)) {
    exec(`open "${outputPath}"`);
  }
}

function formatResponse(response: string): string {
  // Remove HTML code blocks from display (already saved)
  let display = response.replace(/```html[\s\S]*?```/g, chalk.green('✓ Design saved to ./output/index.html'));
  return display;
}

export async function startChat(): Promise<void> {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██████╗ ██████╗  ██████╗ ██╗    ██╗███████╗██████╗         ║
║   ██╔══██╗██╔══██╗██╔═══██╗██║    ██║██╔════╝██╔══██╗        ║
║   ██████╔╝██████╔╝██║   ██║██║ █╗ ██║███████╗██████╔╝        ║
║   ██╔══██╗██╔══██╗██║   ██║██║███╗██║╚════██║██╔══██╗        ║
║   ██████╔╝██║  ██║╚██████╔╝╚███╔███╔╝███████║██║  ██║        ║
║   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝        ║
║                                                               ║
║   Interactive Mode - Just tell me what to make               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`));

  console.log(chalk.white('  Just type what you want. I\'ll make it happen.\n'));
  console.log(chalk.gray('  Examples:'));
  console.log(chalk.gray('    "make me a pitch deck for my AI startup"'));
  console.log(chalk.gray('    "make it more minimal"'));
  console.log(chalk.gray('    "change the color to blue"'));
  console.log(chalk.gray('    "preview" or "open"'));
  console.log(chalk.gray('    "exit" or "quit"\n'));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = (): void => {
    rl.question(chalk.cyan('> '), async (input) => {
      const trimmed = input.trim();

      if (!trimmed) {
        prompt();
        return;
      }

      if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
        console.log(chalk.gray('\nBye! ✌️\n'));
        rl.close();
        process.exit(0);
      }

      if (trimmed.toLowerCase() === 'preview' || trimmed.toLowerCase() === 'open' || trimmed.toLowerCase() === 'show') {
        if (lastGeneratedHTML) {
          console.log(chalk.green('\n  Opening preview...\n'));
          openPreview();
        } else {
          console.log(chalk.yellow('\n  No design yet. Tell me what to make!\n'));
        }
        prompt();
        return;
      }

      // Auto-handle simple commands without AI
      if (trimmed.toLowerCase().startsWith('cd ')) {
        const dir = trimmed.slice(3).trim();
        try {
          process.chdir(dir);
          outputDir = './output';
          console.log(chalk.green(`\n  Changed to ${process.cwd()}\n`));
        } catch {
          console.log(chalk.red(`\n  Can't cd to ${dir}\n`));
        }
        prompt();
        return;
      }

      if (trimmed.toLowerCase() === 'clear') {
        conversationHistory = [];
        lastGeneratedHTML = null;
        console.log(chalk.gray('\n  Conversation cleared.\n'));
        prompt();
        return;
      }

      const spinner = ora({
        text: 'Thinking...',
        color: 'cyan',
      }).start();

      try {
        const response = await chat(trimmed);
        spinner.stop();

        const formatted = formatResponse(response);
        console.log('\n' + formatted + '\n');

        // Auto-open preview if we generated something
        if (response.includes('```html')) {
          console.log(chalk.gray('  Auto-opening preview...\n'));
          openPreview();
        }
      } catch (error: any) {
        spinner.stop();
        if (error.message?.includes('API key')) {
          console.log(chalk.red('\n  No API key! Run: export ANTHROPIC_API_KEY="your-key"\n'));
        } else {
          console.log(chalk.red(`\n  Error: ${error.message}\n`));
        }
      }

      prompt();
    });
  };

  prompt();
}
