# Instagram Post Archetype

## What This Is
A square (1080x1080px) social media graphic optimized for Instagram feed posts. Eye-catching, shareable, and on-brand.

## Dimensions

- **Standard Post:** 1080 x 1080px (1:1 square)
- **Portrait Post:** 1080 x 1350px (4:5)
- **Landscape:** 1080 x 566px (1.91:1)

Default to square unless specified otherwise.

## Visual Style

- Bold and eye-catching
- Works at thumbnail size
- Strong visual hierarchy
- Limited text (Instagram penalizes text-heavy images)
- Modern, trendy aesthetics

## Layout Patterns

**Centered:**
```
┌────────────────┐
│                │
│    HEADLINE    │
│    subtext     │
│                │
└────────────────┘
```

**Split:**
```
┌────────────────┐
│   VISUAL       │
│   AREA         │
├────────────────┤
│   TEXT AREA    │
└────────────────┘
```

**Quote:**
```
┌────────────────┐
│                │
│  "Quote text   │
│   goes here"   │
│                │
│   — Author     │
└────────────────┘
```

## Typography

- Headlines: Large, bold (48-80px)
- Subtext: Smaller, lighter (24-36px)
- Max 2 font styles
- High contrast for readability
- Consider mobile viewing size

## Color

- Bold, saturated colors work best
- High contrast backgrounds
- Gradient backgrounds are popular
- Ensure text is always readable
- Consider Instagram's aesthetic

## Design Elements

- Geometric shapes
- Bold typography
- Photo overlays with gradients
- Minimal icons if needed
- Strong visual anchor

## Content Types

1. **Quote posts** - Inspirational or thought-provoking quotes
2. **Announcement** - New product, event, sale
3. **Tips/Lists** - "5 ways to..." format
4. **Behind the scenes** - Personal, authentic content
5. **Promotional** - Product features, benefits

## Technical Implementation

```css
.instagram-post {
  width: 1080px;
  height: 1080px;
  /* Scale down for preview */
  transform: scale(0.5);
  transform-origin: top left;
}
```

## Avoid

- Too much text (Instagram may reduce reach)
- Small fonts (illegible on mobile)
- Cluttered layouts
- Low contrast
- Generic stock photo looks

## Example Prompt → Output

**Input:** "An Instagram post announcing a new product launch for a skincare brand"

**Output should include:**
- Bold, attention-grabbing headline
- Clean product-focused design
- Brand-appropriate color scheme
- Minimal but impactful text
- Professional, aspirational feel
