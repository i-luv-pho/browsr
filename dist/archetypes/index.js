/**
 * Archetype Registry
 * Defines all design types and their configurations
 */
export const archetypes = [
    // ═══════════════════════════════════════════════════════════════
    // PRESENTATIONS
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'pitch-deck',
        name: 'Pitch Deck',
        description: 'Startup pitch deck for investors',
        structure: 'presentation',
        defaultStyle: 'professional',
        keywords: ['pitch', 'deck', 'investor', 'startup', 'funding', 'raise', 'vc', 'series'],
        promptPath: 'archetypes/pitch-deck.md',
    },
    {
        id: 'portfolio',
        name: 'Portfolio Presentation',
        description: 'Showcase of work and projects',
        structure: 'presentation',
        defaultStyle: 'elegant',
        keywords: ['portfolio', 'work', 'projects', 'showcase', 'creative'],
        promptPath: 'archetypes/portfolio.md',
    },
    {
        id: 'presentation',
        name: 'General Presentation',
        description: 'Generic slide presentation',
        structure: 'presentation',
        defaultStyle: 'professional',
        keywords: ['presentation', 'slides', 'slideshow', 'ppt', 'powerpoint'],
        promptPath: 'archetypes/presentation.md',
    },
    // ═══════════════════════════════════════════════════════════════
    // SINGLE-PAGE DESIGNS
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'resume',
        name: 'Resume / CV',
        description: 'Professional resume or curriculum vitae',
        structure: 'single-page',
        defaultStyle: 'minimal',
        dimensions: { width: 816, height: 1056 }, // Letter size at 96dpi
        keywords: ['resume', 'cv', 'curriculum vitae', 'job', 'career', 'work history'],
        promptPath: 'archetypes/resume.md',
    },
    {
        id: 'poster',
        name: 'Event Poster',
        description: 'Promotional poster for events',
        structure: 'single-page',
        defaultStyle: 'bold',
        dimensions: { width: 1296, height: 1728 }, // 18x24 at 72dpi
        keywords: ['poster', 'event', 'concert', 'festival', 'party', 'show', 'announcement'],
        promptPath: 'archetypes/poster.md',
    },
    {
        id: 'instagram',
        name: 'Instagram Post',
        description: 'Square post for Instagram feed',
        structure: 'single-page',
        defaultStyle: 'modern',
        dimensions: { width: 1080, height: 1080 },
        keywords: ['instagram', 'ig', 'insta', 'post', 'social', 'square'],
        promptPath: 'archetypes/instagram-post.md',
    },
    {
        id: 'youtube-thumb',
        name: 'YouTube Thumbnail',
        description: 'Clickable video thumbnail',
        structure: 'single-page',
        defaultStyle: 'bold',
        dimensions: { width: 1280, height: 720 },
        keywords: ['youtube', 'thumbnail', 'thumb', 'video', 'yt'],
        promptPath: 'archetypes/youtube-thumbnail.md',
    },
    {
        id: 'infographic',
        name: 'Infographic',
        description: 'Data visualization and information graphic',
        structure: 'single-page',
        defaultStyle: 'modern',
        keywords: ['infographic', 'data', 'visualization', 'stats', 'statistics', 'chart'],
        promptPath: 'archetypes/infographic.md',
    },
    {
        id: 'flyer',
        name: 'Flyer',
        description: 'Promotional flyer or handout',
        structure: 'single-page',
        defaultStyle: 'bold',
        dimensions: { width: 816, height: 1056 },
        keywords: ['flyer', 'handout', 'promo', 'promotional', 'leaflet'],
        promptPath: 'archetypes/flyer.md',
    },
    {
        id: 'research-poster',
        name: 'Research Poster',
        description: 'Academic research presentation poster',
        structure: 'single-page',
        defaultStyle: 'professional',
        dimensions: { width: 2592, height: 3456 }, // 36x48 at 72dpi
        keywords: ['research', 'academic', 'science', 'study', 'thesis', 'conference'],
        promptPath: 'archetypes/research-poster.md',
    },
    {
        id: 'quote',
        name: 'Quote Graphic',
        description: 'Shareable quote image',
        structure: 'single-page',
        defaultStyle: 'elegant',
        dimensions: { width: 1080, height: 1080 },
        keywords: ['quote', 'saying', 'inspiration', 'motivational', 'words'],
        promptPath: 'archetypes/quote.md',
    },
    // ═══════════════════════════════════════════════════════════════
    // CARDS
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'business-card',
        name: 'Business Card',
        description: 'Professional contact card',
        structure: 'card',
        defaultStyle: 'minimal',
        dimensions: { width: 350, height: 200 }, // Standard 3.5x2 at 100dpi
        keywords: ['business card', 'contact', 'networking', 'card'],
        promptPath: 'archetypes/business-card.md',
    },
    {
        id: 'flashcards',
        name: 'Flashcards',
        description: 'Study flashcards for learning',
        structure: 'card',
        defaultStyle: 'minimal',
        dimensions: { width: 500, height: 300 },
        keywords: ['flashcard', 'study', 'learning', 'quiz', 'memory'],
        promptPath: 'archetypes/flashcards.md',
    },
    {
        id: 'certificate',
        name: 'Certificate',
        description: 'Achievement or completion certificate',
        structure: 'card',
        defaultStyle: 'elegant',
        dimensions: { width: 1056, height: 816 }, // Landscape letter
        keywords: ['certificate', 'award', 'achievement', 'diploma', 'completion'],
        promptPath: 'archetypes/certificate.md',
    },
    // ═══════════════════════════════════════════════════════════════
    // IDENTITY
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'logo',
        name: 'Logo',
        description: 'Brand logo design',
        structure: 'identity',
        defaultStyle: 'minimal',
        dimensions: { width: 500, height: 500 },
        keywords: ['logo', 'brand', 'identity', 'mark', 'icon'],
        promptPath: 'archetypes/logo.md',
    },
    // ═══════════════════════════════════════════════════════════════
    // MULTI-PAGE
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'study-guide',
        name: 'Study Guide',
        description: 'Educational study material',
        structure: 'multi-page',
        defaultStyle: 'minimal',
        keywords: ['study', 'guide', 'notes', 'education', 'learning', 'course'],
        promptPath: 'archetypes/study-guide.md',
    },
];
/**
 * Detect archetype from user prompt
 * Uses keyword matching to identify the most likely design type
 */
export function detectArchetype(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    // Score each archetype based on keyword matches
    const scores = archetypes.map(archetype => {
        let score = 0;
        for (const keyword of archetype.keywords) {
            if (lowerPrompt.includes(keyword)) {
                // Longer keywords are more specific, so weight them higher
                score += keyword.length;
            }
        }
        return { archetype, score };
    });
    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);
    // Return the highest scoring archetype, or default to presentation
    if (scores[0].score > 0) {
        return scores[0].archetype;
    }
    // Default to presentation if no match
    return archetypes.find(a => a.id === 'presentation');
}
/**
 * Get archetype by ID
 */
export function getArchetype(id) {
    return archetypes.find(a => a.id === id);
}
/**
 * Get all archetype IDs
 */
export function getArchetypeIds() {
    return archetypes.map(a => a.id);
}
