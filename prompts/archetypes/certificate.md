# Certificate Archetype

## What This Is
A formal document recognizing an achievement, completion, or award. Professional, elegant, and suitable for framing.

## Dimensions

- **Standard:** Letter landscape (11" x 8.5")
- **A4 Landscape:** 297mm x 210mm
- **Orientation:** Landscape preferred

## Structure

1. **Header** - Organization name/logo
2. **Title** - "Certificate of Achievement/Completion/Excellence"
3. **Presentation line** - "This is to certify that" or similar
4. **Recipient name** - Large, prominent
5. **Achievement** - What they accomplished
6. **Details** - Date, course name, etc.
7. **Signatures** - Authorizing signatures
8. **Seal/Badge** - Official seal or emblem

## Layout Pattern

```
┌─────────────────────────────────────────────────┐
│                  ORGANIZATION                    │
│                                                  │
│         CERTIFICATE OF ACHIEVEMENT              │
│                                                  │
│           This is to certify that               │
│                                                  │
│              RECIPIENT NAME                      │
│                                                  │
│   has successfully completed the requirements   │
│        for [Course/Program/Achievement]         │
│                                                  │
│           Given this [date]                     │
│                                                  │
│  _______________     _______________    [SEAL]  │
│    Signature            Signature                │
│    Title                Title                    │
└─────────────────────────────────────────────────┘
```

## Typography

- Title: Elegant serif or script font, large (36-48pt)
- Recipient name: Bold, prominent (28-36pt)
- Body text: Clean serif (12-14pt)
- Signatures: Script or italic (10-12pt)

## Visual Style

- Formal and elegant
- Border or frame (decorative but not tacky)
- Gold, navy, burgundy color accents
- Classic, timeless aesthetic
- May include subtle watermark pattern

## Color Palette

- **Classic:** Navy, gold, cream
- **Academic:** Burgundy, gold, cream
- **Corporate:** Brand colors + gold/silver
- **Modern:** Minimal black/white with single accent

## Design Elements

- Decorative borders (subtle, not overwhelming)
- Flourishes or ornaments (restrained)
- Official seal or emblem
- Signature lines with titles
- Ribbon or badge graphic (optional)

## Print Considerations

```css
@page {
  size: letter landscape;
  margin: 0.5in;
}

@media print {
  body {
    -webkit-print-color-adjust: exact;
  }
}
```

## Credential Details

Include as appropriate:
- Certificate number/ID
- Date of issue
- Expiration date (if applicable)
- QR code for verification (optional)
- Credential level or grade

## Example Prompt → Output

**Input:** "A certificate for completing a web development bootcamp"

**Output should include:**
- Bootcamp name/logo
- "Certificate of Completion"
- Student name placeholder
- Course name and duration
- Date of completion
- Instructor signature line
- Professional, credible design
