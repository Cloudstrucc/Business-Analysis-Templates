#!/bin/bash
#
# reload-forms.sh - Quick reload of form templates
#
# Just drop a new .md file in the root directory and run this script!
#
# Usage:
#   ./scripts/reload-forms.sh
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

cd "$APP_DIR"

echo ""
echo "🔄 Reloading form templates..."
echo ""

node utils/formLoader.js

echo ""
echo "✅ Done! Restart the server to see changes (or it will auto-detect on next request)"
echo ""
