# Business Card Archetype

## What This Is
A professional contact card for networking. Standard dimensions, clean design, essential information only.

## Dimensions

- **Standard:** 3.5" x 2" (350 x 200px at 100dpi)
- **Orientation:** Horizontal preferred
- **Safe zone:** Keep important content 0.125" from edges

## Structure

**Essential Elements:**
1. **Name** - Full name, prominently displayed
2. **Title** - Job title or role
3. **Company** - Company name/logo
4. **Contact** - Phone, email, website
5. **Optional** - Social handles, QR code

## Layout Patterns

**Classic Left-Aligned:**
```
┌─────────────────────────────┐
│  COMPANY LOGO               │
│                             │
│  Full Name                  │
│  Job Title                  │
│                             │
│  email@example.com          │
│  (555) 123-4567             │
│  website.com                │
└─────────────────────────────┘
```

**Centered:**
```
┌─────────────────────────────┐
│                             │
│       FULL NAME             │
│       Job Title             │
│                             │
│    email@example.com        │
│      (555) 123-4567         │
│                             │
└─────────────────────────────┘
```

**Split:**
```
┌─────────────────────────────┐
│ LOGO    │    Full Name      │
│         │    Job Title      │
│         │                   │
│         │    email          │
│         │    phone          │
└─────────────────────────────┘
```

## Typography

- Name: 12-16pt, bold
- Title: 8-10pt, regular
- Contact info: 7-9pt
- High readability fonts only
- No more than 2 font families

## Color

- Keep it simple (1-2 colors)
- Ensure high contrast for text
- White or off-white background preferred
- Color can be used for accents

## Design Principles

1. **Less is more** - Only essential information
2. **Hierarchy** - Name is most prominent
3. **White space** - Don't crowd the card
4. **Consistency** - Match brand guidelines
5. **Readability** - Small text must be clear

## Print Considerations

```css
@page {
  size: 3.5in 2in;
  margin: 0;
}

body {
  font-size: 10pt;
  -webkit-print-color-adjust: exact;
}
```

## What to Avoid

- Too much information
- Tiny, unreadable text
- Cluttered design
- Poor quality logo reproduction
- Hard to read font combinations

## Example Prompt → Output

**Input:** "A business card for a tech startup CEO"

**Output should include:**
- Clean, modern design
- Name and CEO title
- Startup name/branding
- Professional contact details
- Tech-forward aesthetic
