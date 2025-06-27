#!/bin/bash
# Quick script to build and run the Docker container for frontend

echo "Building Animal Character Analyzer Frontend Docker image..."
echo "Using platform: linux/amd64 for compatibility..."

# Default API URL if not provided
API_URL=${1:-"http://localhost:8080"}

echo "API URL: $API_URL"

# Build the image
docker build --platform linux/amd64 \
    --build-arg VITE_API_URL="$API_URL" \
    -t animal-character-analyzer-frontend .

if [ $? -eq 0 ]; then
    echo "Build successful! Starting container..."
    
    # Stop and remove existing container if it exists
    docker stop animal-analyzer-frontend 2>/dev/null
    docker rm animal-analyzer-frontend 2>/dev/null
    
    # Run the container
    docker run -d \
        -p 3000:80 \
        -e VITE_API_URL="$API_URL" \
        --name animal-analyzer-frontend \
        animal-character-analyzer-frontend
    
    echo ""
    echo "Frontend container started!"
    echo "Access the app at: http://localhost:3000"
    echo ""
    echo "View logs with: docker logs -f animal-analyzer-frontend"
    echo "Stop with: docker stop animal-analyzer-frontend"
    echo ""
    echo "To run with a different API URL:"
    echo "./docker-build-and-run.sh https://your-api-url.com"
else
    echo "Build failed!"
    exit 1
fi