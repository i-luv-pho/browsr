#!/bin/bash
#
# browsr installer - one command to rule them all
# curl -fsSL https://raw.githubusercontent.com/i-luv-pho/browsr/main/install.sh | bash
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                               ║${NC}"
echo -e "${CYAN}║   ██████╗ ██████╗  ██████╗ ██╗    ██╗███████╗██████╗         ║${NC}"
echo -e "${CYAN}║   ██╔══██╗██╔══██╗██╔═══██╗██║    ██║██╔════╝██╔══██╗        ║${NC}"
echo -e "${CYAN}║   ██████╔╝██████╔╝██║   ██║██║ █╗ ██║███████╗██████╔╝        ║${NC}"
echo -e "${CYAN}║   ██╔══██╗██╔══██╗██║   ██║██║███╗██║╚════██║██╔══██╗        ║${NC}"
echo -e "${CYAN}║   ██████╔╝██║  ██║╚██████╔╝╚███╔███╔╝███████║██║  ██║        ║${NC}"
echo -e "${CYAN}║   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝        ║${NC}"
echo -e "${CYAN}║                                                               ║${NC}"
echo -e "${CYAN}║   One-click installer                                         ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Detect OS
OS="$(uname -s)"
ARCH="$(uname -m)"

echo -e "${CYAN}→${NC} Detected: $OS ($ARCH)"

# Check for Homebrew (macOS/Linux)
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}→${NC} Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Add brew to PATH for this session
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
    echo -e "${YELLOW}→${NC} Node.js not found. Installing..."
    brew install node
    echo -e "${GREEN}✓${NC} Node.js installed"
else
    echo -e "${GREEN}✓${NC} Node.js found ($(node --version))"
fi

# Add the browsr tap and install
echo -e "${CYAN}→${NC} Adding browsr tap..."
brew tap i-luv-pho/tap 2>/dev/null || true

echo -e "${CYAN}→${NC} Installing browsr..."
brew install browsr 2>/dev/null || brew upgrade browsr 2>/dev/null || true

# Verify installation
if command -v browsr &> /dev/null; then
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✓ browsr installed successfully!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  Run ${CYAN}browsr${NC} to start designing"
    echo ""
    echo -e "  ${YELLOW}Note:${NC} You'll need an Anthropic API key"
    echo -e "  Get one at: ${CYAN}https://console.anthropic.com${NC}"
    echo -e "  Then run: ${CYAN}export ANTHROPIC_API_KEY=your-key${NC}"
    echo ""
else
    echo -e "${RED}✗ Installation failed${NC}"
    echo "  Try manual install: brew tap i-luv-pho/tap && brew install browsr"
    exit 1
fi
