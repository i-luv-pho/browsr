# Event Poster Archetype

## What This Is
A promotional poster for events, concerts, parties, or announcements. Eye-catching, informative, and designed to be viewed from a distance.

## Dimensions

- **Standard Poster:** 18" x 24" (portrait)
- **Large Poster:** 24" x 36"
- **Digital:** 1080 x 1920px (9:16 for stories/screens)

Default to portrait orientation unless specified.

## Visual Style

- Bold and impactful
- Visible from distance
- Clear hierarchy
- Memorable visual identity
- Genre-appropriate aesthetics

## Essential Information

1. **What** - Event name/title (BIGGEST)
2. **When** - Date and time
3. **Where** - Venue/location
4. **Who** - Performers, speakers, hosts
5. **How** - Tickets, registration, cost
6. **Action** - QR code, website, call to action

## Layout Patterns

**Classic Concert:**
```
┌──────────────────┐
│                  │
│   EVENT TITLE    │
│   (massive)      │
│                  │
│   Featured       │
│   Artist/Speaker │
│                  │
│   Date • Time    │
│   Venue          │
│                  │
│   [QR] tickets   │
└──────────────────┘
```

**Image-Focused:**
```
┌──────────────────┐
│                  │
│   MAIN IMAGE     │
│   or GRAPHIC     │
│                  │
├──────────────────┤
│   EVENT TITLE    │
│   Details        │
└──────────────────┘
```

## Typography

- Event title: HUGE (100-200px+)
- Key details: Large (36-48px)
- Secondary info: Readable (24-32px)
- Fine print: Small but legible (14-18px)

## Color Strategies

**By Event Type:**
- Music/Party: Bold, neon, gradients
- Professional/Conference: Sophisticated, restrained
- Community/Fundraiser: Warm, welcoming
- Art/Gallery: Minimal, artistic
- Sports: Energetic, team colors

## Visual Elements

- Strong typography as graphic element
- Abstract shapes and patterns
- Relevant imagery/illustrations
- Gradient backgrounds
- Geometric elements

## Design Principles

1. **Hierarchy** - Eye flows naturally through info
2. **Contrast** - Key info stands out
3. **Balance** - Not too top or bottom heavy
4. **Breathing room** - Don't cram everything
5. **Focus** - One clear focal point

## Print Considerations

```css
@page {
  size: 18in 24in;
  margin: 0;
}

@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

## Example Prompt → Output

**Input:** "A poster for a summer music festival featuring electronic music"

**Output should include:**
- Festival name as bold typographic element
- Dates prominently displayed
- Lineup of artists
- Venue/location
- Ticket info or QR code
- Summer/electronic music aesthetic (vibrant, modern)
