#!/bin/bash
#
# deploy.sh - Deploy BA Questionnaire Portal to nginx server
#
# Usage:
#   ./scripts/deploy.sh                    Deploy to default server
#   ./scripts/deploy.sh user@server.com    Deploy to specific server
#   ./scripts/deploy.sh --setup            First-time server setup
#   ./scripts/deploy.sh --rollback         Rollback to previous version
#
# Prerequisites:
#   - SSH access to target server
#   - Node.js 18+ on target server
#   - nginx installed on target server
#   - PM2 installed on target server (npm install -g pm2)
#
# Configuration:
#   Edit the variables below or set environment variables
#

set -e

# ============================================================
# CONFIGURATION - Edit these for your server
# ============================================================

# Target server (can be overridden via command line or env var)
DEPLOY_SERVER="${DEPLOY_SERVER:-user@your-server.com}"

# Remote paths
REMOTE_APP_DIR="${REMOTE_APP_DIR:-/var/www/ba-forms}"
REMOTE_BACKUP_DIR="${REMOTE_BACKUP_DIR:-/var/www/ba-forms-backups}"

# PM2 app name
PM2_APP_NAME="${PM2_APP_NAME:-ba-forms}"

# Domain for nginx (optional - for setup)
DOMAIN="${DOMAIN:-forms.cloudstrucc.com}"

# ============================================================
# DO NOT EDIT BELOW THIS LINE
# ============================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

cd "$APP_DIR"

# Timestamp for backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        Cloudstrucc BA Questionnaire - Deployment             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Parse arguments
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Usage: ./scripts/deploy.sh [option|server]"
    echo ""
    echo "Options:"
    echo "  (none)           Deploy to \$DEPLOY_SERVER ($DEPLOY_SERVER)"
    echo "  user@server      Deploy to specific server"
    echo "  --setup          First-time server setup"
    echo "  --rollback       Rollback to previous version"
    echo "  --config         Show current configuration"
    echo "  --help,-h        Show this help"
    echo ""
    echo "Environment variables:"
    echo "  DEPLOY_SERVER    Target server (default: $DEPLOY_SERVER)"
    echo "  REMOTE_APP_DIR   App directory (default: $REMOTE_APP_DIR)"
    echo "  PM2_APP_NAME     PM2 process name (default: $PM2_APP_NAME)"
    echo "  DOMAIN           Domain name (default: $DOMAIN)"
    echo ""
    exit 0
fi

if [ "$1" == "--config" ]; then
    echo -e "${BLUE}Current Configuration:${NC}"
    echo ""
    echo "  DEPLOY_SERVER:    $DEPLOY_SERVER"
    echo "  REMOTE_APP_DIR:   $REMOTE_APP_DIR"
    echo "  REMOTE_BACKUP_DIR: $REMOTE_BACKUP_DIR"
    echo "  PM2_APP_NAME:     $PM2_APP_NAME"
    echo "  DOMAIN:           $DOMAIN"
    echo ""
    exit 0
fi

# Override server if provided
if [ -n "$1" ] && [[ "$1" != --* ]]; then
    DEPLOY_SERVER="$1"
fi

# Function to run remote commands
remote_exec() {
    ssh "$DEPLOY_SERVER" "$@"
}

# Function to show progress
show_step() {
    echo -e "\n${BLUE}▶ $1${NC}"
}

# ============================================================
# FIRST-TIME SETUP
# ============================================================
if [ "$1" == "--setup" ]; then
    echo -e "${YELLOW}First-time server setup${NC}"
    echo ""
    echo "Target: $DEPLOY_SERVER"
    echo ""
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi

    show_step "Creating directories..."
    remote_exec "sudo mkdir -p $REMOTE_APP_DIR $REMOTE_BACKUP_DIR"
    remote_exec "sudo chown \$(whoami):\$(whoami) $REMOTE_APP_DIR $REMOTE_BACKUP_DIR"

    show_step "Installing Node.js 18 (if needed)..."
    remote_exec "command -v node || curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"

    show_step "Installing PM2..."
    remote_exec "command -v pm2 || sudo npm install -g pm2"

    show_step "Creating nginx config..."
    NGINX_CONFIG="server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
        proxy_cache_bypass \\\$http_upgrade;
    }
}"

    echo "$NGINX_CONFIG" | remote_exec "sudo tee /etc/nginx/sites-available/ba-forms > /dev/null"
    remote_exec "sudo ln -sf /etc/nginx/sites-available/ba-forms /etc/nginx/sites-enabled/"
    remote_exec "sudo nginx -t && sudo systemctl reload nginx"

    show_step "Setting up PM2 startup..."
    remote_exec "pm2 startup systemd -u \$(whoami) --hp \$HOME | tail -1 | bash" || true

    echo -e "\n${GREEN}✓ Server setup complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run: ./scripts/deploy.sh"
    echo "  2. Configure SSL: sudo certbot --nginx -d $DOMAIN"
    echo "  3. Update .env on server with production values"
    echo ""
    exit 0
fi

# ============================================================
# ROLLBACK
# ============================================================
if [ "$1" == "--rollback" ]; then
    echo -e "${YELLOW}Rolling back to previous version...${NC}"
    echo ""
    
    show_step "Listing available backups..."
    BACKUPS=$(remote_exec "ls -1t $REMOTE_BACKUP_DIR 2>/dev/null | head -5" || echo "")
    
    if [ -z "$BACKUPS" ]; then
        echo -e "${RED}No backups found!${NC}"
        exit 1
    fi
    
    echo "Available backups:"
    echo "$BACKUPS" | nl
    echo ""
    read -p "Select backup number (1-5): " BACKUP_NUM
    
    SELECTED_BACKUP=$(echo "$BACKUPS" | sed -n "${BACKUP_NUM}p")
    
    if [ -z "$SELECTED_BACKUP" ]; then
        echo -e "${RED}Invalid selection${NC}"
        exit 1
    fi
    
    echo ""
    echo "Rolling back to: $SELECTED_BACKUP"
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    
    show_step "Stopping app..."
    remote_exec "pm2 stop $PM2_APP_NAME" || true
    
    show_step "Restoring backup..."
    remote_exec "rm -rf $REMOTE_APP_DIR/*"
    remote_exec "tar -xzf $REMOTE_BACKUP_DIR/$SELECTED_BACKUP -C $REMOTE_APP_DIR"
    
    show_step "Starting app..."
    remote_exec "cd $REMOTE_APP_DIR && pm2 start $PM2_APP_NAME"
    
    echo -e "\n${GREEN}✓ Rollback complete!${NC}"
    exit 0
fi

# ============================================================
# MAIN DEPLOYMENT
# ============================================================

echo "Deploying to: $DEPLOY_SERVER"
echo "App directory: $REMOTE_APP_DIR"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Pre-flight checks
show_step "Running pre-flight checks..."

if ! ssh -q "$DEPLOY_SERVER" exit 2>/dev/null; then
    echo -e "${RED}Cannot connect to $DEPLOY_SERVER${NC}"
    echo "Check your SSH configuration."
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo -e "${RED}Not in app directory - package.json not found${NC}"
    exit 1
fi

# Create backup
show_step "Creating backup on server..."
remote_exec "mkdir -p $REMOTE_BACKUP_DIR"
remote_exec "cd $REMOTE_APP_DIR && tar -czf $REMOTE_BACKUP_DIR/backup_$TIMESTAMP.tar.gz . 2>/dev/null" || true

# Clean old backups (keep last 5)
remote_exec "cd $REMOTE_BACKUP_DIR && ls -t | tail -n +6 | xargs -r rm"

# Load new forms locally first
show_step "Loading forms from markdown files..."
node utils/formLoader.js

# Build deployment package
show_step "Creating deployment package..."
DEPLOY_PACKAGE="/tmp/ba-forms-deploy-$TIMESTAMP.tar.gz"

tar -czf "$DEPLOY_PACKAGE" \
    --exclude='node_modules' \
    --exclude='data' \
    --exclude='.env' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    .

# Upload package
show_step "Uploading to server..."
scp "$DEPLOY_PACKAGE" "$DEPLOY_SERVER:/tmp/"

# Deploy on server
show_step "Deploying on server..."
remote_exec "
    cd $REMOTE_APP_DIR

    # Extract new files (preserve data and .env)
    tar -xzf /tmp/$(basename $DEPLOY_PACKAGE) --exclude='data' --exclude='.env'

    # Install dependencies
    npm ci --production

    # Create data directory if needed
    mkdir -p data

    # Load forms
    node utils/formLoader.js

    # Restart app
    pm2 restart $PM2_APP_NAME || pm2 start app.js --name $PM2_APP_NAME

    # Save PM2 config
    pm2 save

    # Cleanup
    rm /tmp/$(basename $DEPLOY_PACKAGE)
"

# Cleanup local temp file
rm -f "$DEPLOY_PACKAGE"

# Verify deployment
show_step "Verifying deployment..."
sleep 2

HEALTH_CHECK=$(remote_exec "curl -s http://localhost:3000/health" || echo "{}")
if echo "$HEALTH_CHECK" | grep -q '"status":"ok"'; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${YELLOW}⚠ Health check failed - check server logs${NC}"
    remote_exec "pm2 logs $PM2_APP_NAME --lines 20"
fi

echo -e "\n${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Deployment complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "  App URL:    https://$DOMAIN"
echo "  Server:     $DEPLOY_SERVER"
echo "  Directory:  $REMOTE_APP_DIR"
echo "  Backup:     $REMOTE_BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
echo ""
echo "Useful commands:"
echo "  pm2 logs $PM2_APP_NAME     View logs"
echo "  pm2 restart $PM2_APP_NAME  Restart app"
echo "  pm2 status                 Check status"
echo ""
