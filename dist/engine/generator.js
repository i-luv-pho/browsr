/**
 * Design Generator
 * Calls Claude API to generate HTML/CSS designs
 */
import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt, buildQuickPrompt } from './prompt-builder';
// Initialize the Anthropic client
const anthropic = new Anthropic();
/**
 * Extract HTML from AI response
 * Handles various formats the AI might return
 */
function extractHTML(content) {
    // If it starts with <!DOCTYPE, it's already clean HTML
    if (content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html')) {
        return content.trim();
    }
    // Try to extract from markdown code blocks
    const codeBlockMatch = content.match(/```(?:html)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
        return codeBlockMatch[1].trim();
    }
    // Try to find HTML document within the content
    const htmlMatch = content.match(/(<!DOCTYPE[\s\S]*<\/html>)/i);
    if (htmlMatch) {
        return htmlMatch[1].trim();
    }
    // Last resort: return as-is
    return content.trim();
}
/**
 * Validate generated HTML
 */
function validateHTML(html) {
    const errors = [];
    if (!html.includes('<!DOCTYPE')) {
        errors.push('Missing DOCTYPE declaration');
    }
    if (!html.includes('<html')) {
        errors.push('Missing <html> tag');
    }
    if (!html.includes('<head>') && !html.includes('<head ')) {
        errors.push('Missing <head> section');
    }
    if (!html.includes('<body>') && !html.includes('<body ')) {
        errors.push('Missing <body> section');
    }
    if (!html.includes('</html>')) {
        errors.push('Missing closing </html> tag');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Generate a design using Claude
 */
export async function generate(archetype, userInput, style) {
    const startTime = Date.now();
    const selectedStyle = style || archetype.defaultStyle;
    // Build the prompt
    const prompt = buildPrompt(archetype, userInput, selectedStyle);
    // Call Claude
    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });
    // Extract the text response
    const textBlock = message.content.find(block => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text response from AI');
    }
    // Extract and validate HTML
    const html = extractHTML(textBlock.text);
    const validation = validateHTML(html);
    if (!validation.valid) {
        console.warn('HTML validation warnings:', validation.errors);
    }
    const generationTime = Date.now() - startTime;
    return {
        html,
        archetype,
        style: selectedStyle,
        prompt: userInput,
        generationTime,
    };
}
/**
 * Quick generation without archetype detection
 */
export async function quickGenerate(userInput, type, style) {
    const prompt = buildQuickPrompt(userInput, type, style);
    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });
    const textBlock = message.content.find(block => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text response from AI');
    }
    return extractHTML(textBlock.text);
}
/**
 * Stream generation for real-time output
 */
export async function* streamGenerate(archetype, userInput, style) {
    const selectedStyle = style || archetype.defaultStyle;
    const prompt = buildPrompt(archetype, userInput, selectedStyle);
    const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });
    for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            yield event.delta.text;
        }
    }
}
