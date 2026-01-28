#!/bin/bash

# Azure App Service Startup Script
# This ensures dependencies are installed before starting the app

cd /home/site/wwwroot

echo "=========================================="
echo "Cloudstrucc BA Forms - Starting App"
echo "=========================================="

# Always run npm install to ensure dependencies are up to date
echo "Installing dependencies..."
npm install --production --no-optional

# Start the application
echo "Starting Node.js app..."
node app.js