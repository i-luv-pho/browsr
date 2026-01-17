/**
 * browsr - AI Design Studio
 * Everything Claude Code has, but for design
 */

import * as readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs';
import * as path from 'path';
import { execSync, exec } from 'child_process';
import * as http from 'http';
import * as os from 'os';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const VERSION = '1.0.0';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Design {
  id: string;
  html: string;
  prompt: string;
  timestamp: number;
}

interface Memory {
  recentDesigns: { prompt: string; timestamp: number }[];
  preferences: Record<string, string>;
  stats: { designs: number; sessions: number; tokens: number };
}

interface Config {
  autoOpen: boolean;
  darkMode: boolean;
  outputDir: string;
  model: string;
}

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════

let messages: Message[] = [];
let designs: Design[] = [];
let currentHTML: string | null = null;
let config: Config = {
  autoOpen: true,
  darkMode: true,
  outputDir: './output',
  model: 'claude-sonnet-4-20250514'
};
let memory: Memory = {
  recentDesigns: [],
  preferences: {},
  stats: { designs: 0, sessions: 0, tokens: 0 }
};
let server: http.Server | null = null;
let totalTokens = 0;

const MEMORY_FILE = path.join(os.homedir(), '.browsr_memory.json');
const CONFIG_FILE = path.join(os.homedir(), '.browsr_config.json');

// ═══════════════════════════════════════════════════════════════
// SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════════

const SYSTEM = `You are browsr, a world-class AI assistant for visual design. You're like Claude Code but specialized in creating stunning HTML/CSS.

## IDENTITY
- Expert designer and conversationalist
- Confident, helpful, opinionated
- Concise but thorough
- You ship, you don't overthink

## MODES

### Chat Mode
When users ask questions, want advice, or discuss ideas:
- Answer naturally and helpfully
- Share expertise and opinions
- No HTML needed

### Design Mode
When users want to CREATE or MODIFY designs:
- Output COMPLETE HTML in \`\`\`html code blocks
- Designs auto-save and auto-open
- Brief message after (1 sentence)

## DESIGN PHILOSOPHY
Create designs worthy of:
✓ Stripe, Linear, Vercel, Raycast, Figma
✗ NOT Bootstrap, WordPress themes, Squarespace

## TECHNICAL SPEC
- Dark mode: #0a0a0a base, light text
- Font: Inter (Google Fonts)
- CSS: custom properties, flexbox/grid
- Animations: subtle, 0.2s ease
- Responsive: mobile-first breakpoints
- Self-contained: no external deps

## DESIGN TYPES
pitch-deck, resume, poster, instagram, story, youtube-thumb, landing, portfolio, business-card, flyer, certificate, invoice, menu, infographic, quote, logo, presentation, website, email, newsletter, banner, hero, pricing, testimonials, team, dashboard, 404, comparison, timeline, checklist

## ITERATION
"make it X" / "change Y" → output FULL modified HTML

## STYLE
- Brief, confident responses
- No "I'd be happy to" or "Certainly!"
- Just do the thing
- Suggest improvements proactively

Remember: You're in a terminal. Designs auto-open in browser.`;

// ═══════════════════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════════════════

function loadMemory(): void {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      memory = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
    }
  } catch { /* ignore */ }
}

function saveMemory(): void {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
  } catch { /* ignore */ }
}

function loadConfig(): void {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      config = { ...config, ...JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) };
    }
  } catch { /* ignore */ }
}

function saveConfig(): void {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch { /* ignore */ }
}

// ═══════════════════════════════════════════════════════════════
// CORE AI
// ═══════════════════════════════════════════════════════════════

async function chat(input: string): Promise<string> {
  messages.push({ role: 'user', content: input });

  // Context for modifications
  let prompt = input;
  if (currentHTML && /^(make|change|update|modify|add|remove|try|more|less|bigger|smaller|darker|lighter|different|like |could|can|tweak|adjust|fix|improve)/i.test(input)) {
    prompt = `[Current Design]\n\`\`\`html\n${currentHTML}\n\`\`\`\n\n[Request] ${input}`;
  }

  const apiMessages = messages.map((m, i) => ({
    role: m.role as 'user' | 'assistant',
    content: i === messages.length - 1 ? prompt : m.content,
  }));

  const response = await anthropic.messages.create({
    model: config.model,
    max_tokens: 32000,
    system: SYSTEM,
    messages: apiMessages,
  });

  // Track tokens
  totalTokens += (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);
  memory.stats.tokens += (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

  const block = response.content.find(b => b.type === 'text');
  if (!block || block.type !== 'text') throw new Error('Empty response');

  const reply = block.text;
  messages.push({ role: 'assistant', content: reply });

  // Extract HTML
  const match = reply.match(/```html\s*([\s\S]*?)```/);
  if (match) {
    currentHTML = match[1].trim();
    const id = `design_${Date.now()}`;
    designs.push({ id, html: currentHTML, prompt: input, timestamp: Date.now() });
    save(currentHTML);
    memory.stats.designs++;
    memory.recentDesigns.unshift({ prompt: input, timestamp: Date.now() });
    memory.recentDesigns = memory.recentDesigns.slice(0, 20);
    saveMemory();
  }

  return reply;
}

// ═══════════════════════════════════════════════════════════════
// FILE OPERATIONS
// ═══════════════════════════════════════════════════════════════

function save(html: string, filename = 'index.html'): void {
  fs.mkdirSync(config.outputDir, { recursive: true });
  fs.writeFileSync(path.join(config.outputDir, filename), html);
}

function open(target?: string): void {
  if (!config.autoOpen) return;
  const file = target || path.resolve(config.outputDir, 'index.html');
  try {
    const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open';
    execSync(`${cmd} "${file}"`, { stdio: 'ignore' });
  } catch { /* ignore */ }
}

function readFile(filepath: string): string | null {
  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch {
    return null;
  }
}

function writeFile(filepath: string, content: string): boolean {
  try {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, content);
    return true;
  } catch {
    return false;
  }
}

function listFiles(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════
// PREVIEW SERVER
// ═══════════════════════════════════════════════════════════════

function startServer(port = 3333): void {
  if (server) return;

  server = http.createServer((req, res) => {
    const file = path.join(config.outputDir, 'index.html');
    if (fs.existsSync(file)) {
      // Inject auto-reload script
      let html = fs.readFileSync(file, 'utf8');
      const reloadScript = `<script>setInterval(()=>fetch('/check').then(r=>r.text()).then(t=>t!==document.body.innerHTML.length.toString()&&location.reload()),1000)</script>`;
      html = html.replace('</body>', `${reloadScript}</body>`);
      res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' });
      res.end(html);
    } else if (req.url === '/check') {
      const file = path.join(config.outputDir, 'index.html');
      const size = fs.existsSync(file) ? fs.statSync(file).size.toString() : '0';
      res.end(size);
    } else {
      res.writeHead(404);
      res.end('No design yet');
    }
  });

  server.listen(port, () => {
    console.log(chalk.green(`\n  Live preview: http://localhost:${port}\n`));
    open(`http://localhost:${port}`);
  });
}

// ═══════════════════════════════════════════════════════════════
// BASH EXECUTION
// ═══════════════════════════════════════════════════════════════

function runBash(cmd: string): { stdout: string; stderr: string; code: number } {
  try {
    const stdout = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
    return { stdout, stderr: '', code: 0 };
  } catch (err: any) {
    return { stdout: err.stdout || '', stderr: err.stderr || err.message, code: err.status || 1 };
  }
}

// ═══════════════════════════════════════════════════════════════
// SLASH COMMANDS
// ═══════════════════════════════════════════════════════════════

const COMMANDS: Record<string, { desc: string; fn: (args: string) => void }> = {
  help: {
    desc: 'Show all commands',
    fn: () => {
      console.log(chalk.cyan('\n  Slash Commands:\n'));
      Object.entries(COMMANDS).forEach(([name, { desc }]) => {
        console.log(`  ${chalk.cyan('/' + name.padEnd(12))} ${chalk.gray(desc)}`);
      });
      console.log(chalk.cyan('\n  Quick Commands:\n'));
      console.log(`  ${chalk.cyan('open'.padEnd(12))} ${chalk.gray('Open design in browser')}`);
      console.log(`  ${chalk.cyan('live'.padEnd(12))} ${chalk.gray('Start live preview server')}`);
      console.log(`  ${chalk.cyan('history'.padEnd(12))} ${chalk.gray('Show design history')}`);
      console.log(`  ${chalk.cyan('clear'.padEnd(12))} ${chalk.gray('Clear conversation')}`);
      console.log(`  ${chalk.cyan('exit'.padEnd(12))} ${chalk.gray('Quit browsr')}`);
      console.log();
    }
  },
  clear: {
    desc: 'Clear conversation and start fresh',
    fn: () => {
      messages = [];
      currentHTML = null;
      console.clear();
      showBanner();
      console.log(chalk.green('  Fresh start.\n'));
    }
  },
  compact: {
    desc: 'Compact conversation history',
    fn: () => {
      const keep = messages.slice(-6);
      messages = keep;
      console.log(chalk.green(`\n  Compacted to ${keep.length} messages.\n`));
    }
  },
  config: {
    desc: 'View or set config (e.g., /config autoOpen false)',
    fn: (args) => {
      if (!args) {
        console.log(chalk.cyan('\n  Config:\n'));
        Object.entries(config).forEach(([k, v]) => {
          console.log(`  ${chalk.cyan(k.padEnd(12))} ${chalk.white(String(v))}`);
        });
        console.log();
      } else {
        const [key, ...rest] = args.split(' ');
        const value = rest.join(' ');
        if (key in config) {
          (config as any)[key] = value === 'true' ? true : value === 'false' ? false : value;
          saveConfig();
          console.log(chalk.green(`\n  Set ${key} = ${value}\n`));
        } else {
          console.log(chalk.yellow(`\n  Unknown config: ${key}\n`));
        }
      }
    }
  },
  memory: {
    desc: 'Show memory and stats',
    fn: () => {
      console.log(chalk.cyan('\n  Memory:\n'));
      console.log(`  ${chalk.gray('Designs created:')} ${memory.stats.designs}`);
      console.log(`  ${chalk.gray('Total tokens:')} ${memory.stats.tokens.toLocaleString()}`);
      console.log(`  ${chalk.gray('Session tokens:')} ${totalTokens.toLocaleString()}`);
      if (memory.recentDesigns.length > 0) {
        console.log(chalk.cyan('\n  Recent:\n'));
        memory.recentDesigns.slice(0, 5).forEach((d, i) => {
          const text = d.prompt.length > 40 ? d.prompt.slice(0, 40) + '...' : d.prompt;
          console.log(chalk.gray(`  ${i + 1}. ${text}`));
        });
      }
      console.log();
    }
  },
  model: {
    desc: 'View or change model',
    fn: (args) => {
      if (!args) {
        console.log(chalk.cyan(`\n  Current model: ${config.model}\n`));
      } else {
        config.model = args;
        saveConfig();
        console.log(chalk.green(`\n  Model set to: ${args}\n`));
      }
    }
  },
  cost: {
    desc: 'Show estimated API cost',
    fn: () => {
      const inputCost = (totalTokens * 0.003) / 1000;
      const outputCost = (totalTokens * 0.015) / 1000;
      const total = inputCost + outputCost;
      console.log(chalk.cyan(`\n  Session: ~$${total.toFixed(4)} (${totalTokens.toLocaleString()} tokens)\n`));
    }
  },
  export: {
    desc: 'Export current design to file',
    fn: (args) => {
      if (!currentHTML) {
        console.log(chalk.yellow('\n  No design to export.\n'));
        return;
      }
      const filename = args || `browsr-${Date.now()}.html`;
      writeFile(filename, currentHTML);
      console.log(chalk.green(`\n  Exported: ${filename}\n`));
    }
  },
  load: {
    desc: 'Load HTML file as current design',
    fn: (args) => {
      if (!args) {
        console.log(chalk.yellow('\n  Usage: /load filename.html\n'));
        return;
      }
      const content = readFile(args);
      if (content) {
        currentHTML = content;
        save(currentHTML);
        console.log(chalk.green(`\n  Loaded: ${args}\n`));
        open();
      } else {
        console.log(chalk.red(`\n  Can't read: ${args}\n`));
      }
    }
  },
  ls: {
    desc: 'List files in directory',
    fn: (args) => {
      const dir = args || '.';
      const files = listFiles(dir);
      if (files.length === 0) {
        console.log(chalk.yellow(`\n  Empty or can't read: ${dir}\n`));
      } else {
        console.log(chalk.cyan(`\n  ${dir}:\n`));
        files.forEach(f => console.log(`  ${f}`));
        console.log();
      }
    }
  },
  cat: {
    desc: 'Read file contents',
    fn: (args) => {
      if (!args) {
        console.log(chalk.yellow('\n  Usage: /cat filename\n'));
        return;
      }
      const content = readFile(args);
      if (content) {
        console.log('\n' + content + '\n');
      } else {
        console.log(chalk.red(`\n  Can't read: ${args}\n`));
      }
    }
  },
  bash: {
    desc: 'Run shell command',
    fn: (args) => {
      if (!args) {
        console.log(chalk.yellow('\n  Usage: /bash command\n'));
        return;
      }
      const { stdout, stderr, code } = runBash(args);
      if (stdout) console.log('\n' + stdout);
      if (stderr) console.log(chalk.red(stderr));
      if (code !== 0) console.log(chalk.yellow(`\n  Exit code: ${code}\n`));
    }
  },
  history: {
    desc: 'Show design history',
    fn: () => {
      if (designs.length === 0) {
        console.log(chalk.yellow('\n  No history yet.\n'));
        return;
      }
      console.log(chalk.cyan('\n  Design History:\n'));
      designs.forEach((d, i) => {
        const time = new Date(d.timestamp).toLocaleTimeString();
        const text = d.prompt.length > 40 ? d.prompt.slice(0, 40) + '...' : d.prompt;
        console.log(chalk.gray(`  ${i + 1}. [${time}] ${text}`));
      });
      console.log();
    }
  },
  restore: {
    desc: 'Restore design from history (e.g., /restore 1)',
    fn: (args) => {
      const n = parseInt(args);
      if (!n || n < 1 || n > designs.length) {
        console.log(chalk.yellow(`\n  Usage: /restore 1-${designs.length}\n`));
        return;
      }
      currentHTML = designs[n - 1].html;
      save(currentHTML);
      console.log(chalk.green(`\n  Restored #${n}\n`));
      open();
    }
  },
  version: {
    desc: 'Show version',
    fn: () => {
      console.log(chalk.cyan(`\n  browsr v${VERSION}\n`));
    }
  },
  doctor: {
    desc: 'Check system setup',
    fn: () => {
      console.log(chalk.cyan('\n  System Check:\n'));

      // API key
      const hasKey = !!process.env.ANTHROPIC_API_KEY;
      console.log(`  ${hasKey ? chalk.green('✓') : chalk.red('✗')} API key ${hasKey ? 'set' : 'missing'}`);

      // Node version
      const nodeVer = process.version;
      console.log(`  ${chalk.green('✓')} Node ${nodeVer}`);

      // Output dir
      const canWrite = (() => {
        try {
          fs.mkdirSync(config.outputDir, { recursive: true });
          return true;
        } catch { return false; }
      })();
      console.log(`  ${canWrite ? chalk.green('✓') : chalk.red('✗')} Output dir ${canWrite ? 'writable' : 'not writable'}`);

      // Browser
      const hasBrowser = process.platform === 'darwin' || process.platform === 'win32' || process.platform === 'linux';
      console.log(`  ${hasBrowser ? chalk.green('✓') : chalk.yellow('?')} Browser support`);

      console.log();
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// UI
// ═══════════════════════════════════════════════════════════════

function showBanner(): void {
  console.log(`
  ${chalk.bold.cyan('browsr')} ${chalk.gray(`v${VERSION}`)}
  ${chalk.gray('AI Design Studio')}

  ${chalk.gray('Create stunning designs with natural language.')}
  ${chalk.gray('Type /help for commands.')}
`);
}

function format(text: string): string {
  return text.replace(/```html[\s\S]*?```/g, chalk.green('✓ Design saved → ./output/index.html')).trim();
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

export async function startChat(): Promise<void> {
  loadConfig();
  loadMemory();
  memory.stats.sessions++;
  saveMemory();

  console.clear();
  showBanner();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Handle Ctrl+C gracefully
  rl.on('close', () => {
    if (server) server.close();
    console.log(chalk.gray('\n  ✌️\n'));
    process.exit(0);
  });

  const prompt = (): void => {
    rl.question(chalk.cyan('› '), async (input) => {
      const cmd = input.trim();

      if (!cmd) { prompt(); return; }

      // Slash commands
      if (cmd.startsWith('/')) {
        const [name, ...rest] = cmd.slice(1).split(' ');
        const args = rest.join(' ');
        const handler = COMMANDS[name.toLowerCase()];
        if (handler) {
          handler.fn(args);
        } else {
          console.log(chalk.yellow(`\n  Unknown command: /${name}. Try /help\n`));
        }
        prompt();
        return;
      }

      // Quick commands (no slash)
      const lower = cmd.toLowerCase();

      if (/^(exit|quit|q|bye)$/.test(lower)) {
        if (server) server.close();
        saveMemory();
        console.log(chalk.gray('\n  ✌️\n'));
        process.exit(0);
      }

      if (/^(open|o|preview|p|show)$/.test(lower)) {
        if (currentHTML) {
          config.autoOpen = true;
          open();
          console.log(chalk.green('\n  Opened.\n'));
        } else {
          console.log(chalk.yellow('\n  No design yet.\n'));
        }
        prompt(); return;
      }

      if (/^(live|serve|server|watch)$/.test(lower)) {
        startServer();
        prompt(); return;
      }

      if (/^(clear|reset|new)$/.test(lower)) {
        COMMANDS.clear.fn('');
        prompt(); return;
      }

      if (/^(history|h)$/.test(lower)) {
        COMMANDS.history.fn('');
        prompt(); return;
      }

      if (/^restore \d+$/.test(lower)) {
        COMMANDS.restore.fn(lower.split(' ')[1]);
        prompt(); return;
      }

      if (/^help$/.test(lower)) {
        COMMANDS.help.fn('');
        prompt(); return;
      }

      // AI interaction
      const spinner = ora({ text: chalk.gray('Thinking...'), color: 'cyan' }).start();

      try {
        const response = await chat(cmd);
        spinner.stop();

        const output = format(response);
        console.log('\n' + output.split('\n').map(l => '  ' + l).join('\n') + '\n');

        if (response.includes('```html')) {
          open();
        }
      } catch (err: any) {
        spinner.stop();
        const msg = err.message || String(err);

        if (msg.includes('API') || msg.includes('key') || msg.includes('401') || msg.includes('auth')) {
          console.log(chalk.red('\n  API key issue. Run /doctor to check setup.\n'));
        } else if (msg.includes('rate') || msg.includes('429')) {
          console.log(chalk.yellow('\n  Rate limited. Wait a moment.\n'));
        } else {
          console.log(chalk.red(`\n  Error: ${msg}\n`));
        }
      }

      prompt();
    });
  };

  prompt();
}
