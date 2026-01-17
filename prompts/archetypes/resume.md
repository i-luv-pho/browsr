# Resume / CV Archetype

## What This Is
A professional resume/CV - clean, scannable, and optimized for both human readers and ATS (Applicant Tracking Systems).

## Structure

1. **Header** - Name, title, contact info
2. **Summary** (optional) - 2-3 sentence professional summary
3. **Experience** - Work history with bullet points
4. **Education** - Degrees, certifications
5. **Skills** - Technical and soft skills
6. **Projects** (optional) - Side projects, portfolio pieces

## Visual Style

- Ultra-clean and minimal
- Perfect alignment and spacing
- Easy to scan in 6 seconds
- Professional but not boring
- Subtle use of color (accents only)

## Layout

**Single column** (most ATS-friendly) or **Two-column** (more visual):

```
┌──────────────────────────────────┐
│          HEADER/NAME             │
├──────────────────────────────────┤
│         SUMMARY (opt)            │
├──────────────────────────────────┤
│         EXPERIENCE               │
│  • Job 1                         │
│  • Job 2                         │
├──────────────────────────────────┤
│         EDUCATION                │
├──────────────────────────────────┤
│          SKILLS                  │
└──────────────────────────────────┘
```

## Typography

- Name: 24-32px, bold
- Section headings: 14-16px, uppercase, letter-spaced
- Job titles: 14-16px, bold
- Company names: 14-16px, regular
- Body: 11-12px
- Line height: 1.4-1.5

## Color Palette

Keep it minimal:
- Black text on white background
- One accent color for section headings/lines
- Gray for secondary text (dates, etc.)

## Spacing

- Clear section separation
- Consistent margins (0.5-1 inch)
- Tight but readable line spacing
- White space between sections

## Print Considerations

- Standard letter size (8.5" x 11") or A4
- Print-safe fonts
- Good contrast for printing
- No background images

## Content Guidelines

- Action verbs for bullet points ("Led", "Developed", "Increased")
- Quantified achievements ("Increased revenue by 25%")
- Relevant keywords for the industry
- Most recent experience first

## Technical Implementation

```html
<style>
  @page {
    size: letter;
    margin: 0.5in;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; }
  }
</style>
```

Use print-friendly CSS for proper page sizing.

## Example Prompt → Output

**Input:** "A resume for a senior software engineer with 8 years experience"

**Output should include:**
- Professional header with name and contact
- Strong experience section with tech companies
- Relevant technical skills (languages, frameworks)
- Education in CS or related field
- Real-sounding (but fictional) achievements
