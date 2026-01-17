# Infographic Archetype

## What This Is
A visual representation of data, information, or knowledge. Designed to make complex information easily digestible and shareable.

## Structure

**Top-down flow:**
1. **Header** - Title and brief intro
2. **Key Stats** - Eye-catching numbers
3. **Main Content** - Visual sections explaining the topic
4. **Supporting Data** - Charts, graphs, comparisons
5. **Conclusion** - Key takeaways
6. **Footer** - Source citations, branding

## Visual Style

- Clear visual hierarchy
- Data-driven design
- Icons and illustrations
- Color-coded sections
- Charts and graphs
- Minimal text, maximum impact

## Layout Patterns

**Vertical Flow:**
```
┌──────────────────┐
│     TITLE        │
├──────────────────┤
│   KEY STAT 1     │
│   KEY STAT 2     │
│   KEY STAT 3     │
├──────────────────┤
│   SECTION 1      │
│   [visual]       │
├──────────────────┤
│   SECTION 2      │
│   [chart]        │
├──────────────────┤
│   CONCLUSION     │
└──────────────────┘
```

## Typography

- Bold headlines for each section
- Minimal body text
- Large numbers for statistics
- Clear section labels

## Color

- Use color to group related information
- Color-code different categories
- Ensure sufficient contrast
- 3-5 color maximum

## Data Visualization

Use appropriate chart types:
- **Bar charts** - Comparisons
- **Pie/donut** - Parts of whole
- **Line charts** - Trends over time
- **Icons + numbers** - Key statistics
- **Progress bars** - Percentages

## Content Guidelines

- One main message
- 3-5 key statistics
- Short, scannable text
- Visual metaphors where possible
- Data should tell a story

## Technical Implementation

```css
.infographic {
  max-width: 800px;
  margin: 0 auto;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-primary);
}
```

## Example Prompt → Output

**Input:** "An infographic about the benefits of remote work"

**Output should include:**
- Eye-catching statistics (productivity %, cost savings)
- Visual comparison of remote vs office
- Icons representing benefits
- Charts showing trends
- Clean, professional design
