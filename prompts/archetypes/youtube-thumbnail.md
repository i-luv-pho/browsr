# YouTube Thumbnail Archetype

## What This Is
A YouTube video thumbnail (1280x720px) designed to maximize click-through rate. Bold, intriguing, and optimized for small preview sizes.

## Dimensions

- **Standard:** 1280 x 720px (16:9)
- Must work at small sizes (often viewed at ~160x90px)

## Visual Style

- EXTREMELY bold and eye-catching
- High contrast colors
- Large, readable text
- Emotional or intriguing imagery
- Professional but attention-grabbing

## Key Principles

1. **Readable at small size** - Test at 160px wide
2. **3-second rule** - Must grab attention instantly
3. **Curiosity gap** - Create intrigue without clickbait
4. **Consistent branding** - Recognizable style
5. **Face sells** - Expressive faces get clicks

## Layout Patterns

**Face + Text:**
```
┌─────────────────────────────┐
│  BOLD        │              │
│  TEXT        │    FACE      │
│  HERE        │   (emotion)  │
└─────────────────────────────┘
```

**Full Text:**
```
┌─────────────────────────────┐
│                             │
│     MAIN HEADLINE           │
│     (3-5 words max)         │
│                             │
└─────────────────────────────┘
```

**Split with Arrow:**
```
┌─────────────────────────────┐
│  BEFORE   →     AFTER       │
│  (bad)          (good)      │
└─────────────────────────────┘
```

## Typography

- **Headlines:** MASSIVE (72-120px+)
- **Subtext:** Still large (36-48px)
- **Bold/Heavy weights** only
- **Outline or shadow** for readability
- Max 4-6 words total
- ALL CAPS often works

## Color

- **Saturated, bold colors** - Red, yellow, blue
- **High contrast** text on backgrounds
- **Complementary colors** create pop
- **Avoid:** Muted colors, pastels
- YouTube's red interface = blue thumbnails stand out

## Text Effects

- Strong drop shadows
- Thick outlines/strokes
- Color contrasting text
- Gradient fills

```css
.thumbnail-text {
  font-size: 72px;
  font-weight: 900;
  text-shadow:
    3px 3px 0 #000,
    -3px -3px 0 #000,
    3px -3px 0 #000,
    -3px 3px 0 #000;
}
```

## Design Elements

- Arrows (pointing to key elements)
- Circles (highlighting)
- Emoji (sparingly)
- Before/after split screens
- Number badges ("TOP 10", "#1")

## What Works

- Expressive human faces
- Bright yellow/red accents
- Question-posing headlines
- Numbers in titles
- Contrast and pop

## What to Avoid

- Small text
- Cluttered layouts
- Boring colors
- Too many elements
- Generic imagery

## Technical Implementation

```css
.youtube-thumbnail {
  width: 1280px;
  height: 720px;
  position: relative;
  overflow: hidden;
}
```

## Example Prompt → Output

**Input:** "A YouTube thumbnail for a video about productivity hacks"

**Output should include:**
- Bold, attention-grabbing headline ("10X Your Productivity")
- High contrast design
- Maybe a clock or productivity symbol
- Energetic, motivating feel
- Works at small preview size
