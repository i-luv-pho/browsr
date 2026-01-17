"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/cli/index.ts
var import_commander = require("commander");
var import_chalk6 = __toESM(require("chalk"), 1);

// src/cli/commands/create.ts
var import_fs3 = require("fs");
var import_path3 = require("path");
var import_chalk2 = __toESM(require("chalk"), 1);
var import_ora = __toESM(require("ora"), 1);

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
var import_sdk = __toESM(require("@anthropic-ai/sdk"), 1);

// src/engine/prompt-builder.ts
var import_fs = require("fs");
var import_path = require("path");
var import_url = require("url");
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = (0, import_path.dirname)(__filename);
var PROMPTS_DIR = (0, import_path.join)(__dirname, "../../prompts");
function readPromptFile(path2) {
  try {
    return (0, import_fs.readFileSync)((0, import_path.join)(PROMPTS_DIR, path2), "utf-8");
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
var anthropic = new import_sdk.default();
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
function validateHTML(html2) {
  const errors = [];
  if (!html2.includes("<!DOCTYPE")) {
    errors.push("Missing DOCTYPE declaration");
  }
  if (!html2.includes("<html")) {
    errors.push("Missing <html> tag");
  }
  if (!html2.includes("<head>") && !html2.includes("<head ")) {
    errors.push("Missing <head> section");
  }
  if (!html2.includes("<body>") && !html2.includes("<body ")) {
    errors.push("Missing <body> section");
  }
  if (!html2.includes("</html>")) {
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
  const html2 = extractHTML(textBlock.text);
  const validation = validateHTML(html2);
  if (!validation.valid) {
    console.warn("HTML validation warnings:", validation.errors);
  }
  const generationTime = Date.now() - startTime;
  return {
    html: html2,
    archetype,
    style: selectedStyle,
    prompt: userInput,
    generationTime
  };
}

// src/cli/commands/preview.ts
var import_http = require("http");
var import_path2 = require("path");
var import_fs2 = require("fs");
var import_child_process = require("child_process");
var import_chalk = __toESM(require("chalk"), 1);
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
  if (!(0, import_fs2.existsSync)(outputDir)) {
    console.error(import_chalk.default.red(`Directory not found: ${outputDir}`));
    console.log(import_chalk.default.gray('Run "build create <prompt>" first to generate a design.'));
    process.exit(1);
  }
  const indexPath = (0, import_path2.join)(outputDir, "index.html");
  if (!(0, import_fs2.existsSync)(indexPath)) {
    console.error(import_chalk.default.red(`No index.html found in ${outputDir}`));
    process.exit(1);
  }
  console.log(import_chalk.default.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
  console.log(import_chalk.default.white.bold("  DesignCraft Preview Server"));
  console.log(import_chalk.default.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
  console.log();
  console.log(import_chalk.default.gray("  Serving:  ") + import_chalk.default.white(outputDir));
  console.log(import_chalk.default.gray("  Local:    ") + import_chalk.default.cyan(`http://localhost:${port}`));
  console.log();
  console.log(import_chalk.default.gray("  Press Ctrl+C to stop"));
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
  const server2 = (0, import_http.createServer)((req, res) => {
    let filePath = req.url || "/";
    if (filePath === "/") {
      filePath = "/index.html";
    }
    if (filePath === "/__check") {
      try {
        const stat = (0, import_fs2.statSync)(indexPath);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(stat.mtimeMs.toString());
      } catch {
        res.writeHead(500);
        res.end("Error");
      }
      return;
    }
    const fullPath = (0, import_path2.join)(outputDir, filePath);
    if (!(0, import_fs2.existsSync)(fullPath)) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    try {
      const ext = (0, import_path2.extname)(fullPath);
      const mimeType = MIME_TYPES[ext] || "application/octet-stream";
      let content = (0, import_fs2.readFileSync)(fullPath);
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
      (0, import_child_process.exec)(`open http://localhost:${port}`);
    } catch {
    }
  });
  await new Promise(() => {
  });
}

// src/cli/commands/create.ts
async function create(prompt, options) {
  const spinner = (0, import_ora.default)();
  try {
    spinner.start(import_chalk2.default.gray("Analyzing your request..."));
    let archetype;
    if (options.type) {
      archetype = getArchetype(options.type);
      if (!archetype) {
        spinner.fail(import_chalk2.default.red(`Unknown design type: ${options.type}`));
        console.log(import_chalk2.default.gray('Run "browsrtypes" to see available types'));
        return;
      }
    } else {
      archetype = detectArchetype(prompt);
    }
    spinner.succeed(import_chalk2.default.green(`Detected: ${archetype.name}`));
    spinner.start(import_chalk2.default.gray(`Generating ${archetype.name}...`));
    const design = await generate(archetype, prompt, options.style);
    spinner.succeed(import_chalk2.default.green(`Generated in ${(design.generationTime / 1e3).toFixed(1)}s`));
    spinner.start(import_chalk2.default.gray("Writing files..."));
    const outputDir = options.output;
    if (!(0, import_fs3.existsSync)(outputDir)) {
      (0, import_fs3.mkdirSync)(outputDir, { recursive: true });
    }
    const htmlPath = (0, import_path3.join)(outputDir, "index.html");
    (0, import_fs3.writeFileSync)(htmlPath, design.html, "utf-8");
    const metadataPath = (0, import_path3.join)(outputDir, "design.json");
    (0, import_fs3.writeFileSync)(
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
    spinner.succeed(import_chalk2.default.green(`Files written to ${outputDir}/`));
    console.log();
    console.log(import_chalk2.default.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
    console.log(import_chalk2.default.white.bold("  Design Generated Successfully!"));
    console.log(import_chalk2.default.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
    console.log();
    console.log(import_chalk2.default.gray("  Type:     ") + import_chalk2.default.white(archetype.name));
    console.log(import_chalk2.default.gray("  Style:    ") + import_chalk2.default.white(design.style));
    console.log(import_chalk2.default.gray("  Time:     ") + import_chalk2.default.white(`${(design.generationTime / 1e3).toFixed(1)}s`));
    console.log(import_chalk2.default.gray("  Output:   ") + import_chalk2.default.white(htmlPath));
    console.log();
    console.log(import_chalk2.default.gray("  Next steps:"));
    console.log(import_chalk2.default.gray("    \u2022 ") + import_chalk2.default.white(`open ${htmlPath}`) + import_chalk2.default.gray(" - View in browser"));
    console.log(import_chalk2.default.gray("    \u2022 ") + import_chalk2.default.white("browsrpreview") + import_chalk2.default.gray(" - Start dev server"));
    console.log(import_chalk2.default.gray("    \u2022 ") + import_chalk2.default.white("browsrdeploy") + import_chalk2.default.gray(" - Deploy to web"));
    console.log(import_chalk2.default.gray("    \u2022 ") + import_chalk2.default.white("browsrexport --format pdf") + import_chalk2.default.gray(" - Export to PDF"));
    console.log();
    if (options.preview) {
      console.log(import_chalk2.default.yellow("Starting preview server..."));
      console.log();
      await preview(outputDir, { port: "3000" });
    }
  } catch (error) {
    spinner.fail(import_chalk2.default.red("Generation failed"));
    if (error instanceof Error) {
      console.error(import_chalk2.default.red("\nError: ") + error.message);
      if (error.message.includes("API")) {
        console.log(import_chalk2.default.gray("\nMake sure ANTHROPIC_API_KEY is set in your environment."));
      }
    }
    process.exit(1);
  }
}

// src/cli/commands/deploy.ts
var import_fs4 = require("fs");
var import_child_process2 = require("child_process");
var import_chalk3 = __toESM(require("chalk"), 1);
var import_ora2 = __toESM(require("ora"), 1);
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
  const spinner = (0, import_ora2.default)();
  const outputDir = path2 || "./output";
  const projectName = options.name || generateProjectName();
  if (!(0, import_fs4.existsSync)(outputDir)) {
    console.error(import_chalk3.default.red(`Directory not found: ${outputDir}`));
    console.log(import_chalk3.default.gray('Run "build create <prompt>" first to generate a design.'));
    process.exit(1);
  }
  try {
    (0, import_child_process2.execSync)("which wrangler", { stdio: "ignore" });
  } catch {
    console.error(import_chalk3.default.red("Wrangler CLI not found."));
    console.log(import_chalk3.default.gray("Install it with: npm install -g wrangler"));
    console.log(import_chalk3.default.gray("Then authenticate with: wrangler login"));
    process.exit(1);
  }
  console.log(import_chalk3.default.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
  console.log(import_chalk3.default.white.bold("  Deploying to Cloudflare Pages"));
  console.log(import_chalk3.default.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
  console.log();
  console.log(import_chalk3.default.gray("  Project:  ") + import_chalk3.default.white(projectName));
  console.log(import_chalk3.default.gray("  Source:   ") + import_chalk3.default.white(outputDir));
  console.log();
  try {
    spinner.start(import_chalk3.default.gray("Uploading to Cloudflare..."));
    const result = (0, import_child_process2.execSync)(
      `wrangler pages deploy ${outputDir} --project-name=${projectName}`,
      { encoding: "utf-8" }
    );
    spinner.succeed(import_chalk3.default.green("Deployed successfully!"));
    const urlMatch = result.match(/https:\/\/[^\s]+\.pages\.dev/);
    const deployUrl = urlMatch ? urlMatch[0] : `https://${projectName}.pages.dev`;
    console.log();
    console.log(import_chalk3.default.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
    console.log(import_chalk3.default.white.bold("  Deployment Complete!"));
    console.log(import_chalk3.default.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
    console.log();
    console.log(import_chalk3.default.gray("  Live URL: ") + import_chalk3.default.cyan(deployUrl));
    console.log();
    console.log(import_chalk3.default.gray("  Your design is now live on the web!"));
    console.log(import_chalk3.default.gray("  Share this URL with anyone."));
    console.log();
    try {
      (0, import_child_process2.execSync)(`open ${deployUrl}`, { stdio: "ignore" });
    } catch {
    }
  } catch (error) {
    spinner.fail(import_chalk3.default.red("Deployment failed"));
    if (error instanceof Error) {
      console.error(import_chalk3.default.red("\nError: ") + error.message);
    }
    console.log(import_chalk3.default.gray("\nTroubleshooting:"));
    console.log(import_chalk3.default.gray("  1. Make sure you're logged in: wrangler login"));
    console.log(import_chalk3.default.gray("  2. Check your Cloudflare account has Pages enabled"));
    console.log(import_chalk3.default.gray("  3. Try a different project name with: build deploy -n my-project"));
    process.exit(1);
  }
}

// src/cli/commands/export.ts
var import_fs5 = require("fs");
var import_path4 = require("path");
var import_chalk4 = __toESM(require("chalk"), 1);
var import_ora3 = __toESM(require("ora"), 1);
async function exportDesign(path2, options) {
  const spinner = (0, import_ora3.default)();
  const outputDir = path2 || "./output";
  const format = options.format || "pdf";
  if (!(0, import_fs5.existsSync)(outputDir)) {
    console.error(import_chalk4.default.red(`Directory not found: ${outputDir}`));
    console.log(import_chalk4.default.gray('Run "build create <prompt>" first to generate a design.'));
    process.exit(1);
  }
  const indexPath = (0, import_path4.join)(outputDir, "index.html");
  if (!(0, import_fs5.existsSync)(indexPath)) {
    console.error(import_chalk4.default.red(`No index.html found in ${outputDir}`));
    process.exit(1);
  }
  console.log(import_chalk4.default.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
  console.log(import_chalk4.default.white.bold(`  Exporting to ${format.toUpperCase()}`));
  console.log(import_chalk4.default.cyan("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550"));
  console.log();
  try {
    let puppeteer;
    try {
      puppeteer = await import("puppeteer");
    } catch {
      console.error(import_chalk4.default.red("Puppeteer not installed."));
      console.log(import_chalk4.default.gray("Install it with: bun add puppeteer"));
      console.log();
      console.log(import_chalk4.default.yellow("Alternative: Open the HTML file in Chrome and use Print > Save as PDF"));
      process.exit(1);
    }
    spinner.start(import_chalk4.default.gray(`Rendering ${format.toUpperCase()}...`));
    const browser = await puppeteer.default.launch({
      headless: true
    });
    const page = await browser.newPage();
    const fileUrl = `file://${(0, import_path4.resolve)(indexPath)}`;
    await page.goto(fileUrl, { waitUntil: "networkidle0" });
    await new Promise((resolve3) => setTimeout(resolve3, 1e3));
    const outputPath = options.output || (0, import_path4.join)(outputDir, `design.${format}`);
    if (format === "pdf") {
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
    spinner.succeed(import_chalk4.default.green("Export complete!"));
    console.log();
    console.log(import_chalk4.default.gray("  Output: ") + import_chalk4.default.white(outputPath));
    console.log();
    try {
      const { execSync: execSync3 } = await import("child_process");
      execSync3(`open "${outputPath}"`, { stdio: "ignore" });
    } catch {
    }
  } catch (error) {
    spinner.fail(import_chalk4.default.red("Export failed"));
    if (error instanceof Error) {
      console.error(import_chalk4.default.red("\nError: ") + error.message);
    }
    process.exit(1);
  }
}

// src/cli/commands/chat.ts
var readline = __toESM(require("readline"), 1);
var import_chalk5 = __toESM(require("chalk"), 1);
var fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);
var import_child_process3 = require("child_process");
var http = __toESM(require("http"), 1);
var os = __toESM(require("os"), 1);
var import_sdk2 = __toESM(require("@anthropic-ai/sdk"), 1);
var anthropic2 = new import_sdk2.default();
var VERSION = "2.0.0";
var messages = [];
var designs = [];
var html = null;
var tokens = 0;
var server = null;
var config = {
  model: "claude-sonnet-4-20250514",
  maxHistory: 10,
  // Keep conversation short for speed
  outputDir: "./output",
  autoOpen: true,
  stream: true,
  // Stream responses for perceived speed
  retries: 2,
  // Fast retry on failure
  timeout: 6e4
  // 60s timeout
};
var HOME = os.homedir();
var MEMORY_FILE = path.join(HOME, ".browsr.json");
var SYSTEM = `You are browsr, the fastest AI design tool. You create stunning HTML/CSS instantly.

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
User says "make it X" \u2192 output FULL updated HTML. No explanations.

TYPES: pitch-deck, resume, poster, instagram, landing, portfolio, card, logo, banner, hero, pricing, dashboard, 404, certificate, invoice, menu, infographic, quote

BE BRIEF. SHIP FAST.`;
var memory = { designs: 0, tokens: 0, lastPrompts: [] };
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
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory));
  } catch {
  }
}
async function streamChat(input) {
  if (messages.length > config.maxHistory * 2) {
    messages = messages.slice(-config.maxHistory * 2);
  }
  messages.push({ role: "user", content: input });
  let prompt = input;
  if (html && /^(make|change|update|add|remove|more|less|try|tweak|fix|darker|lighter|bigger|smaller)/i.test(input)) {
    prompt = `[Current]
\`\`\`html
${html}
\`\`\`
[Do] ${input}`;
  }
  const apiMsgs = messages.map((m, i) => ({
    role: m.role,
    content: i === messages.length - 1 ? prompt : m.content
  }));
  let reply = "";
  let retries = config.retries;
  while (retries >= 0) {
    try {
      const stream = await anthropic2.messages.stream({
        model: config.model,
        max_tokens: 16e3,
        system: SYSTEM,
        messages: apiMsgs
      });
      process.stdout.write("\n  ");
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          const text = event.delta.text;
          reply += text;
          if (!reply.includes("```html") || reply.includes("```\n")) {
            const clean = text.replace(/```html[\s\S]*?```/g, "");
            if (clean) process.stdout.write(clean);
          }
        }
      }
      const finalMsg = await stream.finalMessage();
      tokens += (finalMsg.usage?.input_tokens || 0) + (finalMsg.usage?.output_tokens || 0);
      memory.tokens += (finalMsg.usage?.input_tokens || 0) + (finalMsg.usage?.output_tokens || 0);
      break;
    } catch (err) {
      retries--;
      if (retries < 0) throw err;
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  messages.push({ role: "assistant", content: reply });
  const match = reply.match(/```html\s*([\s\S]*?)```/);
  if (match) {
    html = match[1].trim();
    designs.push({ html, prompt: input, ts: Date.now() });
    save(html);
    memory.designs++;
    memory.lastPrompts.unshift(input);
    memory.lastPrompts = memory.lastPrompts.slice(0, 10);
    saveMemory();
    process.stdout.write(import_chalk5.default.green("\n  \u2713 Saved"));
  }
  process.stdout.write("\n\n");
  return reply;
}
function save(content, name = "index.html") {
  fs.mkdirSync(config.outputDir, { recursive: true });
  fs.writeFileSync(path.join(config.outputDir, name), content);
}
function open(target) {
  if (!config.autoOpen) return;
  const file = target || path.resolve(config.outputDir, "index.html");
  try {
    const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? 'start ""' : "xdg-open";
    (0, import_child_process3.execSync)(`${cmd} "${file}"`, { stdio: "ignore" });
  } catch {
  }
}
function read(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }
}
function ls(dir = ".") {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}
function bash(cmd) {
  try {
    return (0, import_child_process3.execSync)(cmd, { encoding: "utf8", timeout: 3e4 });
  } catch (e) {
    return e.message;
  }
}
function serve(port = 3333) {
  if (server) return;
  let lastMod = 0;
  server = http.createServer((req, res) => {
    const file = path.join(config.outputDir, "index.html");
    if (req.url === "/__poll") {
      const mod = fs.existsSync(file) ? fs.statSync(file).mtimeMs : 0;
      res.end(mod > lastMod ? "reload" : "ok");
      lastMod = mod;
      return;
    }
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, "utf8");
      const script = `<script>setInterval(()=>fetch('/__poll').then(r=>r.text()).then(t=>t==='reload'&&location.reload()),500)</script>`;
      content = content.replace("</body>", script + "</body>");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end('<html><body style="background:#09090b;color:#fff;font-family:system-ui;display:grid;place-items:center;height:100vh;margin:0"><h1>Waiting for design...</h1></body></html>');
    }
  });
  server.listen(port, () => {
    console.log(import_chalk5.default.green(`
  Live: http://localhost:${port}
`));
    open(`http://localhost:${port}`);
  });
}
var CMDS = {
  help: () => console.log(`
  ${import_chalk5.default.bold("Commands")}
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
  clear: () => {
    messages = [];
    html = null;
    console.clear();
    banner();
  },
  history: () => {
    if (!designs.length) {
      console.log(import_chalk5.default.yellow("\n  No history\n"));
      return;
    }
    console.log(import_chalk5.default.cyan("\n  History:"));
    designs.slice(-10).forEach((d, i) => {
      console.log(import_chalk5.default.gray(`  ${i + 1}. ${d.prompt.slice(0, 50)}${d.prompt.length > 50 ? "..." : ""}`));
    });
    console.log();
  },
  restore: (a) => {
    const n = parseInt(a);
    if (!n || n < 1 || n > designs.length) {
      console.log(import_chalk5.default.yellow(`
  Use 1-${designs.length}
`));
      return;
    }
    html = designs[n - 1].html;
    save(html);
    console.log(import_chalk5.default.green(`
  Restored #${n}
`));
    open();
  },
  export: (a) => {
    if (!html) {
      console.log(import_chalk5.default.yellow("\n  Nothing to export\n"));
      return;
    }
    const name = a || `design-${Date.now()}.html`;
    fs.writeFileSync(name, html);
    console.log(import_chalk5.default.green(`
  Exported: ${name}
`));
  },
  load: (a) => {
    if (!a) {
      console.log(import_chalk5.default.yellow("\n  /load file.html\n"));
      return;
    }
    const content = read(a);
    if (content) {
      html = content;
      save(html);
      console.log(import_chalk5.default.green(`
  Loaded
`));
      open();
    } else console.log(import_chalk5.default.red(`
  Can't read ${a}
`));
  },
  ls: (a) => {
    const files = ls(a || ".");
    if (!files.length) console.log(import_chalk5.default.yellow("\n  Empty\n"));
    else {
      console.log();
      files.forEach((f) => console.log(`  ${f}`));
      console.log();
    }
  },
  cat: (a) => {
    if (!a) {
      console.log(import_chalk5.default.yellow("\n  /cat file\n"));
      return;
    }
    const content = read(a);
    if (content) console.log("\n" + content + "\n");
    else console.log(import_chalk5.default.red(`
  Can't read
`));
  },
  bash: (a) => {
    if (!a) {
      console.log(import_chalk5.default.yellow("\n  /bash cmd\n"));
      return;
    }
    console.log("\n" + bash(a) + "\n");
  },
  model: (a) => {
    if (a) {
      config.model = a;
      console.log(import_chalk5.default.green(`
  Model: ${a}
`));
    } else console.log(import_chalk5.default.cyan(`
  Model: ${config.model}
`));
  },
  stats: () => {
    console.log(import_chalk5.default.cyan(`
  Session:  ${tokens.toLocaleString()} tokens
  Total:    ${memory.tokens.toLocaleString()} tokens
  Designs:  ${memory.designs}
  Cost:     ~$${((tokens * 3e-3 + tokens * 0.015) / 1e3).toFixed(4)}
`));
  },
  config: () => {
    console.log(import_chalk5.default.cyan("\n  Config:"));
    Object.entries(config).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
    console.log();
  },
  set: (a) => {
    const [k, ...rest] = a.split(" ");
    const v = rest.join(" ");
    if (k in config) {
      config[k] = v === "true" ? true : v === "false" ? false : isNaN(Number(v)) ? v : Number(v);
      console.log(import_chalk5.default.green(`
  ${k} = ${config[k]}
`));
    } else console.log(import_chalk5.default.yellow(`
  Unknown: ${k}
`));
  },
  doctor: () => {
    console.log(import_chalk5.default.cyan("\n  Check:"));
    console.log(`  ${process.env.ANTHROPIC_API_KEY ? import_chalk5.default.green("\u2713") : import_chalk5.default.red("\u2717")} API key`);
    console.log(`  ${import_chalk5.default.green("\u2713")} Node ${process.version}`);
    console.log(`  ${import_chalk5.default.green("\u2713")} Platform ${process.platform}`);
    console.log();
  },
  version: () => console.log(import_chalk5.default.cyan(`
  browsr v${VERSION}
`))
};
function banner() {
  console.log(`
  ${import_chalk5.default.bold.cyan("browsr")} ${import_chalk5.default.gray(`v${VERSION}`)}
  ${import_chalk5.default.gray("AI Design Studio \u2022 Type anything \u2022 /help for commands")}
`);
}
async function startChat() {
  loadMemory();
  console.clear();
  banner();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.on("close", () => {
    if (server) server.close();
    saveMemory();
    process.exit(0);
  });
  const prompt = () => {
    rl.question(import_chalk5.default.cyan("\u203A "), async (input) => {
      const cmd = input.trim();
      if (!cmd) {
        prompt();
        return;
      }
      if (cmd.startsWith("/")) {
        const [name, ...rest] = cmd.slice(1).split(" ");
        const handler = CMDS[name.toLowerCase()];
        if (handler) handler(rest.join(" "));
        else console.log(import_chalk5.default.yellow(`
  Unknown: /${name}
`));
        prompt();
        return;
      }
      const lower = cmd.toLowerCase();
      if (/^(q|quit|exit|bye)$/.test(lower)) {
        rl.close();
        return;
      }
      if (/^(open|o|show|preview|p)$/.test(lower)) {
        if (html) {
          open();
          console.log(import_chalk5.default.green("\n  Opened\n"));
        } else console.log(import_chalk5.default.yellow("\n  Nothing yet\n"));
        prompt();
        return;
      }
      if (/^(live|serve|server|watch)$/.test(lower)) {
        serve();
        prompt();
        return;
      }
      if (/^(clear|reset|new)$/.test(lower)) {
        CMDS.clear("");
        prompt();
        return;
      }
      if (/^(history|h)$/.test(lower)) {
        CMDS.history("");
        prompt();
        return;
      }
      if (/^(help|\?)$/.test(lower)) {
        CMDS.help("");
        prompt();
        return;
      }
      try {
        await streamChat(cmd);
        if (html) open();
      } catch (err) {
        const msg = err.message || "";
        if (msg.includes("API") || msg.includes("401") || msg.includes("key")) {
          console.log(import_chalk5.default.red("\n  API key issue. Run /doctor\n"));
        } else if (msg.includes("429") || msg.includes("rate")) {
          console.log(import_chalk5.default.yellow("\n  Rate limited. Retry in a sec.\n"));
        } else {
          console.log(import_chalk5.default.red(`
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
var program = new import_commander.Command();
var banner2 = `
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
program.name("browsr").description("browsr - AI-powered design builder that outputs real HTML/CSS/JS").version("1.0.0").addHelpText("beforeAll", import_chalk6.default.cyan(banner2));
program.command("create").description("Create a new design from a natural language prompt").argument("<prompt>", "Description of what to create").option("-t, --type <type>", "Design type (pitch-deck, resume, poster, instagram, youtube-thumb, etc.)").option("-s, --style <style>", "Style variant (minimal, bold, elegant, modern, professional)", "professional").option("-o, --output <dir>", "Output directory", "./output").option("--no-preview", "Skip automatic preview").action(async (prompt, options) => {
  console.log(import_chalk6.default.cyan(banner2));
  console.log();
  await create(prompt, options);
});
program.command("preview").description("Start a preview server for your design").argument("[path]", "Path to the design directory", "./output").option("-p, --port <port>", "Port to run the preview server", "3000").action(preview);
program.command("deploy").description("Deploy your design to Cloudflare Pages").argument("[path]", "Path to the design directory", "./output").option("-n, --name <name>", "Project name for the deployment").action(deploy);
program.command("export").description("Export your design to PDF or PNG").argument("[path]", "Path to the design directory", "./output").option("-f, --format <format>", "Export format (pdf, png)", "pdf").option("-o, --output <file>", "Output file path").action(exportDesign);
program.command("types").description("List all available design types").action(() => {
  console.log(import_chalk6.default.cyan("\nAvailable design types:\n"));
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
    console.log(`  ${import_chalk6.default.green(name.padEnd(18))} ${import_chalk6.default.gray(desc)}`);
  });
  console.log(import_chalk6.default.cyan("\nStyles available: ") + import_chalk6.default.white("minimal, bold, elegant, modern, professional"));
  console.log(import_chalk6.default.gray('\nExample: browsr create "A pitch deck for my AI startup" -t pitch-deck -s modern\n'));
});
program.command("chat", { isDefault: true }).description("Start browsr in interactive chat mode (like Claude Code)").action(async () => {
  await startChat();
});
program.parse();
