#!/bin/bash

echo "🚀 Preparing Animal Character Analyzer Frontend for Render Deployment"
echo "================================================================="

# Check if backend URL is provided
if [ -z "$1" ]; then
    echo "⚠️  Warning: No backend URL provided"
    echo "Usage: ./deploy-to-render.sh <BACKEND_URL>"
    echo "Example: ./deploy-to-render.sh https://your-backend.onrender.com"
    echo ""
    echo "Using default: http://localhost:8080"
    BACKEND_URL="http://localhost:8080"
else
    BACKEND_URL=$1
fi

echo "📝 Backend URL: $BACKEND_URL"

# Create .env.production file
echo "VITE_API_URL=$BACKEND_URL" > .env.production
echo "✅ Created .env.production file"

# Test build locally
echo ""
echo "🔨 Testing build locally..."
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Commit your changes:"
    echo "   git add -A"
    echo "   git commit -m 'Configure for Render deployment'"
    echo "   git push origin main"
    echo ""
    echo "2. Deploy on Render:"
    echo "   - Go to https://dashboard.render.com"
    echo "   - Create New > Static Site"
    echo "   - Connect your GitHub repository"
    echo "   - Set environment variable:"
    echo "     VITE_API_URL = $BACKEND_URL"
    echo ""
    echo "3. Your app will be available at:"
    echo "   https://[your-app-name].onrender.com"
else
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi