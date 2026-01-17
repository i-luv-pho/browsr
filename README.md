# browsr

> AI-powered design generation that outputs real HTML/CSS/JS

browsr is a terminal-based tool that generates professional-quality designs from natural language. Unlike Canva or Figma, you get portable HTML/CSS code that works anywhere.

## Quick Install

```bash
# Clone the repo
git clone https://github.com/i-luv-pho/browsr.git
cd browsr

# Install dependencies
npm install

# Build the CLI
npm run build

# Install globally (so you can run 'browsr' from anywhere)
npm link

# Set your Anthropic API key
export ANTHROPIC_API_KEY="your-key-here"
# Add to ~/.zshrc or ~/.bashrc to make permanent
```

## Usage

```bash
# Generate designs - just describe what you want
browsr create "a pitch deck for my AI startup"
browsr create "a resume for a software engineer"
browsr create "an instagram post for product launch"
browsr create "a poster for a tech meetup"

# Specify type and style
browsr create "my background" -t resume -s minimal

# List all design types
browsr types

# Preview your design
browsr preview ./output

# Get help
browsr --help
```

## Design Types

| Type | Description |
|------|-------------|
| `pitch-deck` | Startup pitch deck for investors |
| `resume` | Professional resume/CV |
| `poster` | Event poster or promotional material |
| `instagram` | Instagram post (1080x1080) |
| `youtube-thumb` | YouTube thumbnail (1280x720) |
| `infographic` | Data visualization infographic |
| `flyer` | Event or promotional flyer |
| `business-card` | Professional business card |
| `logo` | Brand logo design |
| `portfolio` | Portfolio presentation |
| `study-guide` | Educational study guide |
| `flashcards` | Study flashcards |
| `research-poster` | Academic research poster |
| `quote` | Quote graphic for social media |
| `certificate` | Achievement certificate |

## Style Variants

| Style | Description |
|-------|-------------|
| `minimal` | Clean, lots of whitespace, subtle |
| `bold` | Strong colors, high contrast, impactful |
| `elegant` | Refined, serif fonts, sophisticated |
| `modern` | Gradients, glassmorphism, trendy |
| `professional` | Corporate, trustworthy, clean |

## Output

Designs are saved to `./output/index.html`. Just open in any browser.

## Requirements

- Node.js 18+
- Anthropic API key (get one at https://console.anthropic.com)

## Why browsr?

- **Real code** — HTML/CSS you own, not trapped in a proprietary format
- **Actually free** — No watermarks, no premium tier
- **One command** — Describe it, done
- **Premium quality** — Stripe/Linear-level design by default

---

Built for people who want to create like pros but aren't designers.
