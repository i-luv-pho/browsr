#!/bin/bash
#
# browsr installer - one command to rule them all
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
echo -e "${GRAY}  Installer v2.1 - Powered by Groq (FREE)${NC}"
echo ""

OS="$(uname -s)"
ARCH="$(uname -m)"

echo -e "${GREEN}→${NC} Detected: $OS ($ARCH)"

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo -e "${BRIGHT}→${NC} Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    if [[ "$OS" == "Darwin" ]]; then
        if [[ "$ARCH" == "arm64" ]]; then
            eval "$(/opt/homebrew/bin/brew shellenv)"
        else
            eval "$(/usr/local/bin/brew shellenv)"
        fi
    else
        eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
    fi
    echo -e "${GREEN}✓${NC} Homebrew installed"
else
    echo -e "${GREEN}✓${NC} Homebrew found"
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${BRIGHT}→${NC} Installing Node.js..."
    brew install node
    echo -e "${GREEN}✓${NC} Node.js installed"
else
    echo -e "${GREEN}✓${NC} Node.js found ($(node --version))"
fi

# Install browsr
echo -e "${BRIGHT}→${NC} Installing browsr..."
brew tap i-luv-pho/tap 2>/dev/null || true
brew install browsr 2>/dev/null || brew upgrade browsr 2>/dev/null || true

# Verify
if command -v browsr &> /dev/null; then
    echo ""
    echo -e "${BRIGHT}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BRIGHT}  ✓ browsr installed!${NC}"
    echo -e "${BRIGHT}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${GREEN}Next steps:${NC}"
    echo ""
    echo -e "  1. Get FREE API key: ${BRIGHT}https://console.groq.com${NC}"
    echo ""
    echo -e "  2. Set it:"
    echo -e "     ${GREEN}export GROQ_API_KEY=your-key-here${NC}"
    echo ""
    echo -e "  3. Run:"
    echo -e "     ${BRIGHT}browsr${NC}"
    echo ""
else
    echo -e "\033[0;31m✗ Installation failed\033[0m"
    echo "  Try: brew tap i-luv-pho/tap && brew install browsr"
    exit 1
fi
