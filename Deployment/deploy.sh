set -e

# ============================================================
# CONFIGURATION - Edit these for your deployment
# ============================================================

RESOURCE_GROUP="cloudstrucc-rg"
APP_SERVICE_PLAN="cloudstrucc-plan"
APP_NAME="cloudstrucc-ba-forms"
STORAGE_ACCOUNT="cloudstruccdata"
LOCATION="canadacentral"
APP_SERVICE_SKU="B1"

# Application Settings
ADMIN_EMAIL="admin@cloudstrucc.com"
ADMIN_PASSWORD="dpg613"
SMTP_HOST="smtp.office365.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""

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

# Get script and app directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
APP_DIR="$REPO_ROOT/ba-questionnaire-app"
QUESTIONNAIRES_DIR="$REPO_ROOT/Questionnaires"
TEMPLATES_DIR="$APP_DIR/templates"

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     Cloudstrucc BA Forms - Azure Deployment                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo "Script directory:       $SCRIPT_DIR"
echo "Repository root:        $REPO_ROOT"
echo "App directory:          $APP_DIR"
echo "Questionnaires folder:  $QUESTIONNAIRES_DIR"
echo "Templates folder:       $TEMPLATES_DIR"
echo ""

# Function to show progress
show_step() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}► $1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
}

show_substep() {
    echo -e "${CYAN}  → $1${NC}"
}

show_success() {
    echo -e "${GREEN}  ✓ $1${NC}"
}

show_warning() {
    echo -e "${YELLOW}  ⚠ $1${NC}"
}

show_error() {
    echo -e "${RED}  ✗ $1${NC}"
}

# ============================================================
# SYNC QUESTIONNAIRES - Copy MD files to templates folder
# ============================================================

sync_questionnaires() {
    show_step "Syncing Questionnaires to Templates"
    
    # Create templates directory if it doesn't exist
    mkdir -p "$TEMPLATES_DIR"
    
    # Check if Questionnaires folder exists
    if [ ! -d "$QUESTIONNAIRES_DIR" ]; then
        show_warning "Questionnaires folder not found at $QUESTIONNAIRES_DIR"
        show_substep "Skipping questionnaire sync"
        return
    fi
    
    # Count MD files
    MD_COUNT=$(find "$QUESTIONNAIRES_DIR" -maxdepth 1 -name "*.md" -type f | wc -l | tr -d ' ')
    
    if [ "$MD_COUNT" -eq 0 ]; then
        show_warning "No .md files found in $QUESTIONNAIRES_DIR"
        return
    fi
    
    show_substep "Found $MD_COUNT questionnaire(s) in Questionnaires folder"
    
    # Copy each MD file
    COPIED=0
    for file in "$QUESTIONNAIRES_DIR"/*.md; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            
            # Skip README files (case-insensitive check for macOS compatibility)
            filename_lower=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
            if [ "$filename_lower" == "readme.md" ]; then
                continue
            fi
            
            cp "$file" "$TEMPLATES_DIR/"
            echo "     Copied: $filename"
            COPIED=$((COPIED + 1))
        fi
    done
    
    show_success "Synced $COPIED questionnaire(s) to templates folder"
    
    # List templates
    echo ""
    echo "  Templates now available:"
    for file in "$TEMPLATES_DIR"/*.md; do
        if [ -f "$file" ]; then
            echo "     - $(basename "$file")"
        fi
    done
}

# ============================================================
# VALIDATE
# ============================================================

validate_setup() {
    # Verify app directory exists
    if [ ! -d "$APP_DIR" ]; then
        echo -e "${RED}Error: App directory not found at $APP_DIR${NC}"
        echo "Make sure you're running this from the Deployment folder"
        exit 1
    fi

    if [ ! -f "$APP_DIR/app.js" ]; then
        echo -e "${RED}Error: app.js not found in $APP_DIR${NC}"
        exit 1
    fi

    # Check Azure CLI is installed
    if ! command -v az &> /dev/null; then
        echo -e "${RED}Error: Azure CLI is not installed${NC}"
        echo "Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    fi

    # Check logged in
    if ! az account show &> /dev/null 2>&1; then
        echo -e "${YELLOW}Not logged in to Azure. Running 'az login'...${NC}"
        az login
    fi

    # Show current subscription
    echo -e "${BLUE}Azure Subscription:${NC}"
    az account show --query "{Name:name, ID:id}" -o table
    echo ""
}

# ============================================================
# HELP
# ============================================================

show_help() {
    echo "Usage: ./deploy.sh [option]"
    echo ""
    echo "Options:"
    echo "  (none)       Full deployment (setup + deploy)"
    echo "  --deploy     Deploy code only (resources must exist)"
    echo "  --setup      Create Azure resources only"
    echo "  --sync       Sync questionnaires to templates folder only"
    echo "  --logs       View live application logs"
    echo "  --ssh        SSH into the container"
    echo "  --restart    Restart the web app"
    echo "  --status     Check app status and health"
    echo "  --delete     Delete all Azure resources"
    echo "  --help       Show this help message"
    echo ""
    echo "Folder Structure:"
    echo "  Questionnaires/     Source .md files (edit here)"
    echo "  ba-questionnaire-app/templates/  Deployed .md files (auto-synced)"
    echo ""
    echo "Configuration (edit at top of script):"
    echo "  APP_NAME:          $APP_NAME"
    echo "  RESOURCE_GROUP:    $RESOURCE_GROUP"
    echo "  LOCATION:          $LOCATION"
    echo "  APP_SERVICE_SKU:   $APP_SERVICE_SKU"
    echo ""
    echo "App URL: https://$APP_NAME.azurewebsites.net"
    echo ""
    exit 0
}

# ============================================================
# STATUS CHECK
# ============================================================

check_status() {
    show_step "Checking Application Status"
    
    echo ""
    echo "Resource Group: $RESOURCE_GROUP"
    echo "App Name:       $APP_NAME"
    echo "App URL:        https://$APP_NAME.azurewebsites.net"
    echo ""
    
    show_substep "Checking if app exists..."
    if az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        show_success "App exists"
        
        # Get app state
        STATE=$(az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "state" -o tsv)
        echo "  State: $STATE"
        
        # Health check
        show_substep "Running health check..."
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$APP_NAME.azurewebsites.net/health" 2>/dev/null || echo "000")
        
        if [ "$HTTP_STATUS" == "200" ]; then
            show_success "Health check passed (HTTP $HTTP_STATUS)"
            curl -s "https://$APP_NAME.azurewebsites.net/health" | python3 -m json.tool 2>/dev/null || true
        else
            show_warning "Health check returned HTTP $HTTP_STATUS"
        fi
    else
        show_warning "App does not exist"
    fi
    
    exit 0
}

# ============================================================
# VIEW LOGS
# ============================================================

view_logs() {
    show_step "Streaming Logs from $APP_NAME"
    echo "Press Ctrl+C to stop"
    echo ""
    az webapp log tail \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP"
    exit 0
}

# ============================================================
# SSH
# ============================================================

connect_ssh() {
    show_step "Connecting to $APP_NAME via SSH"
    az webapp ssh \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP"
    exit 0
}

# ============================================================
# RESTART
# ============================================================

restart_app() {
    show_step "Restarting $APP_NAME"
    az webapp restart \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP"
    show_success "App restarted"
    
    echo ""
    echo "Waiting 10 seconds for app to start..."
    sleep 10
    
    # Health check
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$APP_NAME.azurewebsites.net/health" 2>/dev/null || echo "000")
    if [ "$HTTP_STATUS" == "200" ]; then
        show_success "Health check passed"
    else
        show_warning "Health check returned HTTP $HTTP_STATUS - app may still be starting"
    fi
    
    exit 0
}

# ============================================================
# DELETE
# ============================================================

delete_resources() {
    show_step "Delete Azure Resources"
    
    echo -e "${RED}WARNING: This will delete all Azure resources!${NC}"
    echo ""
    echo "Resources to be deleted:"
    echo "  - Resource Group: $RESOURCE_GROUP"
    echo "  - App Service: $APP_NAME"
    echo "  - App Service Plan: $APP_SERVICE_PLAN"
    echo "  - Storage Account: $STORAGE_ACCOUNT"
    echo ""
    read -p "Are you sure? Type 'DELETE' to confirm: " confirm
    
    if [ "$confirm" == "DELETE" ]; then
        echo ""
        show_substep "Deleting resource group (this may take a few minutes)..."
        az group delete --name "$RESOURCE_GROUP" --yes
        show_success "All resources deleted"
    else
        echo "Cancelled."
    fi
    
    exit 0
}

# ============================================================
# SETUP - Create Azure Resources
# ============================================================

setup_azure() {
    show_step "Step 1: Create Resource Group"
    show_substep "Creating $RESOURCE_GROUP in $LOCATION..."
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --output none
    show_success "Resource group created"

    show_step "Step 2: Create App Service Plan"
    show_substep "Creating $APP_SERVICE_PLAN ($APP_SERVICE_SKU)..."
    az appservice plan create \
        --name "$APP_SERVICE_PLAN" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku "$APP_SERVICE_SKU" \
        --is-linux \
        --output none
    show_success "App Service Plan created"

    show_step "Step 3: Create Web App"
    show_substep "Creating $APP_NAME with Node.js 20..."
    
    # Try creating with runtime
    if ! az webapp create \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --plan "$APP_SERVICE_PLAN" \
        --runtime "NODE:20-lts" \
        --output none 2>/dev/null; then
        
        show_warning "Runtime NODE:20-lts not available, trying alternative..."
        
        # Create without runtime, then set it
        az webapp create \
            --name "$APP_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --plan "$APP_SERVICE_PLAN" \
            --output none
        
        az webapp config set \
            --name "$APP_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --linux-fx-version "NODE|20-lts" \
            --output none 2>/dev/null || true
    fi
    show_success "Web App created"

    show_step "Step 4: Configure Application Settings"
    show_substep "Setting environment variables..."
    
    SESSION_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "fallback-secret-$(date +%s)-$(head -c 32 /dev/urandom | base64)")
    
    az webapp config appsettings set \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --settings \
            NODE_ENV="production" \
            PORT="8080" \
            SESSION_SECRET="$SESSION_SECRET" \
            ADMIN_EMAIL="$ADMIN_EMAIL" \
            ADMIN_PASSWORD="$ADMIN_PASSWORD" \
            SMTP_HOST="$SMTP_HOST" \
            SMTP_PORT="$SMTP_PORT" \
            SMTP_USER="$SMTP_USER" \
            SMTP_PASS="$SMTP_PASS" \
            BASE_URL="https://$APP_NAME.azurewebsites.net" \
            ANALYTICS_INTERVAL_HOURS="72" \
        --output none
    show_success "Application settings configured"

    show_step "Step 5: Set Startup Command"
    show_substep "Setting startup command..."
    az webapp config set \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --startup-file "/home/site/wwwroot/startup.sh" \
        --output none
    show_success "Startup command set"

    show_step "Step 6: Enable Logging"
    show_substep "Enabling application logging..."
    az webapp log config \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --application-logging filesystem \
        --level information \
        --output none
    show_success "Logging enabled"
}

# ============================================================
# DEPLOY - Deploy code to Azure
# ============================================================

deploy_code() {
    # First sync questionnaires from Questionnaires folder to templates
    sync_questionnaires
    
    show_step "Step 7: Create Deployment Package"
    
    cd "$APP_DIR"
    show_substep "Working directory: $(pwd)"
    
    # Create temp directory for package
    TEMP_DIR=$(mktemp -d)
    PACKAGE="$TEMP_DIR/deploy.zip"
    
    show_substep "Creating zip package..."
    zip -r "$PACKAGE" . \
        -x "node_modules/*" \
        -x ".git/*" \
        -x "data/*" \
        -x ".env" \
        -x "*.log" \
        -x ".DS_Store" \
        -x "deploy*.sh" \
        -x "deploy*.ps1" \
        > /dev/null
    
    PACKAGE_SIZE=$(du -h "$PACKAGE" | cut -f1)
    show_success "Package created: $PACKAGE_SIZE"

    show_step "Step 8: Deploy to Azure"
    show_substep "Uploading and deploying..."
    az webapp deployment source config-zip \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --src "$PACKAGE" \
        --output none
    show_success "Code deployed"

    # Cleanup
    rm -rf "$TEMP_DIR"

    show_step "Step 9: Restart Application"
    show_substep "Restarting to apply changes..."
    az webapp restart \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --output none
    show_success "Application restarted"

    show_step "Step 10: Verify Deployment"
    show_substep "Waiting 15 seconds for app to start..."
    sleep 15
    
    # Health check with retries
    MAX_RETRIES=3
    RETRY_COUNT=0
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$APP_NAME.azurewebsites.net/health" 2>/dev/null || echo "000")
        
        if [ "$HTTP_STATUS" == "200" ]; then
            show_success "Health check passed (HTTP $HTTP_STATUS)"
            break
        else
            RETRY_COUNT=$((RETRY_COUNT + 1))
            if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
                show_warning "Health check returned HTTP $HTTP_STATUS, retrying in 10 seconds... ($RETRY_COUNT/$MAX_RETRIES)"
                sleep 10
            else
                show_warning "Health check returned HTTP $HTTP_STATUS after $MAX_RETRIES attempts"
                echo ""
                echo "The app may still be starting. Check logs with:"
                echo "  ./deploy.sh --logs"
            fi
        fi
    done
}

# ============================================================
# SUMMARY
# ============================================================

show_summary() {
    echo ""
    echo -e "${GREEN}══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}                    DEPLOYMENT COMPLETE!                       ${NC}"
    echo -e "${GREEN}══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "  🌐 App URL:        https://$APP_NAME.azurewebsites.net"
    echo "  🔐 Admin Login:    https://$APP_NAME.azurewebsites.net/admin/login"
    echo ""
    echo "  📧 Admin Email:    $ADMIN_EMAIL"
    echo "  🔑 Admin Password: $ADMIN_PASSWORD"
    echo ""
    echo -e "${CYAN}Useful commands:${NC}"
    echo "  ./deploy.sh --logs      Stream live logs"
    echo "  ./deploy.sh --ssh       SSH into container"
    echo "  ./deploy.sh --restart   Restart the app"
    echo "  ./deploy.sh --deploy    Deploy code updates"
    echo "  ./deploy.sh --sync      Sync questionnaires only"
    echo "  ./deploy.sh --status    Check app health"
    echo ""
    echo -e "${CYAN}Adding new questionnaires:${NC}"
    echo "  1. Add .md file to Questionnaires/ folder"
    echo "  2. Run: ./deploy.sh --deploy"
    echo ""
}

# ============================================================
# MAIN
# ============================================================

case "$1" in
    --help|-h)
        show_help
        ;;
    --sync)
        sync_questionnaires
        echo ""
        echo "To deploy to Azure, run: ./deploy.sh --deploy"
        ;;
    --status)
        validate_setup
        check_status
        ;;
    --logs)
        validate_setup
        view_logs
        ;;
    --ssh)
        validate_setup
        connect_ssh
        ;;
    --restart)
        validate_setup
        restart_app
        ;;
    --delete)
        validate_setup
        delete_resources
        ;;
    --setup)
        validate_setup
        setup_azure
        show_summary
        ;;
    --deploy)
        validate_setup
        deploy_code
        show_summary
        ;;
    *)
        # Full deployment
        validate_setup
        setup_azure
        deploy_code
        show_summary
        ;;
esac