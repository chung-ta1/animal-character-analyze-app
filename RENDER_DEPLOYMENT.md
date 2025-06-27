# Deploying Animal Character Analyzer Frontend to Render

This guide provides step-by-step instructions to deploy the React TypeScript frontend to Render as a static site or Docker container.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Option 1: Static Site Deployment](#option-1-deploy-as-static-site-recommended)
- [Option 2: Docker Deployment](#option-2-deploy-as-docker-container)
- [Post-Deployment](#post-deployment-steps)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- GitHub account with the frontend code repository
- Render account ([Sign up free](https://render.com/))
- Backend service URL (e.g., `https://animal-character-analyzer-api.onrender.com`)
- Node.js 18+ installed locally for testing

## Quick Start

For the fastest deployment, use our deployment script:

```bash
# Run with your backend URL
./deploy-to-render.sh https://your-backend-api.onrender.com

# Or use default localhost for testing
./deploy-to-render.sh
```

## Option 1: Deploy as Static Site (Recommended)

### Complete Step-by-Step Guide

#### Step 1: Prepare Your Repository

1. **Ensure all files are committed**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   ```

2. **Verify render.yaml exists** (already created):
   ```bash
   cat render.yaml
   ```

3. **Set up environment file**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend URL
   ```

#### Step 2: Push to GitHub

```bash
# If you haven't set up remote yet
git remote add origin https://github.com/YOUR_USERNAME/animal-character-analyze-app.git

# Push your code
git push -u origin main
# or if using mvp-1.0 branch
git push -u origin mvp-1.0
```

#### Step 3: Create Static Site on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Static Site"**

3. **Connect GitHub**:
   - Click "Connect account" if first time
   - Authorize Render to access your repositories

4. **Select Repository**:
   - Search for `animal-character-analyze-app`
   - Click "Connect"

5. **Configure Your Static Site**:
   - **Name**: `animal-character-analyzer` (or your preferred name)
   - **Branch**: `main` or `mvp-1.0`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: Yes (recommended)

6. **Add Environment Variables**:
   Click "Advanced" and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-api.onrender.com` (your backend URL)

7. **Click "Create Static Site"**

The deployment will start automatically!

### Step 4: Using render.yaml (Alternative)

If you have `render.yaml` in your repository:

```yaml
services:
  - type: web
    name: animal-character-analyzer-app
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    headers:
      - path: /*
        name: X-Frame-Options
        value: DENY
      - path: /*
        name: X-Content-Type-Options
        value: nosniff
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: VITE_API_URL
        value: https://your-backend-service.onrender.com
      - key: NODE_VERSION
        value: 18
```

### Step 2: Deploy via Render Dashboard

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `animal-character-analyzer-app`
   - **Branch**: `main` or `mvp-1.0`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Step 3: Environment Variables

Add these in the Render dashboard:
- `VITE_API_URL`: Your backend service URL (e.g., `https://animal-character-analyzer-api.onrender.com`)

### Step 4: Deploy

Click **"Create Static Site"** and Render will build and deploy your app.

## Option 2: Deploy as Docker Container

### Step 1: Update Dockerfile

Ensure your `Dockerfile` is configured for Render:

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Set build-time environment variable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Create a script to inject runtime environment variables
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'echo "window.ENV = { VITE_API_URL: \"$VITE_API_URL\" };" > /usr/share/nginx/html/env.js' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
```

### Step 2: Create Web Service

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your repository
4. Select **Docker** as the environment
5. Configure:
   - **Name**: `animal-character-analyzer-app`
   - **Docker Build Context**: `.`
   - **Dockerfile Path**: `./Dockerfile`

### Step 3: Set Environment Variables

- `VITE_API_URL`: Your backend API URL
- `PORT`: Leave empty (Render will set this)

## Option 3: Using GitHub Auto-Deploy

### Step 1: Push render.yaml to Repository

```bash
git add render.yaml
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Blueprint Deployment

1. Go to Render Dashboard
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create services automatically

## Post-Deployment Steps

### 1. Verify Deployment

Once deployed, your frontend will be available at:
```
https://animal-character-analyzer-app.onrender.com
```

Test the following:
- Home page loads correctly
- Camera permissions work
- API calls reach the backend
- Character analysis completes successfully

### 2. Custom Domain (Optional)

1. Go to your service settings in Render
2. Add a custom domain
3. Update DNS records as instructed

### 3. Configure CORS on Backend

Ensure your backend allows requests from your frontend URL:

```bash
# Update backend environment variable
CORS_ALLOWED_ORIGINS=https://animal-character-analyzer-app.onrender.com
```

## Troubleshooting

### Build Failures

1. **Node version mismatch**:
   - Add `NODE_VERSION=18` to environment variables
   - Or add `.node-version` file with `18` in your repo

2. **Missing dependencies**:
   ```bash
   npm install --save-dev @types/node
   ```

3. **Build command errors**:
   - Ensure all TypeScript errors are resolved
   - Check that `npm run build` works locally

### Runtime Issues

1. **API calls failing**:
   - Verify `VITE_API_URL` is set correctly
   - Check browser console for CORS errors
   - Ensure backend is running and accessible

2. **Routing not working**:
   - Static sites need the rewrite rule in `render.yaml`
   - Docker deployments need proper nginx configuration

3. **Assets not loading**:
   - Check the publish directory is correct (`dist` for Vite)
   - Verify all assets are included in the build

### Performance Optimization

1. **Enable Brotli compression** in Render settings
2. **Set cache headers** for static assets:
   ```yaml
   headers:
     - path: /assets/*
       name: Cache-Control
       value: public, max-age=31536000, immutable
   ```

3. **Use Render's CDN** (automatically enabled for static sites)

## Monitoring

- View deployment logs in the Render dashboard
- Set up alerts for downtime
- Monitor build times and optimize if needed

## CI/CD Integration

For automatic deployments on every push:

1. Connect your GitHub repository
2. Enable auto-deploy on push to main branch
3. Set up preview environments for pull requests

## Cost Considerations

- **Static Site**: Free tier includes:
  - 100 GB bandwidth/month
  - Automatic SSL
  - Global CDN

- **Web Service**: Free tier includes:
  - 750 hours/month
  - Auto-sleep after 15 minutes of inactivity
  - Manual restart required after sleep

For production use, consider upgrading to a paid plan for:
- Always-on service
- More bandwidth
- Team collaboration features

## Security Best Practices

1. **Environment Variables**: Never commit API keys to the repository
2. **HTTPS**: Always use HTTPS URLs for API calls
3. **Content Security Policy**: Add CSP headers in `render.yaml`
4. **Regular Updates**: Keep dependencies updated for security patches

## Deployment Checklist

Before deploying, ensure:

- [ ] Backend service is deployed and running
- [ ] Backend CORS allows your frontend URL
- [ ] All code is committed and pushed to GitHub
- [ ] Environment variables are set correctly
- [ ] Build runs successfully locally

## Complete Deployment Example

Here's a complete example deploying both frontend and backend:

### 1. Deploy Backend First
```bash
cd animal-character-analyze-service
git push origin main
# Deploy on Render as Web Service
# Note the URL: https://animal-analyzer-api.onrender.com
```

### 2. Update Backend CORS
Set environment variable on backend:
```
CORS_ALLOWED_ORIGINS=https://animal-analyzer-app.onrender.com
```

### 3. Deploy Frontend
```bash
cd animal-character-analyze-app
./deploy-to-render.sh https://animal-analyzer-api.onrender.com
git add .
git commit -m "Configure for production deployment"
git push origin main
```

### 4. Create Static Site on Render
- Name: `animal-analyzer-app`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variable: `VITE_API_URL=https://animal-analyzer-api.onrender.com`

### 5. Verify Deployment
1. Visit: `https://animal-analyzer-app.onrender.com`
2. Test camera functionality
3. Verify API calls work
4. Check character analysis completes

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community Forum](https://community.render.com/)
- [Render Status Page](https://status.render.com/)
- Check application logs in the Render dashboard for debugging

## Quick Reference

### URLs After Deployment
- Frontend: `https://[your-app-name].onrender.com`
- Backend: `https://[your-api-name].onrender.com`
- Health Check: `https://[your-api-name].onrender.com/api/v1/health`

### Common Commands
```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Update dependencies
npm update
```