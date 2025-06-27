# Deploying Animal Character Analyzer Frontend to Render

This guide provides step-by-step instructions to deploy the Animal Character Analyzer frontend as a Docker container on Render.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Deployment Steps](#detailed-deployment-steps)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)
- [Updating Your Deployment](#updating-your-deployment)

## Prerequisites

- GitHub account with the frontend code repository
- Render account ([Sign up free](https://render.com/))
- Backend service deployed and accessible (e.g., `https://animal-character-analyzer-api.onrender.com`)

## Quick Start

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Choose **Docker** as the environment
6. Set `VITE_API_URL` to your backend URL
7. Deploy!

## Detailed Deployment Steps

### Step 1: Prepare Your Repository

Ensure your repository contains these files:
- `Dockerfile` (already created)
- `nginx.conf` (already created)
- `.dockerignore` (already created)

```bash
# Verify files exist
ls Dockerfile nginx.conf .dockerignore

# Commit and push to GitHub
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create New Web Service on Render

1. **Log in to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect GitHub Repository**
   - If first time: Click "Connect account" to authorize Render
   - Search for `animal-character-analyze-app`
   - Click "Connect"

### Step 3: Configure Your Service

Fill in the service configuration:

#### Basic Settings
| Setting | Value |
|---------|-------|
| **Name** | `animal-character-analyzer-frontend` |
| **Region** | Choose closest to your users |
| **Branch** | `main` or `mvp-1.0` |
| **Root Directory** | Leave empty (uses repository root) |
| **Environment** | `Docker` |
| **Dockerfile Path** | `./Dockerfile` |

#### Advanced Settings
| Setting | Value |
|---------|-------|
| **Docker Build Context Directory** | `.` |
| **Docker Command** | Leave empty (uses Dockerfile default) |
| **Health Check Path** | `/health` |
| **Auto-Deploy** | `Yes` (for automatic deploys on git push) |

### Step 4: Set Environment Variables

Add these environment variables in the Render dashboard:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_API_URL` | `https://your-backend-api.onrender.com` | Your backend API URL |
| `PORT` | `80` | Internal port (Render will map this) |

**Important**: Replace `your-backend-api` with your actual backend service URL.

### Step 5: Choose Instance Type

For production:
- **Starter**: $7/month - Good for most use cases
- **Standard**: More resources for high traffic

For testing:
- **Free**: Spins down after 15 minutes of inactivity

### Step 6: Deploy

Click **"Create Web Service"** and Render will:
1. Pull your code from GitHub
2. Build the Docker image
3. Deploy the container
4. Provide you with a URL

## Environment Configuration

### Build-time vs Runtime Variables

The Dockerfile supports both approaches:

#### Build-time (Baked into image):
```dockerfile
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
```

#### Runtime (Dynamic):
The container includes a script that creates `/env.js` at startup with current environment values.

### Using Custom Domain

1. Go to your service settings
2. Click "Add Custom Domain"
3. Enter your domain
4. Update DNS records as instructed

## Post-Deployment

### Verify Deployment

Once deployed, your frontend will be available at:
```
https://animal-character-analyzer-frontend.onrender.com
```

Test the following:
1. **Home page loads**: Visit the URL
2. **Health check works**: `https://your-app.onrender.com/health`
3. **Camera permissions**: Test camera capture
4. **API connectivity**: Verify image analysis works

### Monitor Your Service

In the Render dashboard, you can:
- View deployment logs
- Monitor metrics (CPU, Memory, Network)
- Set up alerts
- Configure auto-scaling

## Troubleshooting

### Build Failures

**"Docker build failed"**
- Check Render logs for specific errors
- Verify Dockerfile syntax
- Ensure all referenced files exist

**"Cannot find module"**
- Verify package.json and package-lock.json are committed
- Check for case sensitivity in imports

### Runtime Issues

**"White screen" or "404 errors"**
- Check browser console for errors
- Verify nginx.conf is correctly configured
- Ensure React Router paths are handled

**"API calls failing"**
- Verify `VITE_API_URL` is set correctly
- Check for HTTPS/HTTP mismatch
- Ensure backend allows your frontend URL

**"Camera not working"**
- HTTPS is required for camera access
- Check browser permissions
- Test on different devices

### Container Issues

**"Container exited with code 1"**
```bash
# Check logs in Render dashboard or:
# Look for startup errors in nginx or missing files
```

**"Out of memory"**
- Upgrade to a larger instance type
- Optimize bundle size
- Check for memory leaks

## Updating Your Deployment

### Automatic Updates (Recommended)

With auto-deploy enabled:
```bash
# Make changes locally
git add .
git commit -m "Update feature X"
git push origin main

# Render automatically rebuilds and deploys
```

### Manual Updates

1. Go to your service in Render dashboard
2. Click "Manual Deploy"
3. Select "Clear build cache" if needed
4. Click "Deploy"

### Updating Environment Variables

1. Go to Environment section in dashboard
2. Update variable values
3. Click "Save Changes"
4. Render will automatically restart with new values

## Advanced Configuration

### Multi-Environment Setup

Create separate services for staging/production:

```yaml
# render.yaml
services:
  # Production
  - type: web
    name: animal-analyzer-frontend-prod
    env: docker
    branch: main
    dockerfilePath: ./Dockerfile
    envVars:
      - key: VITE_API_URL
        value: https://api-prod.onrender.com
    
  # Staging
  - type: web
    name: animal-analyzer-frontend-staging
    env: docker
    branch: develop
    dockerfilePath: ./Dockerfile
    envVars:
      - key: VITE_API_URL
        value: https://api-staging.onrender.com
```

### Performance Optimization

1. **Enable Render CDN**: In service settings → "Enable CDN"
2. **Configure Caching**: Already optimized in nginx.conf
3. **Image Optimization**: Consider using WebP format
4. **Bundle Splitting**: Implement lazy loading for routes

### Security Best Practices

1. **Use HTTPS**: Render provides free SSL certificates
2. **Set Security Headers**: Already configured in nginx.conf
3. **Environment Variables**: Never commit sensitive data
4. **Regular Updates**: Keep dependencies updated

## Cost Optimization

### Free Tier Limitations
- Service spins down after 15 minutes
- Limited to 750 hours/month
- Manual restart required after spin-down

### Recommendations
- Use free tier for development/testing
- Upgrade to Starter ($7/month) for production
- Monitor usage in Render dashboard

## Complete Example Deployment

Here's a complete walkthrough:

```bash
# 1. Ensure backend is deployed first
# Backend URL: https://animal-analyzer-api.onrender.com

# 2. Update your frontend code
cd animal-character-analyze-app
git pull origin main

# 3. Test locally with production backend
./docker-build-and-run.sh https://animal-analyzer-api.onrender.com

# 4. Push to GitHub
git push origin main

# 5. Create service on Render
# - Name: animal-analyzer-frontend
# - Environment: Docker
# - Set VITE_API_URL: https://animal-analyzer-api.onrender.com

# 6. Access your app
# https://animal-analyzer-frontend.onrender.com
```

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Render Status Page](https://status.render.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## Quick Reference

### URLs After Deployment
- Frontend: `https://[your-service-name].onrender.com`
- Health Check: `https://[your-service-name].onrender.com/health`
- Backend API: `https://[your-backend-service].onrender.com`

### Common Commands
```bash
# Test build locally
docker build -t test-frontend .

# Run locally
docker run -p 3000:80 -e VITE_API_URL=https://api.onrender.com test-frontend

# Check image size
docker images | grep test-frontend
```

### Environment Variables Reference
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `https://api.onrender.com` |
| `PORT` | No | Internal port (default: 80) | `80` |