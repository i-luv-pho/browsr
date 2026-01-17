# browsr Build Plan

## Phase 1: Project Setup - COMPLETE
- [x] Create package.json with name "browsr", bin entry, dependencies
- [x] Create CLI structure with commander setup
- [x] Create src/ module structure
- [x] Add archetypes system
- [x] Test: CLI help works

## Phase 2: Core Generation - COMPLETE
- [x] Create src/engine/generator.ts with Claude API integration
- [x] Create prompts/system.md master prompt for HTML generation
- [x] Implement basic generation flow: input → Claude → HTML output
- [x] Save output to file with smart naming
- [x] HTML validation and extraction

## Phase 3: Preview System - COMPLETE
- [x] Create src/cli/commands/preview.ts with express server
- [x] Implement --preview flag to open HTML in browser

## Phase 4: Archetype System - PARTIAL
- [x] Create src/archetypes/index.ts with archetype definitions (15 done)
- [x] Add "types" command to list all archetypes
- [x] Implement archetype detection from user prompt (keyword matching)
- [ ] Expand archetypes to 40 total (currently 15)
- [ ] Add remaining 25 archetypes: landing-page, linkedin-banner, twitter-post, facebook-cover, pinterest-pin, newsletter, menu, invoice, invitation, save-the-date, thank-you-card, meme, podcast-cover, album-cover, book-cover, magazine-cover, brochure, letterhead, report-cover, whitepaper, case-study, one-pager, comparison-chart, timeline, org-chart

## Phase 5: Template Examples (10 Core) - NOT STARTED
- [ ] Create templates/presentation.html (premium multi-slide example)
- [ ] Create templates/resume.html (clean, ATS-friendly)
- [ ] Create templates/poster.html (event poster)
- [ ] Create templates/instagram-post.html (1080x1080)
- [ ] Create templates/youtube-thumbnail.html (1280x720)
- [ ] Create templates/infographic.html (data visualization)
- [ ] Create templates/flyer.html (promotional)
- [ ] Create templates/business-card.html (front/back)
- [ ] Create templates/logo.html (SVG-based)
- [ ] Create templates/portfolio.html (personal site)

## Phase 6: Polish - PARTIAL
- [x] Add colorful CLI output with chalk
- [x] Add progress spinner during generation with ora
- [x] Add error handling with helpful messages
- [ ] Update README.md with full usage examples and all 40 archetypes
- [ ] Test full flow end-to-end with 5 different archetypes

## Phase 7: Final Verification
- [ ] Run: `npm run dev "pitch deck for AI startup"` - verify quality
- [ ] Run: `npm run dev "resume for software engineer"` - verify quality
- [ ] Run: `npm run dev preview` on output - verify browser opens
- [ ] Run: `npm run dev types` - verify shows all 40 archetypes
- [ ] Verify README has clear installation and usage instructions
- [ ] All code is clean, commented where needed

EXIT_SIGNAL: false
