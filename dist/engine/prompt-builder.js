/**
 * Prompt Builder
 * Constructs AI prompts by combining master prompt + archetype + style + user input
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
// Get the prompts directory relative to the package
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROMPTS_DIR = join(__dirname, '../../prompts');
/**
 * Read a prompt file
 */
function readPromptFile(path) {
    try {
        return readFileSync(join(PROMPTS_DIR, path), 'utf-8');
    }
    catch {
        console.warn(`Warning: Could not read prompt file: ${path}`);
        return '';
    }
}
/**
 * Style-specific instructions
 */
const STYLE_INSTRUCTIONS = {
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
`,
};
/**
 * Build the complete prompt for AI generation
 */
export function buildPrompt(archetype, userInput, style) {
    // Use specified style or archetype default
    const selectedStyle = style || archetype.defaultStyle;
    // Read the master prompt
    const masterPrompt = readPromptFile('master.md');
    // Read the archetype-specific prompt
    const archetypePrompt = readPromptFile(archetype.promptPath);
    // Get style instructions
    const styleInstructions = STYLE_INSTRUCTIONS[selectedStyle] || STYLE_INSTRUCTIONS.professional;
    // Build dimension instructions if applicable
    let dimensionInstructions = '';
    if (archetype.dimensions) {
        dimensionInstructions = `
## Dimensions

Create this design at exactly:
- Width: ${archetype.dimensions.width}px
- Height: ${archetype.dimensions.height}px

The output should be sized appropriately for this format.
`;
    }
    // Combine everything into the final prompt
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
/**
 * Get a simpler prompt for quick generation
 */
export function buildQuickPrompt(userInput, type, style) {
    const styleInstructions = STYLE_INSTRUCTIONS[style || 'professional'];
    return `You are a professional HTML/CSS designer. Create a beautiful, self-contained HTML file based on this request:

"${userInput}"

${type ? `Design type: ${type}` : ''}

${styleInstructions}

Guidelines:
- Output a complete HTML file with embedded CSS
- Use modern CSS (Grid, Flexbox, custom properties, clamp())
- Make it look professional and polished
- Use the Inter font from Google Fonts
- Ensure good spacing, typography, and visual hierarchy
- No external dependencies except Google Fonts

Output ONLY the HTML code, no explanations.`;
}
