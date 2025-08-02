#!/bin/sh

# Docker entrypoint script for Vue.js application

set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Check if we're in development or production mode
if [ "$NODE_ENV" = "production" ]; then
    log "Starting in production mode..."
    
    # Replace environment variables in built files
    if [ -f "/usr/share/nginx/html/index.html" ]; then
        log "Replacing environment variables in built files..."
        
        # Replace API URL in built files
        if [ -n "$VITE_API_URL" ]; then
            find /usr/share/nginx/html -name "*.js" -exec sed -i "s|http://localhost:8000/api|$VITE_API_URL|g" {} \;
        fi
    fi
    
    log "Starting Nginx..."
    exec nginx -g "daemon off;"
    
else
    log "Starting in development mode..."
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        log "Installing dependencies..."
        npm install
    fi
    
    # Check if package.json has changed
    if [ "package.json" -nt "node_modules/.package-lock.json" ]; then
        log "Package.json changed, updating dependencies..."
        npm install
        touch node_modules/.package-lock.json
    fi
    
    log "Starting Vite development server..."
    exec npm run dev -- --host 0.0.0.0
fi

