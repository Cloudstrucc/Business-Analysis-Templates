#!/bin/bash
#
# dev.sh - Development server with auto-discovery of new form templates
#
# Usage:
#   ./scripts/dev.sh              Start dev server
#   ./scripts/dev.sh --watch      Start with file watching
#   ./scripts/dev.sh --reload     Just reload forms and exit
#   ./scripts/dev.sh --stats      Show form statistics
#
# When you add a new .md file to the root folder:
#   1. The file is automatically detected
#   2. Copied to templates/ directory  
#   3. Loaded into the database
#   4. Available in the admin panel
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

cd "$APP_DIR"

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     Cloudstrucc BA Questionnaire - Development Server        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}Created .env - please update with your settings${NC}"
    echo ""
fi

# Parse arguments
case "$1" in
    --reload|-r)
        echo -e "${BLUE}Reloading forms from markdown files...${NC}"
        echo ""
        node utils/formLoader.js
        echo -e "${GREEN}Done!${NC}"
        exit 0
        ;;
    --stats|-s)
        echo -e "${BLUE}Form Statistics:${NC}"
        echo ""
        node utils/formLoader.js --stats
        exit 0
        ;;
    --watch|-w)
        echo -e "${BLUE}Starting server with file watching...${NC}"
        echo ""
        echo -e "${YELLOW}Add new .md files to the root directory to auto-load them${NC}"
        echo ""
        
        # First, load all forms
        node utils/formLoader.js
        
        # Then start server with watch mode
        echo ""
        echo -e "${GREEN}Starting server on http://localhost:${PORT:-3000}${NC}"
        echo ""
        
        # Use nodemon if available, otherwise node
        if command -v nodemon &> /dev/null; then
            nodemon --watch "*.md" --watch "templates/*.md" --ext md,js,hbs app.js
        else
            echo -e "${YELLOW}Tip: Install nodemon for auto-restart: npm install -g nodemon${NC}"
            echo ""
            node app.js
        fi
        ;;
    --help|-h)
        echo "Usage: ./scripts/dev.sh [option]"
        echo ""
        echo "Options:"
        echo "  (none)      Start development server"
        echo "  --watch,-w  Start with file watching for new .md files"
        echo "  --reload,-r Reload forms from markdown files and exit"
        echo "  --stats,-s  Show form statistics"
        echo "  --help,-h   Show this help message"
        echo ""
        echo "Adding new forms:"
        echo "  1. Drop a .md file in the root directory"
        echo "  2. Run: ./scripts/dev.sh --reload"
        echo "  3. Or restart the server"
        echo ""
        exit 0
        ;;
    *)
        # Default: start server
        echo -e "${BLUE}Loading forms...${NC}"
        echo ""
        node utils/formLoader.js
        
        echo ""
        echo -e "${GREEN}Starting server...${NC}"
        echo ""
        echo -e "  Public Portal: ${CYAN}http://localhost:${PORT:-3000}${NC}"
        echo -e "  Admin Login:   ${CYAN}http://localhost:${PORT:-3000}/admin/login${NC}"
        echo ""
        echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
        echo ""
        
        node app.js
        ;;
esac
