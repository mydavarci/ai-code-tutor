# Railway Deployment Guide

This guide will walk you through deploying the AI Code Tutor platform to Railway.

## Prerequisites

1. **Railway Account**: Sign up at https://railway.app
2. **GitHub Account**: Your code should be in a GitHub repository
3. **OpenAI API Key**: Get one from https://platform.openai.com/api-keys

## Deployment Steps

### Step 1: Prepare Your Repository

Ensure all changes are committed and pushed:
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push
```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select your `ai-code-tutor` repository

### Step 3: Set Up Backend Service

Railway will auto-detect your project. You need to set up 3 services:

#### 3.1 Create PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create the database
4. Note: The `DATABASE_URL` environment variable is automatically added

#### 3.2 Create Redis Database

1. Click "New" again
2. Select "Database" → "Redis"
3. Railway will automatically create Redis
4. Note: The `REDIS_URL` environment variable is automatically added

#### 3.3 Deploy Backend Service

1. Click "New" → "GitHub Repo" → Select your repo
2. Railway will detect it as a monorepo
3. **Important**: Set the root directory:
   - Click on the service settings (gear icon)
   - Go to "Settings" → "Root Directory"
   - Set to: `backend`
   - Click "Save"

4. **Add Environment Variables**:
   Click "Variables" tab and add these:

   ```
   NODE_ENV=production
   PORT=3000

   # OpenAI (REQUIRED - Add your key)
   OPENAI_API_KEY=sk-your-openai-api-key-here
   OPENAI_MODEL=gpt-4-turbo-preview

   # JWT Secrets (Generate random strings)
   JWT_SECRET=your-random-secret-at-least-32-chars-long
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_SECRET=your-random-refresh-secret-at-least-32-chars
   JWT_REFRESH_EXPIRES_IN=7d

   # CORS (Will be set after frontend deploys)
   CORS_ORIGIN=*

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

   **Note**: `DATABASE_URL` and `REDIS_URL` are automatically set by Railway

5. **Deploy the backend**:
   - Railway will automatically build and deploy
   - Wait for the deployment to complete (check logs)

6. **Run Database Migrations**:
   - Once deployed, click on your backend service
   - Go to "Settings" → "Deploy Trigger"
   - Add a one-time command: `npm run migrate`
   - Or use the Railway CLI (see below)

7. **Get Backend URL**:
   - Click "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://your-backend.railway.app`)

#### 3.4 Deploy Frontend Service

1. Click "New" → "GitHub Repo" → Select your repo again
2. **Set Root Directory**:
   - Go to "Settings" → "Root Directory"
   - Set to: `frontend`
   - Click "Save"

3. **Add Environment Variables**:
   Click "Variables" tab and add:

   ```
   # Backend API URL (use the backend URL from step 3.3.7)
   VITE_API_URL=https://your-backend.railway.app/api
   ```

4. **Generate Domain**:
   - Click "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://your-frontend.railway.app`)

5. **Update Backend CORS**:
   - Go back to your **backend service**
   - Update the `CORS_ORIGIN` environment variable:
     ```
     CORS_ORIGIN=https://your-frontend.railway.app
     ```
   - The backend will automatically redeploy

### Step 4: Verify Deployment

1. Visit your frontend URL: `https://your-frontend.railway.app`
2. Try to sign up for a new account
3. Generate an exercise and test the full flow
4. Check the backend logs if anything fails

## Alternative: Railway CLI Method

If you prefer using the CLI:

### 1. Install Railway CLI
```bash
npm i -g @railway/cli
```

### 2. Login
```bash
railway login
```

### 3. Initialize Project
```bash
railway init
```

### 4. Add Services
```bash
# Add PostgreSQL
railway add --database postgres

# Add Redis
railway add --database redis
```

### 5. Deploy Backend
```bash
cd backend
railway up
```

### 6. Run Migrations
```bash
railway run npm run migrate
```

### 7. Deploy Frontend
```bash
cd ../frontend
railway up
```

## Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-...` |
| `JWT_SECRET` | Secret for signing JWT tokens | Random 32+ char string |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Random 32+ char string |
| `CORS_ORIGIN` | Frontend URL for CORS | `https://your-app.railway.app` |
| `DATABASE_URL` | PostgreSQL connection (auto) | Auto-set by Railway |
| `REDIS_URL` | Redis connection (auto) | Auto-set by Railway |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend.railway.app/api` |

## Generating Secure Secrets

For `JWT_SECRET` and `JWT_REFRESH_SECRET`, use:

```bash
# On Mac/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or generate online
# https://www.random.org/strings/
```

## Monitoring

### View Logs
1. Go to Railway dashboard
2. Click on a service (backend/frontend)
3. Click "View Logs"
4. Monitor for errors

### Check Health
- Backend health: `https://your-backend.railway.app/health`
- Should return: `{"status":"ok","timestamp":"..."}`

## Custom Domain (Optional)

1. Go to your service in Railway
2. Click "Settings" → "Networking"
3. Click "Custom Domain"
4. Follow instructions to add DNS records
5. Railway provides free SSL certificates

## Troubleshooting

### Backend Won't Start

**Check logs for common issues:**

1. **Missing OpenAI API Key**:
   - Error: AI service errors
   - Fix: Add `OPENAI_API_KEY` in backend variables

2. **Database Connection Failed**:
   - Error: `ECONNREFUSED` or database errors
   - Fix: Ensure PostgreSQL service is running and `DATABASE_URL` is set

3. **Migrations Not Run**:
   - Error: Table/column doesn't exist
   - Fix: Run `railway run npm run migrate` in backend directory

### Frontend Can't Connect to Backend

1. **Check `VITE_API_URL`**:
   - Must be the full backend URL with `/api`
   - Example: `https://backend.railway.app/api`

2. **CORS Errors**:
   - Update backend `CORS_ORIGIN` to match frontend URL
   - Must be exact match (no trailing slash)

3. **Build Errors**:
   - Check that shared package is building correctly
   - Railway should install workspace dependencies

### Database Connection Issues

1. **Connection String**:
   - Railway auto-generates `DATABASE_URL`
   - Format: `postgresql://user:pass@host:port/db`

2. **Migration Issues**:
   ```bash
   # Connect to Railway shell
   railway shell

   # Run migration manually
   npm run migrate
   ```

## Cost Estimation

### Railway Pricing (as of 2024)

- **Hobby Plan**: $5/month
  - $5 free credit included
  - Pay for usage beyond credit

- **Typical Usage** (small-medium traffic):
  - Backend: ~$5-10/month
  - Frontend: ~$0-5/month
  - PostgreSQL: ~$5/month
  - Redis: ~$5/month
  - **Total**: ~$15-25/month

- **Free Tier**:
  - $5 credit/month (can run small apps free)
  - Limited to 500 hours/month per service

## Scaling

As your app grows:

1. **Vertical Scaling**:
   - Settings → Resources
   - Increase memory/CPU

2. **Horizontal Scaling**:
   - Settings → Replicas
   - Increase number of instances

3. **Database**:
   - Upgrade PostgreSQL plan for more storage/connections
   - Add read replicas if needed

## Maintenance

### Updating Code

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Update feature X"
   git push
   ```

2. Railway auto-deploys on push
3. Monitor deployment in Railway dashboard

### Database Backups

- Railway automatically backs up PostgreSQL
- Access backups in Database → Backups
- Can restore to any point in time

### Rolling Back

1. Go to service in Railway
2. Click "Deployments"
3. Find previous successful deployment
4. Click "Redeploy"

## Security Checklist

- ✅ OpenAI API key added as environment variable (not committed)
- ✅ JWT secrets are random and secure (32+ characters)
- ✅ CORS configured with specific frontend URL
- ✅ Rate limiting enabled
- ✅ HTTPS enabled (automatic on Railway)
- ✅ Database backups enabled

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Project Issues**: GitHub Issues

---

**Congratulations!** Your AI Code Tutor platform is now live! 🎉

Share your frontend URL and start helping people learn to code!
