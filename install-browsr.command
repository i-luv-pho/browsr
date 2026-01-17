#!/bin/bash
#
# browsr installer - double-click to run
# Installs Homebrew, Node.js, and browsr automatically
#

# Keep terminal open on error
trap 'echo ""; echo "Press any key to close..."; read -n 1' EXIT

set -e

clear

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
echo -e "${CYAN}║   Installer - Setting up everything for you                   ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Detect OS
OS="$(uname -s)"
ARCH="$(uname -m)"

echo -e "${CYAN}[1/4]${NC} Checking system..."
echo -e "       Detected: $OS ($ARCH)"
sleep 1

# Check for Homebrew (macOS/Linux)
echo ""
echo -e "${CYAN}[2/4]${NC} Checking Homebrew..."
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}       Homebrew not found. Installing...${NC}"
    echo -e "${YELLOW}       This may ask for your password.${NC}"
    echo ""
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Add brew to PATH for this session
    if [[ "$OS" == "Darwin" ]]; then
        if [[ "$ARCH" == "arm64" ]]; then
            eval "$(/opt/homebrew/bin/brew shellenv)"
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        else
            eval "$(/usr/local/bin/brew shellenv)"
        fi
    else
        eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
    fi
    echo -e "${GREEN}       Homebrew installed!${NC}"
else
    echo -e "${GREEN}       Homebrew found!${NC}"
fi

# Check for Node.js
echo ""
echo -e "${CYAN}[3/4]${NC} Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}       Node.js not found. Installing...${NC}"
    brew install node
    echo -e "${GREEN}       Node.js installed!${NC}"
else
    echo -e "${GREEN}       Node.js found! ($(node --version))${NC}"
fi

# Install browsr
echo ""
echo -e "${CYAN}[4/4]${NC} Installing browsr..."
brew tap i-luv-pho/tap 2>/dev/null || true
brew install browsr 2>/dev/null || brew upgrade browsr 2>/dev/null || true

# Verify installation
echo ""
if command -v browsr &> /dev/null; then
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}                                                               ${NC}"
    echo -e "${GREEN}   SUCCESS! browsr is ready to use                             ${NC}"
    echo -e "${GREEN}                                                               ${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "   ${CYAN}To start:${NC}"
    echo -e "   1. Open Terminal"
    echo -e "   2. Type: ${CYAN}browsr${NC}"
    echo ""
    echo -e "   ${YELLOW}Note:${NC} You'll need an Anthropic API key"
    echo -e "   Get one at: ${CYAN}https://console.anthropic.com${NC}"
    echo ""
    echo -e "   Then set it with:"
    echo -e "   ${CYAN}export ANTHROPIC_API_KEY=your-key-here${NC}"
    echo ""
else
    echo -e "${RED}Installation failed. Please try the manual install:${NC}"
    echo "   brew tap i-luv-pho/tap && brew install browsr"
fi
