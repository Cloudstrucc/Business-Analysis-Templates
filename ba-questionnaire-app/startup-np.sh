#!/bin/bash
# ============================================================
# Cloudstrucc BA Forms - Azure App Service Startup Script
# Version: 2.0 (with node_modules pre-installed)
# ============================================================

echo "=========================================="
echo "Cloudstrucc BA Forms - Starting App"
echo "=========================================="
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Working directory: $(pwd)"
echo "Environment: ${ENVIRONMENT:-production}"
echo ""

cd /home/site/wwwroot

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    echo "Creating data directory..."
    mkdir -p data
fi

# Check if node_modules exists and has packages
if [ -d "node_modules" ] && [ -f "node_modules/.package-lock.json" ]; then
    echo "✓ Dependencies already installed (node_modules exists)"
    echo "  Skipping npm install for faster startup"
    
    # Count modules for verification
    MODULE_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
    echo "  Found approximately $((MODULE_COUNT - 1)) packages"
else
    echo "⚠ node_modules not found or incomplete"
    echo "Installing dependencies..."
    npm install --production --omit=dev 2>&1 || {
        echo "⚠ npm install had issues, attempting recovery..."
        rm -rf node_modules
        npm install --production --omit=dev 2>&1
    }
fi

echo ""
echo "=========================================="
echo "Starting Node.js application..."
echo "=========================================="

# Use exec to replace the shell with node (proper signal handling)
exec node app.js