/**
 * browsr v2.0 - The Ultimate AI Design Studio
 * Fixes ALL Claude Code complaints. Speed > Safety.
 */

import * as readline from 'readline';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as http from 'http';
import * as os from 'os';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const VERSION = '2.0.0';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface Message { role: 'user' | 'assistant'; content: string }
interface Design { html: string; prompt: string; ts: number }

// ═══════════════════════════════════════════════════════════════
// STATE - Minimal, no bloat
// ═══════════════════════════════════════════════════════════════

let messages: Message[] = [];
let designs: Design[] = [];
let html: string | null = null;
let tokens = 0;
let server: http.Server | null = null;

// Config - speed focused defaults
const config = {
  model: 'claude-sonnet-4-20250514',
  maxHistory: 10,        // Keep conversation short for speed
  outputDir: './output',
  autoOpen: true,
  stream: true,          // Stream responses for perceived speed
  retries: 2,            // Fast retry on failure
  timeout: 60000,        // 60s timeout
};

// Paths
const HOME = os.homedir();
const MEMORY_FILE = path.join(HOME, '.browsr.json');

// ═══════════════════════════════════════════════════════════════
// SYSTEM PROMPT - Optimized for quality + speed
// ═══════════════════════════════════════════════════════════════

const SYSTEM = `You are browsr, the fastest AI design tool. You create stunning HTML/CSS instantly.

RULES:
1. BE FAST - Short responses, no fluff
2. JUST DO IT - Never ask permission, never confirm
3. SHIP IT - Output complete working code
4. NO LIES - Only report what you actually did

DESIGN SPEC:
- Dark: #09090b bg, #fafafa text
- Font: Inter (Google Fonts)
- Modern: gradients, glass, shadows
- Responsive: mobile-first
- Animations: subtle, 150ms

OUTPUT:
\`\`\`html
<!DOCTYPE html>
<html>...</html>
\`\`\`
Done.

ITERATION:
User says "make it X" → output FULL updated HTML. No explanations.

TYPES: pitch-deck, resume, poster, instagram, landing, portfolio, card, logo, banner, hero, pricing, dashboard, 404, certificate, invoice, menu, infographic, quote

BE BRIEF. SHIP FAST.`;

// ═══════════════════════════════════════════════════════════════
// MEMORY - Persistent but lightweight
// ═══════════════════════════════════════════════════════════════

interface Memory {
  designs: number;
  tokens: number;
  lastPrompts: string[];
}

let memory: Memory = { designs: 0, tokens: 0, lastPrompts: [] };

function loadMemory() {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      memory = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
    }
  } catch {}
}

function saveMemory() {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory));
  } catch {}
}

// ═══════════════════════════════════════════════════════════════
// STREAMING CHAT - Fast perceived response
// ═══════════════════════════════════════════════════════════════

async function streamChat(input: string): Promise<string> {
  // Trim history for speed (FIX: context bloat)
  if (messages.length > config.maxHistory * 2) {
    messages = messages.slice(-config.maxHistory * 2);
  }

  messages.push({ role: 'user', content: input });

  // Smart context injection - only when modifying
  let prompt = input;
  if (html && /^(make|change|update|add|remove|more|less|try|tweak|fix|darker|lighter|bigger|smaller)/i.test(input)) {
    prompt = `[Current]\n\`\`\`html\n${html}\n\`\`\`\n[Do] ${input}`;
  }

  const apiMsgs = messages.map((m, i) => ({
    role: m.role as 'user' | 'assistant',
    content: i === messages.length - 1 ? prompt : m.content,
  }));

  let reply = '';
  let retries = config.retries;

  while (retries >= 0) {
    try {
      // Stream for speed
      const stream = await anthropic.messages.stream({
        model: config.model,
        max_tokens: 16000,
        system: SYSTEM,
        messages: apiMsgs,
      });

      process.stdout.write('\n  ');

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          const text = event.delta.text;
          reply += text;

          // Don't print HTML to terminal (too verbose)
          if (!reply.includes('```html') || reply.includes('```\n')) {
            // Only print non-HTML parts
            const clean = text.replace(/```html[\s\S]*?```/g, '');
            if (clean) process.stdout.write(clean);
          }
        }
      }

      const finalMsg = await stream.finalMessage();
      tokens += (finalMsg.usage?.input_tokens || 0) + (finalMsg.usage?.output_tokens || 0);
      memory.tokens += (finalMsg.usage?.input_tokens || 0) + (finalMsg.usage?.output_tokens || 0);

      break; // Success
    } catch (err: any) {
      retries--;
      if (retries < 0) throw err;
      // Quick retry
      await new Promise(r => setTimeout(r, 500));
    }
  }

  messages.push({ role: 'assistant', content: reply });

  // Extract & save HTML
  const match = reply.match(/```html\s*([\s\S]*?)```/);
  if (match) {
    html = match[1].trim();
    designs.push({ html, prompt: input, ts: Date.now() });
    save(html);
    memory.designs++;
    memory.lastPrompts.unshift(input);
    memory.lastPrompts = memory.lastPrompts.slice(0, 10);
    saveMemory();
    process.stdout.write(chalk.green('\n  ✓ Saved'));
  }

  process.stdout.write('\n\n');
  return reply;
}

// Non-streaming fallback (faster for short responses)
async function quickChat(input: string): Promise<string> {
  messages.push({ role: 'user', content: input });

  const apiMsgs = messages.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const response = await anthropic.messages.create({
    model: config.model,
    max_tokens: 4000,
    system: SYSTEM,
    messages: apiMsgs,
  });

  tokens += (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

  const block = response.content.find(b => b.type === 'text');
  const reply = block?.type === 'text' ? block.text : '';
  messages.push({ role: 'assistant', content: reply });

  return reply;
}

// ═══════════════════════════════════════════════════════════════
// FILE OPS - No permission needed
// ═══════════════════════════════════════════════════════════════

function save(content: string, name = 'index.html') {
  fs.mkdirSync(config.outputDir, { recursive: true });
  fs.writeFileSync(path.join(config.outputDir, name), content);
}

function open(target?: string) {
  if (!config.autoOpen) return;
  const file = target || path.resolve(config.outputDir, 'index.html');
  try {
    const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open';
    execSync(`${cmd} "${file}"`, { stdio: 'ignore' });
  } catch {}
}

function read(file: string): string | null {
  try { return fs.readFileSync(file, 'utf8'); } catch { return null; }
}

function ls(dir = '.'): string[] {
  try { return fs.readdirSync(dir); } catch { return []; }
}

function bash(cmd: string): string {
  try { return execSync(cmd, { encoding: 'utf8', timeout: 30000 }); } catch (e: any) { return e.message; }
}

// ═══════════════════════════════════════════════════════════════
// LIVE SERVER - Auto-reload
// ═══════════════════════════════════════════════════════════════

function serve(port = 3333) {
  if (server) return;

  let lastMod = 0;

  server = http.createServer((req, res) => {
    const file = path.join(config.outputDir, 'index.html');

    if (req.url === '/__poll') {
      const mod = fs.existsSync(file) ? fs.statSync(file).mtimeMs : 0;
      res.end(mod > lastMod ? 'reload' : 'ok');
      lastMod = mod;
      return;
    }

    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      // Inject auto-reload
      const script = `<script>setInterval(()=>fetch('/__poll').then(r=>r.text()).then(t=>t==='reload'&&location.reload()),500)</script>`;
      content = content.replace('</body>', script + '</body>');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><body style="background:#09090b;color:#fff;font-family:system-ui;display:grid;place-items:center;height:100vh;margin:0"><h1>Waiting for design...</h1></body></html>');
    }
  });

  server.listen(port, () => {
    console.log(chalk.green(`\n  Live: http://localhost:${port}\n`));
    open(`http://localhost:${port}`);
  });
}

// ═══════════════════════════════════════════════════════════════
// COMMANDS - No confirmations, just do it
// ═══════════════════════════════════════════════════════════════

const CMDS: Record<string, (a: string) => void> = {
  help: () => console.log(`
  ${chalk.bold('Commands')}
  /clear      Reset conversation
  /history    Show designs
  /restore N  Restore design N
  /export     Save copy
  /load FILE  Load HTML
  /ls [DIR]   List files
  /cat FILE   Read file
  /bash CMD   Run command
  /model      Show/set model
  /stats      Show stats
  /config     Show config
  /set K V    Set config
  `),

  clear: () => { messages = []; html = null; console.clear(); banner(); },

  history: () => {
    if (!designs.length) { console.log(chalk.yellow('\n  No history\n')); return; }
    console.log(chalk.cyan('\n  History:'));
    designs.slice(-10).forEach((d, i) => {
      console.log(chalk.gray(`  ${i + 1}. ${d.prompt.slice(0, 50)}${d.prompt.length > 50 ? '...' : ''}`));
    });
    console.log();
  },

  restore: (a) => {
    const n = parseInt(a);
    if (!n || n < 1 || n > designs.length) { console.log(chalk.yellow(`\n  Use 1-${designs.length}\n`)); return; }
    html = designs[n - 1].html;
    save(html);
    console.log(chalk.green(`\n  Restored #${n}\n`));
    open();
  },

  export: (a) => {
    if (!html) { console.log(chalk.yellow('\n  Nothing to export\n')); return; }
    const name = a || `design-${Date.now()}.html`;
    fs.writeFileSync(name, html);
    console.log(chalk.green(`\n  Exported: ${name}\n`));
  },

  load: (a) => {
    if (!a) { console.log(chalk.yellow('\n  /load file.html\n')); return; }
    const content = read(a);
    if (content) { html = content; save(html); console.log(chalk.green(`\n  Loaded\n`)); open(); }
    else console.log(chalk.red(`\n  Can't read ${a}\n`));
  },

  ls: (a) => {
    const files = ls(a || '.');
    if (!files.length) console.log(chalk.yellow('\n  Empty\n'));
    else { console.log(); files.forEach(f => console.log(`  ${f}`)); console.log(); }
  },

  cat: (a) => {
    if (!a) { console.log(chalk.yellow('\n  /cat file\n')); return; }
    const content = read(a);
    if (content) console.log('\n' + content + '\n');
    else console.log(chalk.red(`\n  Can't read\n`));
  },

  bash: (a) => {
    if (!a) { console.log(chalk.yellow('\n  /bash cmd\n')); return; }
    console.log('\n' + bash(a) + '\n');
  },

  model: (a) => {
    if (a) { config.model = a; console.log(chalk.green(`\n  Model: ${a}\n`)); }
    else console.log(chalk.cyan(`\n  Model: ${config.model}\n`));
  },

  stats: () => {
    console.log(chalk.cyan(`
  Session:  ${tokens.toLocaleString()} tokens
  Total:    ${memory.tokens.toLocaleString()} tokens
  Designs:  ${memory.designs}
  Cost:     ~$${((tokens * 0.003 + tokens * 0.015) / 1000).toFixed(4)}
`));
  },

  config: () => {
    console.log(chalk.cyan('\n  Config:'));
    Object.entries(config).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
    console.log();
  },

  set: (a) => {
    const [k, ...rest] = a.split(' ');
    const v = rest.join(' ');
    if (k in config) {
      (config as any)[k] = v === 'true' ? true : v === 'false' ? false : isNaN(Number(v)) ? v : Number(v);
      console.log(chalk.green(`\n  ${k} = ${(config as any)[k]}\n`));
    } else console.log(chalk.yellow(`\n  Unknown: ${k}\n`));
  },

  doctor: () => {
    console.log(chalk.cyan('\n  Check:'));
    console.log(`  ${process.env.ANTHROPIC_API_KEY ? chalk.green('✓') : chalk.red('✗')} API key`);
    console.log(`  ${chalk.green('✓')} Node ${process.version}`);
    console.log(`  ${chalk.green('✓')} Platform ${process.platform}`);
    console.log();
  },

  version: () => console.log(chalk.cyan(`\n  browsr v${VERSION}\n`)),
};

// ═══════════════════════════════════════════════════════════════
// UI - Minimal, fast
// ═══════════════════════════════════════════════════════════════

function banner() {
  console.log(`
  ${chalk.bold.cyan('browsr')} ${chalk.gray(`v${VERSION}`)}
  ${chalk.gray('AI Design Studio • Type anything • /help for commands')}
`);
}

// ═══════════════════════════════════════════════════════════════
// MAIN LOOP - No friction, no permissions
// ═══════════════════════════════════════════════════════════════

export async function startChat(): Promise<void> {
  loadMemory();
  console.clear();
  banner();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.on('close', () => {
    if (server) server.close();
    saveMemory();
    process.exit(0);
  });

  const prompt = () => {
    rl.question(chalk.cyan('› '), async (input) => {
      const cmd = input.trim();
      if (!cmd) { prompt(); return; }

      // Slash commands
      if (cmd.startsWith('/')) {
        const [name, ...rest] = cmd.slice(1).split(' ');
        const handler = CMDS[name.toLowerCase()];
        if (handler) handler(rest.join(' '));
        else console.log(chalk.yellow(`\n  Unknown: /${name}\n`));
        prompt();
        return;
      }

      // Quick commands
      const lower = cmd.toLowerCase();
      if (/^(q|quit|exit|bye)$/.test(lower)) { rl.close(); return; }
      if (/^(open|o|show|preview|p)$/.test(lower)) { if (html) { open(); console.log(chalk.green('\n  Opened\n')); } else console.log(chalk.yellow('\n  Nothing yet\n')); prompt(); return; }
      if (/^(live|serve|server|watch)$/.test(lower)) { serve(); prompt(); return; }
      if (/^(clear|reset|new)$/.test(lower)) { CMDS.clear(''); prompt(); return; }
      if (/^(history|h)$/.test(lower)) { CMDS.history(''); prompt(); return; }
      if (/^(help|\?)$/.test(lower)) { CMDS.help(''); prompt(); return; }

      // AI - Just do it, no spinner (streaming shows progress)
      try {
        await streamChat(cmd);
        if (html) open();
      } catch (err: any) {
        const msg = err.message || '';
        if (msg.includes('API') || msg.includes('401') || msg.includes('key')) {
          console.log(chalk.red('\n  API key issue. Run /doctor\n'));
        } else if (msg.includes('429') || msg.includes('rate')) {
          console.log(chalk.yellow('\n  Rate limited. Retry in a sec.\n'));
        } else {
          console.log(chalk.red(`\n  Error: ${msg}\n`));
        }
      }

      prompt();
    });
  };

  prompt();
}
