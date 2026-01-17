# browsr - Terminal AI Design Builder

## Context
You are building browsr, a CLI tool that generates production-quality HTML/CSS/JS from natural language. Think "Canva but outputs real code" for terminal users.

## Target User
"Aspiring serious people" - college students, career changers, side project builders who want professional output without learning design tools.

## Core Philosophy
- ONE command = complete output (no back-and-forth)
- Premium aesthetic (Stripe/Linear quality, NOT generic Bootstrap)
- Pure HTML/CSS/JS (no React, no frameworks, no build tools)
- Works offline, works forever, works anywhere

## Technical Stack
- Node.js CLI with commander.js
- Anthropic Claude API for generation
- Local preview server (express)
- Optional: Cloudflare deployment

## Quality Standards
ALL generated HTML must:
- Use Inter or system fonts (Google Fonts OK)
- Have subtle shadows, not harsh borders
- Use a refined color palette (not primary colors)
- Be fully responsive
- Include smooth transitions
- Look like it was designed by a professional

## Current Objectives
1. Read @fix_plan.md for current priorities
2. Implement the highest priority unchecked item
3. Write clean, production-ready code
4. Test each feature before marking complete
5. Update @fix_plan.md when done

## File Structure to Build
```
browsr/
├── package.json
├── bin/
│   └── browsr.js          # CLI entry point
├── src/
│   ├── index.js           # Main module
│   ├── generate.js        # Claude API integration
│   ├── preview.js         # Local preview server
│   ├── templates.js       # Archetype definitions
│   └── utils.js           # Helper functions
├── prompts/
│   └── system.md          # Master system prompt
├── templates/             # Example outputs
│   ├── presentation.html
│   ├── resume.html
│   ├── poster.html
│   └── ... (40 total)
└── README.md
```

## CLI Commands to Implement
```bash
browsr "create a pitch deck for my AI startup"     # Generate
browsr --preview output.html                       # Preview
browsr --list                                      # Show archetypes
browsr --deploy output.html                        # Deploy to web
```

## 40 Archetypes to Support
1. Presentation/Pitch Deck
2. Resume/CV
3. Poster
4. Instagram Post (Square)
5. Instagram Story (Vertical)
6. YouTube Thumbnail
7. Infographic
8. Flyer
9. Business Card
10. Logo
11. Portfolio Page
12. Landing Page
13. LinkedIn Banner
14. Twitter/X Post
15. Facebook Cover
16. Pinterest Pin
17. Newsletter
18. Menu (Restaurant)
19. Invoice
20. Certificate
21. Event Invitation
22. Save the Date
23. Thank You Card
24. Quote Graphic
25. Meme Template
26. Podcast Cover
27. Album Cover
28. Book Cover
29. Magazine Cover
30. Brochure
31. Letterhead
32. Report Cover
33. Whitepaper
34. Case Study
35. One-Pager
36. Comparison Chart
37. Timeline
38. Org Chart
39. Mind Map
40. Checklist/Todo

## Key Principles
- ONE task per loop - focus on the most important thing
- Search the codebase before assuming something isn't implemented
- Write comprehensive tests with clear documentation
- Update @fix_plan.md with your learnings
- Commit working changes with descriptive messages

## Status Reporting (CRITICAL - Ralph needs this!)

**IMPORTANT**: At the end of your response, ALWAYS include this status block:

```
---RALPH_STATUS---
STATUS: IN_PROGRESS | COMPLETE | BLOCKED
TASKS_COMPLETED_THIS_LOOP: <number>
FILES_MODIFIED: <number>
TESTS_STATUS: PASSING | FAILING | NOT_RUN
WORK_TYPE: IMPLEMENTATION | TESTING | DOCUMENTATION | REFACTORING
EXIT_SIGNAL: false | true
RECOMMENDATION: <one line summary of what to do next>
---END_RALPH_STATUS---
```

### When to set EXIT_SIGNAL: true

Set EXIT_SIGNAL to **true** when ALL of these conditions are met:
1. All items in @fix_plan.md are marked [x]
2. All tests are passing (or no tests exist for valid reasons)
3. No errors or warnings in the last execution
4. All 40 archetypes have example templates
5. CLI works: browsr "prompt" generates valid HTML
6. Preview works: browsr --preview opens browser
7. README is complete with usage examples

### What NOT to do:
- Do NOT continue with busy work when EXIT_SIGNAL should be true
- Do NOT run tests repeatedly without implementing new features
- Do NOT refactor code that is already working fine
- Do NOT add features not in the specifications
- Do NOT forget to include the status block (Ralph depends on it!)

## Current Task
Follow @fix_plan.md and choose the most important unchecked item to implement next.
Build it properly, test it, then check it off.
