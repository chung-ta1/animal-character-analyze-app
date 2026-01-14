# Docker Deployment Guide - Animal Character Analyzer Frontend

This guide provides instructions for building and deploying the frontend application as a Docker container.

## Prerequisites

- Docker installed on your machine
- Backend service running (either locally or deployed)

## Quick Start

### Option 1: Using the Build Script

```bash
# Build and run with default backend URL (http://localhost:8080)
./docker-build-and-run.sh

# Build and run with custom backend URL
./docker-build-and-run.sh https://your-backend-api.onrender.com
```

### Option 2: Manual Docker Commands

```bash
# Build the image
docker build -t animal-character-analyzer-frontend \
  --build-arg VITE_API_URL=http://localhost:8080 .

# Run the container
docker run -d \
  -p 3000:80 \
  -e VITE_API_URL=http://localhost:8080 \
  --name animal-analyzer-frontend \
  animal-character-analyzer-frontend
```

## Docker Compose (Full Stack)

To run both frontend and backend together:

```bash
# From the parent directory containing both projects
cd ..
docker-compose up -d
```

This will:
- Build both frontend and backend images
- Start both containers
- Frontend available at: http://localhost:3000
- Backend available at: http://localhost:8080

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080` |

### Build Arguments

The same environment variables can be passed as build arguments:

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t my-app .
```

## Dockerfile Details

The Dockerfile uses a multi-stage build:

1. **Build Stage**: 
   - Uses Node.js 18 Alpine
   - Installs dependencies
   - Builds the React app

2. **Production Stage**:
   - Uses Nginx Alpine
   - Serves static files
   - Includes custom nginx configuration

## Nginx Configuration

The included `nginx.conf` provides:
- Gzip compression for better performance
- Security headers
- Proper cache settings
- React Router support
- Health check endpoint at `/health`

## Container Management

### View Logs
```bash
docker logs -f animal-analyzer-frontend
```

### Stop Container
```bash
docker stop animal-analyzer-frontend
```

### Remove Container
```bash
docker rm animal-analyzer-frontend
```

### Update and Restart
```bash
# Stop and remove old container
docker stop animal-analyzer-frontend
docker rm animal-analyzer-frontend

# Rebuild and run
./docker-build-and-run.sh https://new-backend-url.com
```

## Deployment on Render

To deploy the frontend as a Docker container on Render:

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Choose "Docker" as the environment
4. Set environment variables:
   - `VITE_API_URL`: Your backend API URL
5. Deploy!

### Render Configuration

Add to your `render.yaml`:

```yaml
services:
  - type: web
    name: animal-character-analyzer-frontend
    runtime: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: VITE_API_URL
        value: https://your-backend-api.onrender.com
```

## Troubleshooting

### Container won't start
- Check logs: `docker logs animal-analyzer-frontend`
- Ensure port 3000 is not already in use
- Verify Docker daemon is running

### API calls failing
- Verify `VITE_API_URL` is set correctly
- Check if backend is running and accessible
- Look for CORS errors in browser console

### Build failures
- Ensure all dependencies are listed in package.json
- Check for TypeScript errors: `npm run build` locally
- Verify Node version compatibility

## Production Optimizations

The Docker image includes:
- Minified and optimized JavaScript/CSS
- Gzip compression enabled
- Proper cache headers for static assets
- Security headers configured
- Small Alpine-based image (~25MB)

## Health Monitoring

The container exposes a health endpoint:

```bash
curl http://localhost:3000/health
```

This can be used for:
- Container health checks
- Load balancer health probes
- Monitoring systems