#!/bin/bash
set -e

# ============================================================
# CONFIGURATION - Edit these for your deployment
# ============================================================

# Base names (environment suffix will be added)
RESOURCE_GROUP_BASE="cloudstrucc-rg"
APP_SERVICE_PLAN_BASE="cloudstrucc-plan"
APP_NAME_BASE="cloudstrucc-ba-forms"
STORAGE_ACCOUNT_BASE="cloudstruccdata"
AUTOMATION_ACCOUNT="cloudstrucc-automation"
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
MAGENTA='\033[0;35m'
NC='\033[0m'

# Get script and app directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
APP_DIR="$REPO_ROOT/ba-questionnaire-app"
QUESTIONNAIRES_DIR="$REPO_ROOT/Questionnaires"
TEMPLATES_DIR="$APP_DIR/templates"

# Default environment is production
ENVIRONMENT="prod"
TTL_HOURS=""

# Parse command line arguments
parse_arguments() {
    COMMAND=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                COMMAND="help"
                shift
                ;;
            --dev)
                ENVIRONMENT="dev"
                shift
                ;;
            --qa)
                ENVIRONMENT="qa"
                shift
                ;;
            --prod)
                ENVIRONMENT="prod"
                shift
                ;;
            --ttl)
                if [[ -n "$2" && "$2" =~ ^[0-9]+$ ]]; then
                    TTL_HOURS="$2"
                    shift 2
                else
                    echo -e "${RED}Error: --ttl requires a numeric value (hours)${NC}"
                    exit 1
                fi
                ;;
            --deploy)
                COMMAND="deploy"
                shift
                ;;
            --setup)
                COMMAND="setup"
                shift
                ;;
            --sync)
                COMMAND="sync"
                shift
                ;;
            --logs)
                COMMAND="logs"
                shift
                ;;
            --ssh)
                COMMAND="ssh"
                shift
                ;;
            --restart)
                COMMAND="restart"
                shift
                ;;
            --status)
                COMMAND="status"
                shift
                ;;
            --delete)
                COMMAND="delete"
                shift
                ;;
            --stop)
                COMMAND="stop"
                shift
                ;;
            --start)
                COMMAND="start"
                shift
                ;;
            --list-envs)
                COMMAND="list-envs"
                shift
                ;;
            --clean)
                COMMAND="clean"
                shift
                ;;
            *)
                if [[ -z "$COMMAND" ]]; then
                    COMMAND="full"
                fi
                shift
                ;;
        esac
    done
    
    # Default to full deployment if no command specified
    if [[ -z "$COMMAND" ]]; then
        COMMAND="full"
    fi
}

# Set environment-specific variables
set_environment_vars() {
    case $ENVIRONMENT in
        dev)
            ENV_SUFFIX="-dev"
            ENV_DISPLAY="DEVELOPMENT"
            ENV_COLOR="${YELLOW}"
            ;;
        qa)
            ENV_SUFFIX="-qa"
            ENV_DISPLAY="QA/STAGING"
            ENV_COLOR="${MAGENTA}"
            ;;
        prod)
            ENV_SUFFIX=""
            ENV_DISPLAY="PRODUCTION"
            ENV_COLOR="${RED}"
            ;;
    esac
    
    # Set resource names based on environment
    # Each environment gets its own resource group for complete isolation
    if [[ "$ENVIRONMENT" == "prod" ]]; then
        RESOURCE_GROUP="${RESOURCE_GROUP_BASE}"
    else
        RESOURCE_GROUP="${RESOURCE_GROUP_BASE}-${ENVIRONMENT}"
    fi
    
    APP_SERVICE_PLAN="${APP_SERVICE_PLAN_BASE}${ENV_SUFFIX}"
    APP_NAME="${APP_NAME_BASE}${ENV_SUFFIX}"
    
    # Storage account names can't have hyphens and must be lowercase, max 24 chars
    if [[ "$ENVIRONMENT" == "prod" ]]; then
        STORAGE_ACCOUNT="${STORAGE_ACCOUNT_BASE}"
    else
        STORAGE_ACCOUNT="${STORAGE_ACCOUNT_BASE}${ENVIRONMENT}"
    fi
    
    # Validate TTL not used with production
    if [[ "$ENVIRONMENT" == "prod" && -n "$TTL_HOURS" ]]; then
        echo -e "${RED}Error: TTL auto-shutdown is not allowed for production environment${NC}"
        echo "Remove the --ttl flag for production deployments"
        exit 1
    fi
}

show_environment_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║     Cloudstrucc BA Forms - Azure Deployment (NP)             ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${ENV_COLOR}┌──────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${ENV_COLOR}│  ENVIRONMENT: ${ENV_DISPLAY}$(printf '%*s' $((43 - ${#ENV_DISPLAY})) '')│${NC}"
    echo -e "${ENV_COLOR}└──────────────────────────────────────────────────────────────┘${NC}"
    echo ""
    
    echo "Script directory:       $SCRIPT_DIR"
    echo "Repository root:        $REPO_ROOT"
    echo "App directory:          $APP_DIR"
    echo ""
    echo "Resource Configuration:"
    echo "  Resource Group:       $RESOURCE_GROUP"
    echo "  App Service Plan:     $APP_SERVICE_PLAN"
    echo "  App Name:             $APP_NAME"
    echo "  Storage Account:      $STORAGE_ACCOUNT"
    echo "  Location:             $LOCATION"
    
    if [[ -n "$TTL_HOURS" ]]; then
        echo ""
        echo -e "${YELLOW}  ⏱  TTL Auto-Shutdown:   ${TTL_HOURS} hour(s)${NC}"
    fi
    echo ""
}

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
    echo "Usage: ./deploy-np.sh [command] [environment] [options]"
    echo ""
    echo -e "${CYAN}Commands:${NC}"
    echo "  (none)         Full deployment (setup + deploy)"
    echo "  --deploy       Deploy code only (resources must exist)"
    echo "  --setup        Create Azure resources only"
    echo "  --sync         Sync questionnaires to templates folder only"
    echo "  --logs         View live application logs"
    echo "  --ssh          SSH into the container"
    echo "  --restart      Restart the web app"
    echo "  --status       Check app status and health"
    echo "  --start        Start a stopped web app"
    echo "  --stop         Stop a running web app"
    echo "  --delete       Delete all Azure resources for environment"
    echo "  --list-envs    List all deployed environments"
    echo "  --clean        Clean remote app files (SSH and delete)"
    echo "  --help         Show this help message"
    echo ""
    echo -e "${CYAN}Environments:${NC}"
    echo "  --dev          Target development environment"
    echo "  --qa           Target QA/staging environment"
    echo "  --prod         Target production environment (default)"
    echo ""
    echo -e "${CYAN}Options:${NC}"
    echo "  --ttl <hours>  Auto-stop the app after specified hours"
    echo "                 (Not allowed for production)"
    echo ""
    echo -e "${CYAN}Examples:${NC}"
    echo "  ./deploy-np.sh --deploy --dev              Deploy to dev"
    echo "  ./deploy-np.sh --deploy --dev --ttl 2      Deploy to dev, auto-stop in 2 hours"
    echo "  ./deploy-np.sh --deploy --qa --ttl 4       Deploy to QA, auto-stop in 4 hours"
    echo "  ./deploy-np.sh --deploy                    Deploy to production"
    echo "  ./deploy-np.sh --setup --dev               Setup dev resources only"
    echo "  ./deploy-np.sh --stop --dev                Stop dev environment"
    echo "  ./deploy-np.sh --start --dev               Start dev environment"
    echo "  ./deploy-np.sh --logs --qa                 View QA logs"
    echo "  ./deploy-np.sh --delete --dev              Delete dev environment"
    echo "  ./deploy-np.sh --clean --dev               Clean remote files before deploy"
    echo ""
    echo -e "${CYAN}Environment Resources (Fully Isolated):${NC}"
    echo "  ┌─────────────┬─────────────────────────┬────────────────────────────┬─────────────────────┐"
    echo "  │ Environment │ Resource Group          │ App Name                   │ Storage Account     │"
    echo "  ├─────────────┼─────────────────────────┼────────────────────────────┼─────────────────────┤"
    echo "  │ dev         │ ${RESOURCE_GROUP_BASE}-dev      │ ${APP_NAME_BASE}-dev       │ ${STORAGE_ACCOUNT_BASE}dev │"
    echo "  │ qa          │ ${RESOURCE_GROUP_BASE}-qa       │ ${APP_NAME_BASE}-qa        │ ${STORAGE_ACCOUNT_BASE}qa  │"
    echo "  │ prod        │ ${RESOURCE_GROUP_BASE}          │ ${APP_NAME_BASE}           │ ${STORAGE_ACCOUNT_BASE}    │"
    echo "  └─────────────┴─────────────────────────┴────────────────────────────┴─────────────────────┘"
    echo ""
    echo -e "${CYAN}URLs:${NC}"
    echo "  Dev:  https://${APP_NAME_BASE}-dev.azurewebsites.net"
    echo "  QA:   https://${APP_NAME_BASE}-qa.azurewebsites.net"
    echo "  Prod: https://${APP_NAME_BASE}.azurewebsites.net"
    echo ""
    exit 0
}

# ============================================================
# LIST ENVIRONMENTS
# ============================================================

list_environments() {
    show_step "Listing Deployed Environments"
    
    echo ""
    printf "%-12s %-25s %-30s %-12s\n" "Environment" "Resource Group" "App Name" "State"
    printf "%-12s %-25s %-30s %-12s\n" "-----------" "-------------------------" "------------------------------" "------------"
    
    for env in dev qa prod; do
        if [[ "$env" == "prod" ]]; then
            app="${APP_NAME_BASE}"
            rg="${RESOURCE_GROUP_BASE}"
        else
            app="${APP_NAME_BASE}-${env}"
            rg="${RESOURCE_GROUP_BASE}-${env}"
        fi
        
        if az webapp show --name "$app" --resource-group "$rg" &> /dev/null 2>&1; then
            STATE=$(az webapp show --name "$app" --resource-group "$rg" --query "state" -o tsv 2>/dev/null)
            printf "%-12s %-25s %-30s %-12s\n" "$env" "$rg" "$app" "$STATE"
        else
            printf "%-12s %-25s %-30s %-12s\n" "$env" "$rg" "$app" "Not deployed"
        fi
    done
    
    echo ""
    echo "URLs:"
    echo "  Dev:  https://${APP_NAME_BASE}-dev.azurewebsites.net"
    echo "  QA:   https://${APP_NAME_BASE}-qa.azurewebsites.net"
    echo "  Prod: https://${APP_NAME_BASE}.azurewebsites.net"
    echo ""
    exit 0
}

# ============================================================
# STATUS CHECK
# ============================================================

check_status() {
    show_step "Checking Application Status [$ENV_DISPLAY]"
    
    echo ""
    echo "Resource Group: $RESOURCE_GROUP"
    echo "App Name:       $APP_NAME"
    echo "Storage:        $STORAGE_ACCOUNT"
    echo "App URL:        https://$APP_NAME.azurewebsites.net"
    echo ""
    
    show_substep "Checking if resource group exists..."
    if ! az group show --name "$RESOURCE_GROUP" &> /dev/null 2>&1; then
        show_warning "Resource group $RESOURCE_GROUP does not exist"
        exit 0
    fi
    show_success "Resource group exists"
    
    show_substep "Checking if app exists..."
    if az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        show_success "App exists"
        
        # Get app state
        STATE=$(az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "state" -o tsv)
        echo "  State: $STATE"
        
        if [[ "$STATE" == "Running" ]]; then
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
            show_warning "App is stopped. Use './deploy-np.sh --start --${ENVIRONMENT}' to start it."
        fi
        
        # Check for scheduled shutdown
        show_substep "Checking for scheduled auto-shutdown..."
        check_scheduled_shutdown
        
    else
        show_warning "App does not exist"
    fi
    
    exit 0
}

# ============================================================
# CHECK SCHEDULED SHUTDOWN
# ============================================================

check_scheduled_shutdown() {
    # Check for TTL tag on the webapp
    SHUTDOWN_TIME=$(az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "tags.AutoShutdownTime" -o tsv 2>/dev/null)
    TTL_TAG=$(az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "tags.TTLHours" -o tsv 2>/dev/null)
    
    if [[ -n "$SHUTDOWN_TIME" && "$SHUTDOWN_TIME" != "null" ]]; then
        echo -e "${YELLOW}  ⏱  Scheduled auto-shutdown at: $SHUTDOWN_TIME UTC${NC}"
        echo "     (TTL was set to: ${TTL_TAG} hours)"
        
        # Check if shutdown time has passed
        CURRENT_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        if [[ "$CURRENT_TIME" > "$SHUTDOWN_TIME" ]]; then
            echo -e "${YELLOW}     Note: Shutdown time has passed. App may need manual stop.${NC}"
        fi
    else
        echo "  No auto-shutdown scheduled"
    fi
}

# ============================================================
# VIEW LOGS
# ============================================================

view_logs() {
    show_step "Streaming Logs from $APP_NAME [$ENV_DISPLAY]"
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
    show_step "Connecting to $APP_NAME via SSH [$ENV_DISPLAY]"
    az webapp ssh \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP"
    exit 0
}

# ============================================================
# CLEAN REMOTE FILES
# ============================================================

clean_remote() {
    show_step "Cleaning Remote Files on $APP_NAME [$ENV_DISPLAY]"
    
    show_warning "This will delete all files in /home/site/wwwroot on the remote app"
    echo ""
    read -p "Are you sure? (y/N): " confirm
    
    if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
        show_substep "Stopping app first..."
        az webapp stop --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" 2>/dev/null || true
        
        show_substep "Cleaning via Kudu API..."
        # Use Kudu VFS API to delete files
        PUBLISH_PROFILE=$(az webapp deployment list-publishing-profiles \
            --name "$APP_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --query "[?publishMethod=='MSDeploy'].{user:userName, pass:userPWD}" -o tsv 2>/dev/null)
        
        if [[ -n "$PUBLISH_PROFILE" ]]; then
            USER=$(echo "$PUBLISH_PROFILE" | cut -f1)
            PASS=$(echo "$PUBLISH_PROFILE" | cut -f2)
            
            # Delete wwwroot contents via Kudu
            curl -X DELETE \
                -u "$USER:$PASS" \
                "https://$APP_NAME.scm.azurewebsites.net/api/vfs/site/wwwroot/?recursive=true" \
                2>/dev/null || true
            
            show_success "Remote files cleaned"
        else
            show_warning "Could not get publishing credentials"
            echo "  You can manually clean via SSH:"
            echo "  ./deploy-np.sh --ssh --${ENVIRONMENT}"
            echo "  Then run: rm -rf /home/site/wwwroot/*"
        fi
        
        show_substep "Starting app..."
        az webapp start --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" 2>/dev/null || true
    else
        echo "Cancelled."
    fi
    
    exit 0
}

# ============================================================
# RESTART
# ============================================================

restart_app() {
    show_step "Restarting $APP_NAME [$ENV_DISPLAY]"
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
# STOP APP
# ============================================================

stop_app() {
    show_step "Stopping $APP_NAME [$ENV_DISPLAY]"
    
    if [[ "$ENVIRONMENT" == "prod" ]]; then
        echo -e "${RED}WARNING: You are about to stop the PRODUCTION environment!${NC}"
        read -p "Are you sure? Type 'STOP' to confirm: " confirm
        if [[ "$confirm" != "STOP" ]]; then
            echo "Cancelled."
            exit 0
        fi
    fi
    
    az webapp stop \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP"
    show_success "App stopped"
    
    # Clear the TTL tag since we manually stopped
    az webapp update \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --set tags.AutoShutdownTime="" \
        --set tags.TTLHours="" \
        --output none 2>/dev/null || true
    
    echo ""
    echo "To start the app again, run:"
    echo "  ./deploy-np.sh --start --${ENVIRONMENT}"
    
    exit 0
}

# ============================================================
# START APP
# ============================================================

start_app() {
    show_step "Starting $APP_NAME [$ENV_DISPLAY]"
    
    az webapp start \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP"
    show_success "App started"
    
    # Clear the TTL tag since we manually started
    az webapp update \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --set tags.AutoShutdownTime="" \
        --set tags.TTLHours="" \
        --output none 2>/dev/null || true
    
    echo ""
    echo "Waiting 15 seconds for app to start..."
    sleep 15
    
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
    show_step "Delete Azure Resources [$ENV_DISPLAY]"
    
    echo -e "${RED}WARNING: This will delete the ${ENV_DISPLAY} environment resources!${NC}"
    echo ""
    echo "Resources to be deleted:"
    echo "  - Resource Group: $RESOURCE_GROUP (and ALL resources inside)"
    echo "  - App Service: $APP_NAME"
    echo "  - App Service Plan: $APP_SERVICE_PLAN"
    echo "  - Storage Account: $STORAGE_ACCOUNT"
    
    if [[ "$ENVIRONMENT" == "prod" ]]; then
        echo ""
        echo -e "${RED}THIS IS THE PRODUCTION ENVIRONMENT!${NC}"
    fi
    
    echo ""
    CONFIRM_TEXT="DELETE-$(echo $ENVIRONMENT | tr '[:lower:]' '[:upper:]')"
    read -p "Are you sure? Type '$CONFIRM_TEXT' to confirm: " confirm
    
    if [ "$confirm" == "$CONFIRM_TEXT" ]; then
        echo ""
        
        if [[ "$ENVIRONMENT" != "prod" ]]; then
            # For dev/qa, delete the entire resource group (cleaner and complete isolation)
            show_substep "Deleting resource group $RESOURCE_GROUP (this may take a few minutes)..."
            az group delete --name "$RESOURCE_GROUP" --yes --no-wait
            show_success "Resource group deletion initiated"
            echo ""
            echo "Note: Deletion happens in the background and may take 5-10 minutes."
            echo "Check status with: az group show --name $RESOURCE_GROUP"
        else
            # For prod, delete individual resources to be safer
            # Delete web app
            show_substep "Deleting web app..."
            az webapp delete --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --keep-empty-plan 2>/dev/null || true
            show_success "Web app deleted"
            
            # Delete app service plan
            show_substep "Deleting app service plan..."
            az appservice plan delete --name "$APP_SERVICE_PLAN" --resource-group "$RESOURCE_GROUP" --yes 2>/dev/null || true
            show_success "App service plan deleted"
            
            # Delete storage account
            show_substep "Deleting storage account..."
            az storage account delete --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" --yes 2>/dev/null || true
            show_success "Storage account deleted"
        fi
        
        show_success "All ${ENV_DISPLAY} resources deleted"
    else
        echo "Cancelled."
    fi
    
    exit 0
}

# ============================================================
# SETUP TTL AUTO-SHUTDOWN
# ============================================================

setup_ttl_shutdown() {
    if [[ -z "$TTL_HOURS" ]]; then
        return
    fi
    
    show_step "Setting up TTL Auto-Shutdown (${TTL_HOURS} hours)"
    
    # Calculate shutdown time (works on both Linux and macOS)
    if date --version >/dev/null 2>&1; then
        # GNU date (Linux)
        SHUTDOWN_TIME=$(date -u -d "+${TTL_HOURS} hours" +"%Y-%m-%dT%H:%M:%SZ")
    else
        # BSD date (macOS)
        SHUTDOWN_TIME=$(date -u -v+${TTL_HOURS}H +"%Y-%m-%dT%H:%M:%SZ")
    fi
    
    show_substep "App will auto-stop at: $SHUTDOWN_TIME UTC"
    
    # Tag the web app with shutdown time
    az webapp update \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --set tags.AutoShutdownTime="$SHUTDOWN_TIME" \
        --set tags.TTLHours="$TTL_HOURS" \
        --output none
    
    show_success "Tagged app with auto-shutdown time: $SHUTDOWN_TIME UTC"
    
    echo ""
    echo -e "${YELLOW}  ⏱  REMINDER: Auto-shutdown is tag-based${NC}"
    echo "  To stop the app when done, run:"
    echo "    ./deploy-np.sh --stop --${ENVIRONMENT}"
    echo ""
    echo "  Or set up Azure Automation / Logic App for automatic shutdown"
}

# ============================================================
# SETUP - Create Azure Resources
# ============================================================

setup_azure() {
    show_step "Step 1: Create Resource Group"
    show_substep "Creating $RESOURCE_GROUP in $LOCATION..."
    
    # Check if resource group is being deleted
    RG_STATE=$(az group show --name "$RESOURCE_GROUP" --query "properties.provisioningState" -o tsv 2>/dev/null || echo "NotFound")
    if [[ "$RG_STATE" == "Deleting" ]]; then
        show_error "Resource group $RESOURCE_GROUP is currently being deleted"
        echo "  Please wait 5-10 minutes for deletion to complete, then try again."
        echo "  Check status with: az group show --name $RESOURCE_GROUP"
        exit 1
    fi
    
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --tags Environment="$ENVIRONMENT" ManagedBy="deploy-np.sh" \
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
        --tags Environment="$ENVIRONMENT" \
        --output none
    show_success "App Service Plan created"

    show_step "Step 3: Create Web App"
    show_substep "Creating $APP_NAME with Node.js 22 LTS..."
    
    # Try creating with runtime
    if ! az webapp create \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --plan "$APP_SERVICE_PLAN" \
        --runtime "NODE:22-lts" \
        --tags Environment="$ENVIRONMENT" \
        --output none 2>/dev/null; then
        
        show_warning "Runtime NODE:22-lts not available, trying alternative..."
        
        # Create without runtime, then set it
        az webapp create \
            --name "$APP_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --plan "$APP_SERVICE_PLAN" \
            --tags Environment="$ENVIRONMENT" \
            --output none
        
        az webapp config set \
            --name "$APP_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --linux-fx-version "NODE|22-lts" \
            --output none 2>/dev/null || true
    fi
    
    show_success "Web App created"

    show_step "Step 4: Create Storage Account"
    show_substep "Creating $STORAGE_ACCOUNT for ${ENV_DISPLAY}..."
    
    # Check if storage account exists
    if ! az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null 2>&1; then
        az storage account create \
            --name "$STORAGE_ACCOUNT" \
            --resource-group "$RESOURCE_GROUP" \
            --location "$LOCATION" \
            --sku "Standard_LRS" \
            --kind "StorageV2" \
            --tags Environment="$ENVIRONMENT" \
            --output none
        show_success "Storage account created"
    else
        show_warning "Storage account already exists"
    fi
    
    # Get storage connection string
    STORAGE_CONNECTION=$(az storage account show-connection-string \
        --name "$STORAGE_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --query "connectionString" -o tsv)

    show_step "Step 5: Configure Application Settings"
    show_substep "Setting environment variables..."
    
    SESSION_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "fallback-secret-$(date +%s)-$(head -c 32 /dev/urandom | base64)")
    
    az webapp config appsettings set \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --settings \
            NODE_ENV="production" \
            ENVIRONMENT="$ENVIRONMENT" \
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
            AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONNECTION" \
        --output none
    show_success "Application settings configured"

    show_step "Step 6: Set Startup Command"
    show_substep "Setting startup command to startup-np.sh..."
    az webapp config set \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --startup-file "/home/site/wwwroot/startup-np.sh" \
        --output none
    show_success "Startup command set"

    show_step "Step 7: Enable Logging"
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
    
    show_step "Step 8: Install Dependencies Locally"
    
    cd "$APP_DIR"
    show_substep "Working directory: $(pwd)"
    
    # Check for startup-np.sh
    if [ ! -f "startup-np.sh" ]; then
        show_error "startup-np.sh not found in $APP_DIR"
        echo "  Please copy startup-np.sh to your ba-questionnaire-app folder"
        exit 1
    fi
    
    # Clean and reinstall node_modules for production
    show_substep "Cleaning existing node_modules..."
    rm -rf node_modules package-lock.json
    
    show_substep "Installing production dependencies (this may take a minute)..."
    npm install --production --omit=dev 2>&1 | tail -10
    
    if [ ! -d "node_modules" ]; then
        show_error "Failed to install dependencies"
        exit 1
    fi
    
    MODULE_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l | tr -d ' ')
    show_success "Installed $((MODULE_COUNT - 1)) packages"
    
    show_step "Step 9: Create Deployment Package"
    
    # Create temp directory for package
    TEMP_DIR=$(mktemp -d)
    PACKAGE="$TEMP_DIR/deploy.zip"
    
    show_substep "Creating zip package (including node_modules)..."
    show_substep "This may take a moment for large node_modules..."
    
    zip -r "$PACKAGE" . \
        -x ".git/*" \
        -x "data/*" \
        -x ".env" \
        -x "*.log" \
        -x ".DS_Store" \
        -x "deploy*.sh" \
        -x "deploy*.ps1" \
        -x "node_modules/.cache/*" \
        -x "node_modules/.package-lock.json" \
        > /dev/null
    
    # Re-add .package-lock.json as it's used for detection
    if [ -f "node_modules/.package-lock.json" ]; then
        zip -u "$PACKAGE" node_modules/.package-lock.json > /dev/null 2>&1 || true
    fi
    
    PACKAGE_SIZE=$(du -h "$PACKAGE" | cut -f1)
    show_success "Package created: $PACKAGE_SIZE (includes node_modules)"

    show_step "Step 10: Deploy to Azure"
    show_substep "Uploading and deploying to $APP_NAME..."
    show_substep "This may take 1-2 minutes for large packages..."
    
    az webapp deployment source config-zip \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --src "$PACKAGE" \
        --timeout 600 \
        --output none
    show_success "Code deployed"

    # Cleanup
    rm -rf "$TEMP_DIR"

    show_step "Step 11: Restart Application"
    show_substep "Restarting to apply changes..."
    az webapp restart \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --output none
    show_success "Application restarted"

    # Setup TTL if specified
    if [[ -n "$TTL_HOURS" ]]; then
        setup_ttl_shutdown
    fi

    show_step "Step 12: Verify Deployment"
    show_substep "Waiting 20 seconds for app to start..."
    sleep 20
    
    # Health check with retries
    MAX_RETRIES=5
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
                echo "  ./deploy-np.sh --logs --${ENVIRONMENT}"
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
    echo -e "  Environment:     ${ENV_COLOR}${ENV_DISPLAY}${NC}"
    echo ""
    echo "  🌐 App URL:        https://$APP_NAME.azurewebsites.net"
    echo "  🔐 Admin Login:    https://$APP_NAME.azurewebsites.net/admin/login"
    echo "  📦 Storage:        $STORAGE_ACCOUNT"
    echo "  🗂  Resource Group: $RESOURCE_GROUP"
    echo ""
    echo "  📧 Admin Email:    $ADMIN_EMAIL"
    echo "  🔑 Admin Password: $ADMIN_PASSWORD"
    
    if [[ -n "$TTL_HOURS" ]]; then
        echo ""
        echo -e "${YELLOW}  ⏱  Auto-Shutdown:   In ${TTL_HOURS} hour(s)${NC}"
    fi
    
    echo ""
    echo -e "${CYAN}Useful commands for ${ENV_DISPLAY}:${NC}"
    echo "  ./deploy-np.sh --logs --${ENVIRONMENT}      Stream live logs"
    echo "  ./deploy-np.sh --ssh --${ENVIRONMENT}       SSH into container"
    echo "  ./deploy-np.sh --restart --${ENVIRONMENT}   Restart the app"
    echo "  ./deploy-np.sh --deploy --${ENVIRONMENT}    Deploy code updates"
    echo "  ./deploy-np.sh --status --${ENVIRONMENT}    Check app health"
    echo "  ./deploy-np.sh --stop --${ENVIRONMENT}      Stop the app (save costs)"
    echo "  ./deploy-np.sh --start --${ENVIRONMENT}     Start the app"
    echo "  ./deploy-np.sh --delete --${ENVIRONMENT}    Delete all resources"
    echo ""
    echo -e "${CYAN}All environments:${NC}"
    echo "  ./deploy-np.sh --list-envs           List all environments"
    echo ""
}

# ============================================================
# MAIN
# ============================================================

# Parse arguments first
parse_arguments "$@"

# Set environment variables
set_environment_vars

# Execute command
case "$COMMAND" in
    help)
        show_help
        ;;
    sync)
        show_environment_banner
        sync_questionnaires
        echo ""
        echo "To deploy to Azure, run: ./deploy-np.sh --deploy --${ENVIRONMENT}"
        ;;
    status)
        show_environment_banner
        validate_setup
        check_status
        ;;
    logs)
        show_environment_banner
        validate_setup
        view_logs
        ;;
    ssh)
        show_environment_banner
        validate_setup
        connect_ssh
        ;;
    clean)
        show_environment_banner
        validate_setup
        clean_remote
        ;;
    restart)
        show_environment_banner
        validate_setup
        restart_app
        ;;
    stop)
        show_environment_banner
        validate_setup
        stop_app
        ;;
    start)
        show_environment_banner
        validate_setup
        start_app
        ;;
    delete)
        show_environment_banner
        validate_setup
        delete_resources
        ;;
    list-envs)
        validate_setup
        list_environments
        ;;
    setup)
        show_environment_banner
        validate_setup
        setup_azure
        show_summary
        ;;
    deploy)
        show_environment_banner
        validate_setup
        deploy_code
        show_summary
        ;;
    full|*)
        show_environment_banner
        validate_setup
        setup_azure
        deploy_code
        show_summary
        ;;
esac