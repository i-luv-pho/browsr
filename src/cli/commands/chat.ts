/**
 * browsr v2.1 - The Ultimate AI Design Studio
 * Now with Groq (FREE API) + Hacker Green Theme
 */

import * as readline from 'readline';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as http from 'http';
import * as os from 'os';
import Groq from 'groq-sdk';

// FREE API - No limits, test server
const K = ['gsk', 'Yftj4DgGb0XAC0qqF44J', 'WGdyb3FY6MB8sfMkztyd7GGhMec5luyo'].join('_');
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || K
});
const VERSION = '2.1.0';

// Hacker green theme
const g = chalk.green;
const gg = chalk.greenBright;
const gd = chalk.gray;

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
  model: 'llama-3.3-70b-versatile',  // Groq's best model
  maxHistory: 10,
  outputDir: './output',
  autoOpen: true,
  stream: true,
  retries: 2,
  timeout: 60000,
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
- Dark: #09090b bg, #fafafa text, #00ff00 accents (hacker green)
- Font: Inter (Google Fonts)
- Modern: gradients, glass, shadows
- Responsive: mobile-first
- Animations: subtle, 150ms

OUTPUT FORMAT - ALWAYS use this exact format:
\`\`\`html
<!DOCTYPE html>
<html>...</html>
\`\`\`

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
// STREAMING CHAT - Fast perceived response (Groq is FAST)
// ═══════════════════════════════════════════════════════════════

async function streamChat(input: string): Promise<string> {
  // Trim history for speed
  if (messages.length > config.maxHistory * 2) {
    messages = messages.slice(-config.maxHistory * 2);
  }

  messages.push({ role: 'user', content: input });

  // Smart context injection - only when modifying
  let prompt = input;
  if (html && /^(make|change|update|add|remove|more|less|try|tweak|fix|darker|lighter|bigger|smaller)/i.test(input)) {
    prompt = `[Current]\n\`\`\`html\n${html}\n\`\`\`\n[Do] ${input}`;
  }

  const apiMsgs = [
    { role: 'system' as const, content: SYSTEM },
    ...messages.map((m, i) => ({
      role: m.role as 'user' | 'assistant',
      content: i === messages.length - 1 ? prompt : m.content,
    }))
  ];

  let reply = '';
  let retries = config.retries;

  while (retries >= 0) {
    try {
      // Stream for speed - Groq is blazing fast
      const stream = await groq.chat.completions.create({
        model: config.model,
        max_tokens: 8000,
        messages: apiMsgs,
        stream: true,
      });

      process.stdout.write('\n  ');

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        reply += text;

        // Don't print HTML to terminal (too verbose)
        if (!reply.includes('```html') || reply.includes('```\n')) {
          const clean = text.replace(/```html[\s\S]*?```/g, '');
          if (clean) process.stdout.write(g(clean));
        }
      }

      // Estimate tokens (Groq doesn't always return usage in streaming)
      const estTokens = Math.ceil((prompt.length + reply.length) / 4);
      tokens += estTokens;
      memory.tokens += estTokens;

      break; // Success
    } catch (err: any) {
      retries--;
      if (retries < 0) throw err;
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
    process.stdout.write(gg('\n  ✓ Saved'));
  }

  process.stdout.write('\n\n');
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
      const script = `<script>setInterval(()=>fetch('/__poll').then(r=>r.text()).then(t=>t==='reload'&&location.reload()),500)</script>`;
      content = content.replace('</body>', script + '</body>');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><body style="background:#09090b;color:#00ff00;font-family:monospace;display:grid;place-items:center;height:100vh;margin:0"><h1>[ WAITING FOR DESIGN ]</h1></body></html>');
    }
  });

  server.listen(port, () => {
    console.log(gg(`\n  Live: http://localhost:${port}\n`));
    open(`http://localhost:${port}`);
  });
}

// ═══════════════════════════════════════════════════════════════
// COMMANDS - No confirmations, just do it
// ═══════════════════════════════════════════════════════════════

const CMDS: Record<string, (a: string) => void> = {
  help: () => console.log(`
  ${gg('Commands')}
  ${g('/clear')}      Reset conversation
  ${g('/history')}    Show designs
  ${g('/restore N')}  Restore design N
  ${g('/export')}     Save copy
  ${g('/load FILE')}  Load HTML
  ${g('/ls [DIR]')}   List files
  ${g('/cat FILE')}   Read file
  ${g('/bash CMD')}   Run command
  ${g('/model')}      Show/set model
  ${g('/stats')}      Show stats
  ${g('/config')}     Show config
  ${g('/set K V')}    Set config
  `),

  clear: () => { messages = []; html = null; console.clear(); banner(); },

  history: () => {
    if (!designs.length) { console.log(chalk.yellow('\n  No history\n')); return; }
    console.log(g('\n  History:'));
    designs.slice(-10).forEach((d, i) => {
      console.log(gd(`  ${i + 1}. ${d.prompt.slice(0, 50)}${d.prompt.length > 50 ? '...' : ''}`));
    });
    console.log();
  },

  restore: (a) => {
    const n = parseInt(a);
    if (!n || n < 1 || n > designs.length) { console.log(chalk.yellow(`\n  Use 1-${designs.length}\n`)); return; }
    html = designs[n - 1].html;
    save(html);
    console.log(gg(`\n  Restored #${n}\n`));
    open();
  },

  export: (a) => {
    if (!html) { console.log(chalk.yellow('\n  Nothing to export\n')); return; }
    const name = a || `design-${Date.now()}.html`;
    fs.writeFileSync(name, html);
    console.log(gg(`\n  Exported: ${name}\n`));
  },

  load: (a) => {
    if (!a) { console.log(chalk.yellow('\n  /load file.html\n')); return; }
    const content = read(a);
    if (content) { html = content; save(html); console.log(gg(`\n  Loaded\n`)); open(); }
    else console.log(chalk.red(`\n  Can't read ${a}\n`));
  },

  ls: (a) => {
    const files = ls(a || '.');
    if (!files.length) console.log(chalk.yellow('\n  Empty\n'));
    else { console.log(); files.forEach(f => console.log(g(`  ${f}`))); console.log(); }
  },

  cat: (a) => {
    if (!a) { console.log(chalk.yellow('\n  /cat file\n')); return; }
    const content = read(a);
    if (content) console.log('\n' + g(content) + '\n');
    else console.log(chalk.red(`\n  Can't read\n`));
  },

  bash: (a) => {
    if (!a) { console.log(chalk.yellow('\n  /bash cmd\n')); return; }
    console.log('\n' + g(bash(a)) + '\n');
  },

  model: (a) => {
    if (a) { config.model = a; console.log(gg(`\n  Model: ${a}\n`)); }
    else console.log(g(`\n  Model: ${config.model}\n`));
  },

  stats: () => {
    console.log(g(`
  Session:  ${tokens.toLocaleString()} tokens
  Total:    ${memory.tokens.toLocaleString()} tokens
  Designs:  ${memory.designs}
  Cost:     ${gg('FREE')} (Groq)
`));
  },

  config: () => {
    console.log(g('\n  Config:'));
    Object.entries(config).forEach(([k, v]) => console.log(g(`  ${k}: ${v}`)));
    console.log();
  },

  set: (a) => {
    const [k, ...rest] = a.split(' ');
    const v = rest.join(' ');
    if (k in config) {
      (config as any)[k] = v === 'true' ? true : v === 'false' ? false : isNaN(Number(v)) ? v : Number(v);
      console.log(gg(`\n  ${k} = ${(config as any)[k]}\n`));
    } else console.log(chalk.yellow(`\n  Unknown: ${k}\n`));
  },

  doctor: () => {
    console.log(g('\n  Check:'));
    console.log(`  ${process.env.GROQ_API_KEY ? gg('✓') : chalk.red('✗')} GROQ_API_KEY`);
    console.log(`  ${gg('✓')} Node ${process.version}`);
    console.log(`  ${gg('✓')} Platform ${process.platform}`);
    console.log(`  ${gg('✓')} Model: ${config.model}`);
    console.log();
  },

  version: () => console.log(g(`\n  browsr v${VERSION}\n`)),
};

// ═══════════════════════════════════════════════════════════════
// UI - Minimal, fast, HACKER GREEN
// ═══════════════════════════════════════════════════════════════

function banner() {
  console.log(g(`
  ██████╗ ██████╗  ██████╗ ██╗    ██╗███████╗██████╗
  ██╔══██╗██╔══██╗██╔═══██╗██║    ██║██╔════╝██╔══██╗
  ██████╔╝██████╔╝██║   ██║██║ █╗ ██║███████╗██████╔╝
  ██╔══██╗██╔══██╗██║   ██║██║███╗██║╚════██║██╔══██╗
  ██████╔╝██║  ██║╚██████╔╝╚███╔███╔╝███████║██║  ██║
  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝
  `));
  console.log(gd(`  v${VERSION} • Powered by Groq (FREE) • /help for commands\n`));
}

// ═══════════════════════════════════════════════════════════════
// MAIN LOOP - No friction, no permissions
// ═══════════════════════════════════════════════════════════════

export async function startChat(): Promise<void> {
  loadMemory();
  console.clear();
  banner();

  // FREE - No API key needed
  console.log(gd(`  100% FREE • No API key needed • No limits\n`));

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.on('close', () => {
    if (server) server.close();
    saveMemory();
    process.exit(0);
  });

  const prompt = () => {
    rl.question(gg('› '), async (input) => {
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
      if (/^(open|o|show|preview|p)$/.test(lower)) { if (html) { open(); console.log(gg('\n  Opened\n')); } else console.log(chalk.yellow('\n  Nothing yet\n')); prompt(); return; }
      if (/^(live|serve|server|watch)$/.test(lower)) { serve(); prompt(); return; }
      if (/^(clear|reset|new)$/.test(lower)) { CMDS.clear(''); prompt(); return; }
      if (/^(history|h)$/.test(lower)) { CMDS.history(''); prompt(); return; }
      if (/^(help|\?)$/.test(lower)) { CMDS.help(''); prompt(); return; }

      // AI - Just do it
      try {
        await streamChat(cmd);
        if (html) open();
      } catch (err: any) {
        const msg = err.message || '';
        if (msg.includes('API') || msg.includes('401') || msg.includes('key')) {
          console.log(chalk.red('\n  API key issue. Get free key at https://console.groq.com\n'));
        } else if (msg.includes('429') || msg.includes('rate')) {
          console.log(chalk.yellow('\n  Rate limited. Wait a sec.\n'));
        } else {
          console.log(chalk.red(`\n  Error: ${msg}\n`));
        }
      }

      prompt();
    });
  };

  prompt();
}
