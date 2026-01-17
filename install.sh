#!/bin/bash
#
# browsr installer
# curl -fsSL https://raw.githubusercontent.com/i-luv-pho/browsr/main/install.sh | bash
#

set -e

GREEN='\033[0;32m'
BRIGHT='\033[1;32m'
GRAY='\033[0;90m'
NC='\033[0m'

echo ""
echo -e "${GREEN}  ██████╗ ██████╗  ██████╗ ██╗    ██╗███████╗██████╗${NC}"
echo -e "${GREEN}  ██╔══██╗██╔══██╗██╔═══██╗██║    ██║██╔════╝██╔══██╗${NC}"
echo -e "${GREEN}  ██████╔╝██████╔╝██║   ██║██║ █╗ ██║███████╗██████╔╝${NC}"
echo -e "${GREEN}  ██╔══██╗██╔══██╗██║   ██║██║███╗██║╚════██║██╔══██╗${NC}"
echo -e "${GREEN}  ██████╔╝██║  ██║╚██████╔╝╚███╔███╔╝███████║██║  ██║${NC}"
echo -e "${GREEN}  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝${NC}"
echo ""

OS="$(uname -s)"
ARCH="$(uname -m)"

echo -e "${GREEN}→${NC} Detected: $OS ($ARCH)"

# Homebrew
if ! command -v brew &> /dev/null; then
    echo -e "${BRIGHT}→${NC} Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    if [[ "$OS" == "Darwin" ]]; then
        [[ "$ARCH" == "arm64" ]] && eval "$(/opt/homebrew/bin/brew shellenv)" || eval "$(/usr/local/bin/brew shellenv)"
    else
        eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
    fi
fi
echo -e "${GREEN}✓${NC} Homebrew"

# Node.js
if ! command -v node &> /dev/null; then
    brew install node
fi
echo -e "${GREEN}✓${NC} Node.js"

# browsr
brew tap i-luv-pho/tap 2>/dev/null || true
brew install browsr 2>/dev/null || brew upgrade browsr 2>/dev/null || true
echo -e "${GREEN}✓${NC} browsr"

echo ""
echo -e "${BRIGHT}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BRIGHT}  Done! One more step:${NC}"
echo -e "${BRIGHT}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  1. Get FREE API key (30 sec): ${BRIGHT}https://console.groq.com${NC}"
echo -e "  2. Run: ${GREEN}export GROQ_API_KEY=your-key${NC}"
echo -e "  3. Run: ${BRIGHT}browsr${NC}"
echo ""
