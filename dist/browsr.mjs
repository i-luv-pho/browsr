#!/usr/bin/env node
// src/cli/index.ts
import { Command } from "commander";
import chalk6 from "chalk";

// src/cli/commands/create.ts
import { writeFileSync, mkdirSync, existsSync as existsSync2 } from "fs";
import { join as join3 } from "path";
import chalk2 from "chalk";
import ora from "ora";

// src/archetypes/index.ts
var archetypes = [
  // ═══════════════════════════════════════════════════════════════
  // PRESENTATIONS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "pitch-deck",
    name: "Pitch Deck",
    description: "Startup pitch deck for investors",
    structure: "presentation",
    defaultStyle: "professional",
    keywords: ["pitch", "deck", "investor", "startup", "funding", "raise", "vc", "series"],
    promptPath: "archetypes/pitch-deck.md"
  },
  {
    id: "portfolio",
    name: "Portfolio Presentation",
    description: "Showcase of work and projects",
    structure: "presentation",
    defaultStyle: "elegant",
    keywords: ["portfolio", "work", "projects", "showcase", "creative"],
    promptPath: "archetypes/portfolio.md"
  },
  {
    id: "presentation",
    name: "General Presentation",
    description: "Generic slide presentation",
    structure: "presentation",
    defaultStyle: "professional",
    keywords: ["presentation", "slides", "slideshow", "ppt", "powerpoint"],
    promptPath: "archetypes/presentation.md"
  },
  // ═══════════════════════════════════════════════════════════════
  // SINGLE-PAGE DESIGNS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "resume",
    name: "Resume / CV",
    description: "Professional resume or curriculum vitae",
    structure: "single-page",
    defaultStyle: "minimal",
    dimensions: { width: 816, height: 1056 },
    // Letter size at 96dpi
    keywords: ["resume", "cv", "curriculum vitae", "job", "career", "work history"],
    promptPath: "archetypes/resume.md"
  },
  {
    id: "poster",
    name: "Event Poster",
    description: "Promotional poster for events",
    structure: "single-page",
    defaultStyle: "bold",
    dimensions: { width: 1296, height: 1728 },
    // 18x24 at 72dpi
    keywords: ["poster", "event", "concert", "festival", "party", "show", "announcement"],
    promptPath: "archetypes/poster.md"
  },
  {
    id: "instagram",
    name: "Instagram Post",
    description: "Square post for Instagram feed",
    structure: "single-page",
    defaultStyle: "modern",
    dimensions: { width: 1080, height: 1080 },
    keywords: ["instagram", "ig", "insta", "post", "social", "square"],
    promptPath: "archetypes/instagram-post.md"
  },
  {
    id: "youtube-thumb",
    name: "YouTube Thumbnail",
    description: "Clickable video thumbnail",
    structure: "single-page",
    defaultStyle: "bold",
    dimensions: { width: 1280, height: 720 },
    keywords: ["youtube", "thumbnail", "thumb", "video", "yt"],
    promptPath: "archetypes/youtube-thumbnail.md"
  },
  {
    id: "infographic",
    name: "Infographic",
    description: "Data visualization and information graphic",
    structure: "single-page",
    defaultStyle: "modern",
    keywords: ["infographic", "data", "visualization", "stats", "statistics", "chart"],
    promptPath: "archetypes/infographic.md"
  },
  {
    id: "flyer",
    name: "Flyer",
    description: "Promotional flyer or handout",
    structure: "single-page",
    defaultStyle: "bold",
    dimensions: { width: 816, height: 1056 },
    keywords: ["flyer", "handout", "promo", "promotional", "leaflet"],
    promptPath: "archetypes/flyer.md"
  },
  {
    id: "research-poster",
    name: "Research Poster",
    description: "Academic research presentation poster",
    structure: "single-page",
    defaultStyle: "professional",
    dimensions: { width: 2592, height: 3456 },
    // 36x48 at 72dpi
    keywords: ["research", "academic", "science", "study", "thesis", "conference"],
    promptPath: "archetypes/research-poster.md"
  },
  {
    id: "quote",
    name: "Quote Graphic",
    description: "Shareable quote image",
    structure: "single-page",
    defaultStyle: "elegant",
    dimensions: { width: 1080, height: 1080 },
    keywords: ["quote", "saying", "inspiration", "motivational", "words"],
    promptPath: "archetypes/quote.md"
  },
  // ═══════════════════════════════════════════════════════════════
  // CARDS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "business-card",
    name: "Business Card",
    description: "Professional contact card",
    structure: "card",
    defaultStyle: "minimal",
    dimensions: { width: 350, height: 200 },
    // Standard 3.5x2 at 100dpi
    keywords: ["business card", "contact", "networking", "card"],
    promptPath: "archetypes/business-card.md"
  },
  {
    id: "flashcards",
    name: "Flashcards",
    description: "Study flashcards for learning",
    structure: "card",
    defaultStyle: "minimal",
    dimensions: { width: 500, height: 300 },
    keywords: ["flashcard", "study", "learning", "quiz", "memory"],
    promptPath: "archetypes/flashcards.md"
  },
  {
    id: "certificate",
    name: "Certificate",
    description: "Achievement or completion certificate",
    structure: "card",
    defaultStyle: "elegant",
    dimensions: { width: 1056, height: 816 },
    // Landscape letter
    keywords: ["certificate", "award", "achievement", "diploma", "completion"],
    promptPath: "archetypes/certificate.md"
  },
  // ═══════════════════════════════════════════════════════════════
  // IDENTITY
  // ═══════════════════════════════════════════════════════════════
  {
    id: "logo",
    name: "Logo",
    description: "Brand logo design",
    structure: "identity",
    defaultStyle: "minimal",
    dimensions: { width: 500, height: 500 },
    keywords: ["logo", "brand", "identity", "mark", "icon"],
    promptPath: "archetypes/logo.md"
  },
  // ═══════════════════════════════════════════════════════════════
  // MULTI-PAGE
  // ═══════════════════════════════════════════════════════════════
  {
    id: "study-guide",
    name: "Study Guide",
    description: "Educational study material",
    structure: "multi-page",
    defaultStyle: "minimal",
    keywords: ["study", "guide", "notes", "education", "learning", "course"],
    promptPath: "archetypes/study-guide.md"
  }
];
function detectArchetype(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  const scores = archetypes.map((archetype) => {
    let score = 0;
    for (const keyword of archetype.keywords) {
      if (lowerPrompt.includes(keyword)) {
        score += keyword.length;
      }
    }
    return { archetype, score };
  });
  scores.sort((a, b) => b.score - a.score);
  if (scores[0].score > 0) {
    return scores[0].archetype;
  }
  return archetypes.find((a) => a.id === "presentation");
}
function getArchetype(id) {
  return archetypes.find((a) => a.id === id);
}

// src/engine/generator.ts
import Anthropic from "@anthropic-ai/sdk";

// src/engine/prompt-builder.ts
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var PROMPTS_DIR = join(__dirname, "../../prompts");
function readPromptFile(path2) {
  try {
    return readFileSync(join(PROMPTS_DIR, path2), "utf-8");
  } catch {
    console.warn(`Warning: Could not read prompt file: ${path2}`);
    return "";
  }
}
var STYLE_INSTRUCTIONS = {
  minimal: `
## Style: Minimal

Apply a minimal aesthetic:
- Maximum whitespace - let the content breathe
- Limited color palette (1-2 colors max)
- Thin, light typography weights
- Subtle borders and shadows (or none)
- Clean lines and geometric shapes
- Restrained, understated elegance
- Sans-serif fonts only
- Focus on typography as the main design element
`,
  bold: `
## Style: Bold

Apply a bold, impactful aesthetic:
- Strong, saturated colors
- High contrast between elements
- Heavy font weights for headlines
- Large, attention-grabbing text
- Solid shapes and fills
- Dynamic, energetic layouts
- Sans-serif or display fonts
- Make it impossible to ignore
`,
  elegant: `
## Style: Elegant

Apply an elegant, sophisticated aesthetic:
- Refined color palette (muted, sophisticated tones)
- Serif fonts for headings, maybe sans for body
- Generous spacing and margins
- Subtle decorative elements (lines, ornaments)
- Classical proportions and balance
- Premium, luxury feel
- Refined typography with careful kerning
- Understated sophistication
`,
  modern: `
## Style: Modern

Apply a contemporary, trendy aesthetic:
- Gradient backgrounds and accents
- Glassmorphism or frosted glass effects
- Rounded corners on everything
- Vibrant, saturated colors
- Modern sans-serif fonts (Inter, SF Pro)
- Subtle shadows and depth
- Clean lines with soft edges
- Tech-forward, current design trends
`,
  professional: `
## Style: Professional

Apply a corporate, business-appropriate aesthetic:
- Conservative color palette (blues, grays)
- Clean, readable typography
- Structured, grid-based layouts
- Consistent spacing and alignment
- Subtle, understated design elements
- Trustworthy and credible appearance
- Sans-serif fonts (Inter, Helvetica)
- Appropriate for business contexts
`
};
function buildPrompt(archetype, userInput, style) {
  const selectedStyle = style || archetype.defaultStyle;
  const masterPrompt = readPromptFile("master.md");
  const archetypePrompt = readPromptFile(archetype.promptPath);
  const styleInstructions = STYLE_INSTRUCTIONS[selectedStyle] || STYLE_INSTRUCTIONS.professional;
  let dimensionInstructions = "";
  if (archetype.dimensions) {
    dimensionInstructions = `
## Dimensions

Create this design at exactly:
- Width: ${archetype.dimensions.width}px
- Height: ${archetype.dimensions.height}px

The output should be sized appropriately for this format.
`;
  }
  const fullPrompt = `${masterPrompt}

---

# Specific Design: ${archetype.name}

${archetypePrompt}

${styleInstructions}

${dimensionInstructions}

---

## User's Request

The user wants to create: ${archetype.name}

Their specific request:
"${userInput}"

---

## Your Task

Generate a complete, production-ready HTML file for this ${archetype.name}.

Requirements:
1. Follow all guidelines from the master prompt
2. Apply the ${archetype.name} structure and conventions
3. Use the ${selectedStyle} style variant
4. Create real, relevant content based on the user's request
5. Make it look like a $10,000 design

Remember: Output ONLY the HTML code, starting with <!DOCTYPE html> and ending with </html>. No explanations or markdown code blocks.
`;
  return fullPrompt;
}

// src/engine/generator.ts
var anthropic = new Anthropic();
function extractHTML(content) {
  if (content.trim().startsWith("<!DOCTYPE") || content.trim().startsWith("<html")) {
    return content.trim();
  }
  const codeBlockMatch = content.match(/```(?:html)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  const htmlMatch = content.match(/(<!DOCTYPE[\s\S]*<\/html>)/i);
  if (htmlMatch) {
    return htmlMatch[1].trim();
  }
  return content.trim();
}
function validateHTML(html) {
  const errors = [];
  if (!html.includes("<!DOCTYPE")) {
    errors.push("Missing DOCTYPE declaration");
  }
  if (!html.includes("<html")) {
    errors.push("Missing <html> tag");
  }
  if (!html.includes("<head>") && !html.includes("<head ")) {
    errors.push("Missing <head> section");
  }
  if (!html.includes("<body>") && !html.includes("<body ")) {
    errors.push("Missing <body> section");
  }
  if (!html.includes("</html>")) {
    errors.push("Missing closing </html> tag");
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
async function generate(archetype, userInput, style) {
  const startTime = Date.now();
  const selectedStyle = style || archetype.defaultStyle;
  const prompt = buildPrompt(archetype, userInput, selectedStyle);
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16e3,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });
  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }
  const html = extractHTML(textBlock.text);
  const validation = validateHTML(html);
  if (!validation.valid) {
    console.warn("HTML validation warnings:", validation.errors);
  }
  const generationTime = Date.now() - startTime;
  return {
    html,
    archetype,
    style: selectedStyle,
    prompt: userInput,
    generationTime
  };
}

// src/cli/commands/preview.ts
import { createServer } from "http";
import { join as join2, extname } from "path";
import { existsSync, readFileSync as readFileSync2, statSync } from "fs";
import { exec } from "child_process";
import chalk from "chalk";
var MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};
async function preview(path2, options) {
  const port = parseInt(options.port, 10) || 3e3;
  const outputDir = path2 || "./output";
  if (!existsSync(outputDir)) {
    console.error(chalk.red(`Directory not found: ${outputDir}`));
    console.log(chalk.gray('Run "build create <prompt>" first to generate a design.'));
    process.exit(1);
  }
  const indexPath = join2(outputDir, "index.html");
  if (!existsSync(indexPath)) {
    console.error(chalk.red(`No index.html found in ${outputDir}`));
    process.exit(1);
  }
  console.log(chalk.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
  console.log(chalk.white.bold("  DesignCraft Preview Server"));
  console.log(chalk.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
  console.log();
  console.log(chalk.gray("  Serving:  ") + chalk.white(outputDir));
  console.log(chalk.gray("  Local:    ") + chalk.cyan(`http://localhost:${port}`));
  console.log();
  console.log(chalk.gray("  Press Ctrl+C to stop"));
  console.log();
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
  const server2 = createServer((req, res) => {
    let filePath = req.url || "/";
    if (filePath === "/") {
      filePath = "/index.html";
    }
    if (filePath === "/__check") {
      try {
        const stat = statSync(indexPath);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(stat.mtimeMs.toString());
      } catch {
        res.writeHead(500);
        res.end("Error");
      }
      return;
    }
    const fullPath = join2(outputDir, filePath);
    if (!existsSync(fullPath)) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    try {
      const ext = extname(fullPath);
      const mimeType = MIME_TYPES[ext] || "application/octet-stream";
      let content = readFileSync2(fullPath);
      if (ext === ".html") {
        let htmlContent = content.toString("utf-8");
        htmlContent = htmlContent.replace("</body>", liveReloadScript + "</body>");
        content = Buffer.from(htmlContent);
      }
      res.writeHead(200, { "Content-Type": mimeType });
      res.end(content);
    } catch (error) {
      res.writeHead(500);
      res.end("Server Error");
    }
  });
  server2.listen(port, () => {
    try {
      exec(`open http://localhost:${port}`);
    } catch {
    }
  });
  await new Promise(() => {
  });
}

// src/cli/commands/create.ts
async function create(prompt, options) {
  const spinner = ora();
  try {
    spinner.start(chalk2.gray("Analyzing your request..."));
    let archetype;
    if (options.type) {
      archetype = getArchetype(options.type);
      if (!archetype) {
        spinner.fail(chalk2.red(`Unknown design type: ${options.type}`));
        console.log(chalk2.gray('Run "browsrtypes" to see available types'));
        return;
      }
    } else {
      archetype = detectArchetype(prompt);
    }
    spinner.succeed(chalk2.green(`Detected: ${archetype.name}`));
    spinner.start(chalk2.gray(`Generating ${archetype.name}...`));
    const design = await generate(archetype, prompt, options.style);
    spinner.succeed(chalk2.green(`Generated in ${(design.generationTime / 1e3).toFixed(1)}s`));
    spinner.start(chalk2.gray("Writing files..."));
    const outputDir = options.output;
    if (!existsSync2(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    const htmlPath = join3(outputDir, "index.html");
    writeFileSync(htmlPath, design.html, "utf-8");
    const metadataPath = join3(outputDir, "design.json");
    writeFileSync(
      metadataPath,
      JSON.stringify(
        {
          archetype: design.archetype.id,
          style: design.style,
          prompt: design.prompt,
          generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          generationTime: design.generationTime
        },
        null,
        2
      ),
      "utf-8"
    );
    spinner.succeed(chalk2.green(`Files written to ${outputDir}/`));
    console.log();
    console.log(chalk2.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
    console.log(chalk2.white.bold("  Design Generated Successfully!"));
    console.log(chalk2.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
    console.log();
    console.log(chalk2.gray("  Type:     ") + chalk2.white(archetype.name));
    console.log(chalk2.gray("  Style:    ") + chalk2.white(design.style));
    console.log(chalk2.gray("  Time:     ") + chalk2.white(`${(design.generationTime / 1e3).toFixed(1)}s`));
    console.log(chalk2.gray("  Output:   ") + chalk2.white(htmlPath));
    console.log();
    console.log(chalk2.gray("  Next steps:"));
    console.log(chalk2.gray("    \u2022 ") + chalk2.white(`open ${htmlPath}`) + chalk2.gray(" - View in browser"));
    console.log(chalk2.gray("    \u2022 ") + chalk2.white("browsrpreview") + chalk2.gray(" - Start dev server"));
    console.log(chalk2.gray("    \u2022 ") + chalk2.white("browsrdeploy") + chalk2.gray(" - Deploy to web"));
    console.log(chalk2.gray("    \u2022 ") + chalk2.white("browsrexport --format pdf") + chalk2.gray(" - Export to PDF"));
    console.log();
    if (options.preview) {
      console.log(chalk2.yellow("Starting preview server..."));
      console.log();
      await preview(outputDir, { port: "3000" });
    }
  } catch (error) {
    spinner.fail(chalk2.red("Generation failed"));
    if (error instanceof Error) {
      console.error(chalk2.red("\nError: ") + error.message);
      if (error.message.includes("API")) {
        console.log(chalk2.gray("\nMake sure ANTHROPIC_API_KEY is set in your environment."));
      }
    }
    process.exit(1);
  }
}

// src/cli/commands/deploy.ts
import { existsSync as existsSync3 } from "fs";
import { execSync } from "child_process";
import chalk3 from "chalk";
import ora2 from "ora";
function generateProjectName() {
  const adjectives = [
    "swift",
    "bright",
    "cosmic",
    "stellar",
    "rapid",
    "sleek",
    "bold",
    "vivid",
    "crisp",
    "clean",
    "sharp",
    "pure",
    "prime",
    "elite",
    "ultra",
    "nova"
  ];
  const nouns = [
    "design",
    "craft",
    "studio",
    "forge",
    "works",
    "labs",
    "hub",
    "deck",
    "page",
    "site",
    "view",
    "space",
    "zone",
    "base",
    "core",
    "edge"
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1e3);
  return `${adj}-${noun}-${num}`;
}
async function deploy(path2, options) {
  const spinner = ora2();
  const outputDir = path2 || "./output";
  const projectName = options.name || generateProjectName();
  if (!existsSync3(outputDir)) {
    console.error(chalk3.red(`Directory not found: ${outputDir}`));
    console.log(chalk3.gray('Run "build create <prompt>" first to generate a design.'));
    process.exit(1);
  }
  try {
    execSync("which wrangler", { stdio: "ignore" });
  } catch {
    console.error(chalk3.red("Wrangler CLI not found."));
    console.log(chalk3.gray("Install it with: npm install -g wrangler"));
    console.log(chalk3.gray("Then authenticate with: wrangler login"));
    process.exit(1);
  }
  console.log(chalk3.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
  console.log(chalk3.white.bold("  Deploying to Cloudflare Pages"));
  console.log(chalk3.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
  console.log();
  console.log(chalk3.gray("  Project:  ") + chalk3.white(projectName));
  console.log(chalk3.gray("  Source:   ") + chalk3.white(outputDir));
  console.log();
  try {
    spinner.start(chalk3.gray("Uploading to Cloudflare..."));
    const result = execSync(
      `wrangler pages deploy ${outputDir} --project-name=${projectName}`,
      { encoding: "utf-8" }
    );
    spinner.succeed(chalk3.green("Deployed successfully!"));
    const urlMatch = result.match(/https:\/\/[^\s]+\.pages\.dev/);
    const deployUrl = urlMatch ? urlMatch[0] : `https://${projectName}.pages.dev`;
    console.log();
    console.log(chalk3.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
    console.log(chalk3.white.bold("  Deployment Complete!"));
    console.log(chalk3.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
    console.log();
    console.log(chalk3.gray("  Live URL: ") + chalk3.cyan(deployUrl));
    console.log();
    console.log(chalk3.gray("  Your design is now live on the web!"));
    console.log(chalk3.gray("  Share this URL with anyone."));
    console.log();
    try {
      execSync(`open ${deployUrl}`, { stdio: "ignore" });
    } catch {
    }
  } catch (error) {
    spinner.fail(chalk3.red("Deployment failed"));
    if (error instanceof Error) {
      console.error(chalk3.red("\nError: ") + error.message);
    }
    console.log(chalk3.gray("\nTroubleshooting:"));
    console.log(chalk3.gray("  1. Make sure you're logged in: wrangler login"));
    console.log(chalk3.gray("  2. Check your Cloudflare account has Pages enabled"));
    console.log(chalk3.gray("  3. Try a different project name with: build deploy -n my-project"));
    process.exit(1);
  }
}

// src/cli/commands/export.ts
import { existsSync as existsSync4 } from "fs";
import { join as join4, resolve } from "path";
import chalk4 from "chalk";
import ora3 from "ora";
async function exportDesign(path2, options) {
  const spinner = ora3();
  const outputDir = path2 || "./output";
  const format2 = options.format || "pdf";
  if (!existsSync4(outputDir)) {
    console.error(chalk4.red(`Directory not found: ${outputDir}`));
    console.log(chalk4.gray('Run "build create <prompt>" first to generate a design.'));
    process.exit(1);
  }
  const indexPath = join4(outputDir, "index.html");
  if (!existsSync4(indexPath)) {
    console.error(chalk4.red(`No index.html found in ${outputDir}`));
    process.exit(1);
  }
  console.log(chalk4.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
  console.log(chalk4.white.bold(`  Exporting to ${format2.toUpperCase()}`));
  console.log(chalk4.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
  console.log();
  try {
    let puppeteer;
    try {
      puppeteer = await import("puppeteer");
    } catch {
      console.error(chalk4.red("Puppeteer not installed."));
      console.log(chalk4.gray("Install it with: bun add puppeteer"));
      console.log();
      console.log(chalk4.yellow("Alternative: Open the HTML file in Chrome and use Print > Save as PDF"));
      process.exit(1);
    }
    spinner.start(chalk4.gray(`Rendering ${format2.toUpperCase()}...`));
    const browser = await puppeteer.default.launch({
      headless: true
    });
    const page = await browser.newPage();
    const fileUrl = `file://${resolve(indexPath)}`;
    await page.goto(fileUrl, { waitUntil: "networkidle0" });
    await new Promise((resolve3) => setTimeout(resolve3, 1e3));
    const outputPath = options.output || join4(outputDir, `design.${format2}`);
    if (format2 === "pdf") {
      await page.pdf({
        path: outputPath,
        format: "Letter",
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      });
    } else {
      await page.screenshot({
        path: outputPath,
        fullPage: true,
        type: "png"
      });
    }
    await browser.close();
    spinner.succeed(chalk4.green("Export complete!"));
    console.log();
    console.log(chalk4.gray("  Output: ") + chalk4.white(outputPath));
    console.log();
    try {
      const { execSync: execSync3 } = await import("child_process");
      execSync3(`open "${outputPath}"`, { stdio: "ignore" });
    } catch {
    }
  } catch (error) {
    spinner.fail(chalk4.red("Export failed"));
    if (error instanceof Error) {
      console.error(chalk4.red("\nError: ") + error.message);
    }
    process.exit(1);
  }
}

// src/cli/commands/chat.ts
import * as readline from "readline";
import chalk5 from "chalk";
import ora4 from "ora";
import * as fs from "fs";
import * as path from "path";
import { execSync as execSync2 } from "child_process";
import * as http from "http";
import * as os from "os";
import Anthropic2 from "@anthropic-ai/sdk";
var anthropic2 = new Anthropic2();
var VERSION = "1.0.0";
var messages = [];
var designs = [];
var currentHTML = null;
var config = {
  autoOpen: true,
  darkMode: true,
  outputDir: "./output",
  model: "claude-sonnet-4-20250514"
};
var memory = {
  recentDesigns: [],
  preferences: {},
  stats: { designs: 0, sessions: 0, tokens: 0 }
};
var server = null;
var totalTokens = 0;
var MEMORY_FILE = path.join(os.homedir(), ".browsr_memory.json");
var CONFIG_FILE = path.join(os.homedir(), ".browsr_config.json");
var SYSTEM = `You are browsr, a world-class AI assistant for visual design. You're like Claude Code but specialized in creating stunning HTML/CSS.

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
\u2713 Stripe, Linear, Vercel, Raycast, Figma
\u2717 NOT Bootstrap, WordPress themes, Squarespace

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
"make it X" / "change Y" \u2192 output FULL modified HTML

## STYLE
- Brief, confident responses
- No "I'd be happy to" or "Certainly!"
- Just do the thing
- Suggest improvements proactively

Remember: You're in a terminal. Designs auto-open in browser.`;
function loadMemory() {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      memory = JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
    }
  } catch {
  }
}
function saveMemory() {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
  } catch {
  }
}
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      config = { ...config, ...JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")) };
    }
  } catch {
  }
}
function saveConfig() {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch {
  }
}
async function chat(input) {
  messages.push({ role: "user", content: input });
  let prompt = input;
  if (currentHTML && /^(make|change|update|modify|add|remove|try|more|less|bigger|smaller|darker|lighter|different|like |could|can|tweak|adjust|fix|improve)/i.test(input)) {
    prompt = `[Current Design]
\`\`\`html
${currentHTML}
\`\`\`

[Request] ${input}`;
  }
  const apiMessages = messages.map((m, i) => ({
    role: m.role,
    content: i === messages.length - 1 ? prompt : m.content
  }));
  const response = await anthropic2.messages.create({
    model: config.model,
    max_tokens: 32e3,
    system: SYSTEM,
    messages: apiMessages
  });
  totalTokens += (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);
  memory.stats.tokens += (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);
  const block = response.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") throw new Error("Empty response");
  const reply = block.text;
  messages.push({ role: "assistant", content: reply });
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
function save(html, filename = "index.html") {
  fs.mkdirSync(config.outputDir, { recursive: true });
  fs.writeFileSync(path.join(config.outputDir, filename), html);
}
function open(target) {
  if (!config.autoOpen) return;
  const file = target || path.resolve(config.outputDir, "index.html");
  try {
    const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? 'start ""' : "xdg-open";
    execSync2(`${cmd} "${file}"`, { stdio: "ignore" });
  } catch {
  }
}
function readFile(filepath) {
  try {
    return fs.readFileSync(filepath, "utf8");
  } catch {
    return null;
  }
}
function writeFile(filepath, content) {
  try {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, content);
    return true;
  } catch {
    return false;
  }
}
function listFiles(dir) {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}
function startServer(port = 3333) {
  if (server) return;
  server = http.createServer((req, res) => {
    const file = path.join(config.outputDir, "index.html");
    if (fs.existsSync(file)) {
      let html = fs.readFileSync(file, "utf8");
      const reloadScript = `<script>setInterval(()=>fetch('/check').then(r=>r.text()).then(t=>t!==document.body.innerHTML.length.toString()&&location.reload()),1000)</script>`;
      html = html.replace("</body>", `${reloadScript}</body>`);
      res.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-cache" });
      res.end(html);
    } else if (req.url === "/check") {
      const file2 = path.join(config.outputDir, "index.html");
      const size = fs.existsSync(file2) ? fs.statSync(file2).size.toString() : "0";
      res.end(size);
    } else {
      res.writeHead(404);
      res.end("No design yet");
    }
  });
  server.listen(port, () => {
    console.log(chalk5.green(`
  Live preview: http://localhost:${port}
`));
    open(`http://localhost:${port}`);
  });
}
function runBash(cmd) {
  try {
    const stdout = execSync2(cmd, { encoding: "utf8", timeout: 3e4 });
    return { stdout, stderr: "", code: 0 };
  } catch (err) {
    return { stdout: err.stdout || "", stderr: err.stderr || err.message, code: err.status || 1 };
  }
}
var COMMANDS = {
  help: {
    desc: "Show all commands",
    fn: () => {
      console.log(chalk5.cyan("\n  Slash Commands:\n"));
      Object.entries(COMMANDS).forEach(([name, { desc }]) => {
        console.log(`  ${chalk5.cyan("/" + name.padEnd(12))} ${chalk5.gray(desc)}`);
      });
      console.log(chalk5.cyan("\n  Quick Commands:\n"));
      console.log(`  ${chalk5.cyan("open".padEnd(12))} ${chalk5.gray("Open design in browser")}`);
      console.log(`  ${chalk5.cyan("live".padEnd(12))} ${chalk5.gray("Start live preview server")}`);
      console.log(`  ${chalk5.cyan("history".padEnd(12))} ${chalk5.gray("Show design history")}`);
      console.log(`  ${chalk5.cyan("clear".padEnd(12))} ${chalk5.gray("Clear conversation")}`);
      console.log(`  ${chalk5.cyan("exit".padEnd(12))} ${chalk5.gray("Quit browsr")}`);
      console.log();
    }
  },
  clear: {
    desc: "Clear conversation and start fresh",
    fn: () => {
      messages = [];
      currentHTML = null;
      console.clear();
      showBanner();
      console.log(chalk5.green("  Fresh start.\n"));
    }
  },
  compact: {
    desc: "Compact conversation history",
    fn: () => {
      const keep = messages.slice(-6);
      messages = keep;
      console.log(chalk5.green(`
  Compacted to ${keep.length} messages.
`));
    }
  },
  config: {
    desc: "View or set config (e.g., /config autoOpen false)",
    fn: (args) => {
      if (!args) {
        console.log(chalk5.cyan("\n  Config:\n"));
        Object.entries(config).forEach(([k, v]) => {
          console.log(`  ${chalk5.cyan(k.padEnd(12))} ${chalk5.white(String(v))}`);
        });
        console.log();
      } else {
        const [key, ...rest] = args.split(" ");
        const value = rest.join(" ");
        if (key in config) {
          config[key] = value === "true" ? true : value === "false" ? false : value;
          saveConfig();
          console.log(chalk5.green(`
  Set ${key} = ${value}
`));
        } else {
          console.log(chalk5.yellow(`
  Unknown config: ${key}
`));
        }
      }
    }
  },
  memory: {
    desc: "Show memory and stats",
    fn: () => {
      console.log(chalk5.cyan("\n  Memory:\n"));
      console.log(`  ${chalk5.gray("Designs created:")} ${memory.stats.designs}`);
      console.log(`  ${chalk5.gray("Total tokens:")} ${memory.stats.tokens.toLocaleString()}`);
      console.log(`  ${chalk5.gray("Session tokens:")} ${totalTokens.toLocaleString()}`);
      if (memory.recentDesigns.length > 0) {
        console.log(chalk5.cyan("\n  Recent:\n"));
        memory.recentDesigns.slice(0, 5).forEach((d, i) => {
          const text = d.prompt.length > 40 ? d.prompt.slice(0, 40) + "..." : d.prompt;
          console.log(chalk5.gray(`  ${i + 1}. ${text}`));
        });
      }
      console.log();
    }
  },
  model: {
    desc: "View or change model",
    fn: (args) => {
      if (!args) {
        console.log(chalk5.cyan(`
  Current model: ${config.model}
`));
      } else {
        config.model = args;
        saveConfig();
        console.log(chalk5.green(`
  Model set to: ${args}
`));
      }
    }
  },
  cost: {
    desc: "Show estimated API cost",
    fn: () => {
      const inputCost = totalTokens * 3e-3 / 1e3;
      const outputCost = totalTokens * 0.015 / 1e3;
      const total = inputCost + outputCost;
      console.log(chalk5.cyan(`
  Session: ~$${total.toFixed(4)} (${totalTokens.toLocaleString()} tokens)
`));
    }
  },
  export: {
    desc: "Export current design to file",
    fn: (args) => {
      if (!currentHTML) {
        console.log(chalk5.yellow("\n  No design to export.\n"));
        return;
      }
      const filename = args || `browsr-${Date.now()}.html`;
      writeFile(filename, currentHTML);
      console.log(chalk5.green(`
  Exported: ${filename}
`));
    }
  },
  load: {
    desc: "Load HTML file as current design",
    fn: (args) => {
      if (!args) {
        console.log(chalk5.yellow("\n  Usage: /load filename.html\n"));
        return;
      }
      const content = readFile(args);
      if (content) {
        currentHTML = content;
        save(currentHTML);
        console.log(chalk5.green(`
  Loaded: ${args}
`));
        open();
      } else {
        console.log(chalk5.red(`
  Can't read: ${args}
`));
      }
    }
  },
  ls: {
    desc: "List files in directory",
    fn: (args) => {
      const dir = args || ".";
      const files = listFiles(dir);
      if (files.length === 0) {
        console.log(chalk5.yellow(`
  Empty or can't read: ${dir}
`));
      } else {
        console.log(chalk5.cyan(`
  ${dir}:
`));
        files.forEach((f) => console.log(`  ${f}`));
        console.log();
      }
    }
  },
  cat: {
    desc: "Read file contents",
    fn: (args) => {
      if (!args) {
        console.log(chalk5.yellow("\n  Usage: /cat filename\n"));
        return;
      }
      const content = readFile(args);
      if (content) {
        console.log("\n" + content + "\n");
      } else {
        console.log(chalk5.red(`
  Can't read: ${args}
`));
      }
    }
  },
  bash: {
    desc: "Run shell command",
    fn: (args) => {
      if (!args) {
        console.log(chalk5.yellow("\n  Usage: /bash command\n"));
        return;
      }
      const { stdout, stderr, code } = runBash(args);
      if (stdout) console.log("\n" + stdout);
      if (stderr) console.log(chalk5.red(stderr));
      if (code !== 0) console.log(chalk5.yellow(`
  Exit code: ${code}
`));
    }
  },
  history: {
    desc: "Show design history",
    fn: () => {
      if (designs.length === 0) {
        console.log(chalk5.yellow("\n  No history yet.\n"));
        return;
      }
      console.log(chalk5.cyan("\n  Design History:\n"));
      designs.forEach((d, i) => {
        const time = new Date(d.timestamp).toLocaleTimeString();
        const text = d.prompt.length > 40 ? d.prompt.slice(0, 40) + "..." : d.prompt;
        console.log(chalk5.gray(`  ${i + 1}. [${time}] ${text}`));
      });
      console.log();
    }
  },
  restore: {
    desc: "Restore design from history (e.g., /restore 1)",
    fn: (args) => {
      const n = parseInt(args);
      if (!n || n < 1 || n > designs.length) {
        console.log(chalk5.yellow(`
  Usage: /restore 1-${designs.length}
`));
        return;
      }
      currentHTML = designs[n - 1].html;
      save(currentHTML);
      console.log(chalk5.green(`
  Restored #${n}
`));
      open();
    }
  },
  version: {
    desc: "Show version",
    fn: () => {
      console.log(chalk5.cyan(`
  browsr v${VERSION}
`));
    }
  },
  doctor: {
    desc: "Check system setup",
    fn: () => {
      console.log(chalk5.cyan("\n  System Check:\n"));
      const hasKey = !!process.env.ANTHROPIC_API_KEY;
      console.log(`  ${hasKey ? chalk5.green("\u2713") : chalk5.red("\u2717")} API key ${hasKey ? "set" : "missing"}`);
      const nodeVer = process.version;
      console.log(`  ${chalk5.green("\u2713")} Node ${nodeVer}`);
      const canWrite = (() => {
        try {
          fs.mkdirSync(config.outputDir, { recursive: true });
          return true;
        } catch {
          return false;
        }
      })();
      console.log(`  ${canWrite ? chalk5.green("\u2713") : chalk5.red("\u2717")} Output dir ${canWrite ? "writable" : "not writable"}`);
      const hasBrowser = process.platform === "darwin" || process.platform === "win32" || process.platform === "linux";
      console.log(`  ${hasBrowser ? chalk5.green("\u2713") : chalk5.yellow("?")} Browser support`);
      console.log();
    }
  }
};
function showBanner() {
  console.log(`
  ${chalk5.bold.cyan("browsr")} ${chalk5.gray(`v${VERSION}`)}
  ${chalk5.gray("AI Design Studio")}

  ${chalk5.gray("Create stunning designs with natural language.")}
  ${chalk5.gray("Type /help for commands.")}
`);
}
function format(text) {
  return text.replace(/```html[\s\S]*?```/g, chalk5.green("\u2713 Design saved \u2192 ./output/index.html")).trim();
}
async function startChat() {
  loadConfig();
  loadMemory();
  memory.stats.sessions++;
  saveMemory();
  console.clear();
  showBanner();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on("close", () => {
    if (server) server.close();
    console.log(chalk5.gray("\n  \u270C\uFE0F\n"));
    process.exit(0);
  });
  const prompt = () => {
    rl.question(chalk5.cyan("\u203A "), async (input) => {
      const cmd = input.trim();
      if (!cmd) {
        prompt();
        return;
      }
      if (cmd.startsWith("/")) {
        const [name, ...rest] = cmd.slice(1).split(" ");
        const args = rest.join(" ");
        const handler = COMMANDS[name.toLowerCase()];
        if (handler) {
          handler.fn(args);
        } else {
          console.log(chalk5.yellow(`
  Unknown command: /${name}. Try /help
`));
        }
        prompt();
        return;
      }
      const lower = cmd.toLowerCase();
      if (/^(exit|quit|q|bye)$/.test(lower)) {
        if (server) server.close();
        saveMemory();
        console.log(chalk5.gray("\n  \u270C\uFE0F\n"));
        process.exit(0);
      }
      if (/^(open|o|preview|p|show)$/.test(lower)) {
        if (currentHTML) {
          config.autoOpen = true;
          open();
          console.log(chalk5.green("\n  Opened.\n"));
        } else {
          console.log(chalk5.yellow("\n  No design yet.\n"));
        }
        prompt();
        return;
      }
      if (/^(live|serve|server|watch)$/.test(lower)) {
        startServer();
        prompt();
        return;
      }
      if (/^(clear|reset|new)$/.test(lower)) {
        COMMANDS.clear.fn("");
        prompt();
        return;
      }
      if (/^(history|h)$/.test(lower)) {
        COMMANDS.history.fn("");
        prompt();
        return;
      }
      if (/^restore \d+$/.test(lower)) {
        COMMANDS.restore.fn(lower.split(" ")[1]);
        prompt();
        return;
      }
      if (/^help$/.test(lower)) {
        COMMANDS.help.fn("");
        prompt();
        return;
      }
      const spinner = ora4({ text: chalk5.gray("Thinking..."), color: "cyan" }).start();
      try {
        const response = await chat(cmd);
        spinner.stop();
        const output = format(response);
        console.log("\n" + output.split("\n").map((l) => "  " + l).join("\n") + "\n");
        if (response.includes("```html")) {
          open();
        }
      } catch (err) {
        spinner.stop();
        const msg = err.message || String(err);
        if (msg.includes("API") || msg.includes("key") || msg.includes("401") || msg.includes("auth")) {
          console.log(chalk5.red("\n  API key issue. Run /doctor to check setup.\n"));
        } else if (msg.includes("rate") || msg.includes("429")) {
          console.log(chalk5.yellow("\n  Rate limited. Wait a moment.\n"));
        } else {
          console.log(chalk5.red(`
  Error: ${msg}
`));
        }
      }
      prompt();
    });
  };
  prompt();
}

// src/cli/index.ts
var program = new Command();
var banner = `
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551                                                               \u2551
\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557    \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557         \u2551
\u2551   \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551    \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557        \u2551
\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551 \u2588\u2557 \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D        \u2551
\u2551   \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2588\u2557\u2588\u2588\u2551\u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557        \u2551
\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551  \u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u255A\u2588\u2588\u2588\u2554\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551        \u2551
\u2551   \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D  \u255A\u2550\u2550\u255D\u255A\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D        \u2551
\u2551                                                               \u2551
\u2551   AI-powered design generation for serious builders           \u2551
\u2551   Create professional HTML/CSS from natural language          \u2551
\u2551                                                               \u2551
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D
`;
program.name("browsr").description("browsr - AI-powered design builder that outputs real HTML/CSS/JS").version("1.0.0").addHelpText("beforeAll", chalk6.cyan(banner));
program.command("create").description("Create a new design from a natural language prompt").argument("<prompt>", "Description of what to create").option("-t, --type <type>", "Design type (pitch-deck, resume, poster, instagram, youtube-thumb, etc.)").option("-s, --style <style>", "Style variant (minimal, bold, elegant, modern, professional)", "professional").option("-o, --output <dir>", "Output directory", "./output").option("--no-preview", "Skip automatic preview").action(async (prompt, options) => {
  console.log(chalk6.cyan(banner));
  console.log();
  await create(prompt, options);
});
program.command("preview").description("Start a preview server for your design").argument("[path]", "Path to the design directory", "./output").option("-p, --port <port>", "Port to run the preview server", "3000").action(preview);
program.command("deploy").description("Deploy your design to Cloudflare Pages").argument("[path]", "Path to the design directory", "./output").option("-n, --name <name>", "Project name for the deployment").action(deploy);
program.command("export").description("Export your design to PDF or PNG").argument("[path]", "Path to the design directory", "./output").option("-f, --format <format>", "Export format (pdf, png)", "pdf").option("-o, --output <file>", "Output file path").action(exportDesign);
program.command("types").description("List all available design types").action(() => {
  console.log(chalk6.cyan("\nAvailable design types:\n"));
  const types = [
    { name: "pitch-deck", desc: "Startup pitch deck for investors" },
    { name: "resume", desc: "Professional resume/CV" },
    { name: "poster", desc: "Event poster or promotional material" },
    { name: "instagram", desc: "Instagram post (1080x1080)" },
    { name: "youtube-thumb", desc: "YouTube thumbnail (1280x720)" },
    { name: "infographic", desc: "Data visualization infographic" },
    { name: "flyer", desc: "Event or promotional flyer" },
    { name: "business-card", desc: "Professional business card" },
    { name: "logo", desc: "Brand logo design" },
    { name: "portfolio", desc: "Portfolio presentation" },
    { name: "study-guide", desc: "Educational study guide" },
    { name: "flashcards", desc: "Study flashcards" },
    { name: "research-poster", desc: "Academic research poster" },
    { name: "quote", desc: "Quote graphic for social media" },
    { name: "certificate", desc: "Achievement certificate" }
  ];
  types.forEach(({ name, desc }) => {
    console.log(`  ${chalk6.green(name.padEnd(18))} ${chalk6.gray(desc)}`);
  });
  console.log(chalk6.cyan("\nStyles available: ") + chalk6.white("minimal, bold, elegant, modern, professional"));
  console.log(chalk6.gray('\nExample: browsr create "A pitch deck for my AI startup" -t pitch-deck -s modern\n'));
});
program.command("chat", { isDefault: true }).description("Start browsr in interactive chat mode (like Claude Code)").action(async () => {
  await startChat();
});
program.parse();
