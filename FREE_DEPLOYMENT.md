# Free Deployment Guide - $0/month

Deploy AI Code Tutor completely **FREE** using:
- **Render** (Backend + Database) - Free tier
- **Vercel** (Frontend) - Free tier
- **Upstash** (Redis) - Free tier

## 🆓 What's Free

| Service | Free Tier Limits | Perfect For |
|---------|-----------------|-------------|
| **Render** | 750 hours/month web service | Backend API |
| **Render** | 1GB PostgreSQL | Database |
| **Upstash** | 10,000 commands/day Redis | Caching |
| **Vercel** | Unlimited deployments | Frontend |

**Note**: Render free tier "spins down" after 15 mins of inactivity (first request takes 30-60s to wake up). Upgrade to $7/month for always-on.

---

## 🚀 Quick Deployment (15 minutes)

### Step 1: Deploy Backend to Render (5 min)

#### 1.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (free)

#### 1.2 Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**
2. Settings:
   - **Name**: `ai-code-tutor-db`
   - **Database**: `ai_code_tutor`
   - **User**: `postgres`
   - **Region**: Choose closest to you
   - **Plan**: **Free**
3. Click **"Create Database"**
4. Wait 2-3 minutes for provisioning
5. Copy the **"Internal Database URL"** (starts with `postgresql://`)

#### 1.3 Deploy Backend Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Settings:
   - **Name**: `ai-code-tutor-backend`
   - **Region**: Same as database
   - **Branch**: `claude/interactive-coding-platform-011CUw9w9ybdvyQqAZk5YUPV`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: **Free**

4. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

```env
NODE_ENV=production
PORT=10000

# Database (paste the Internal Database URL from step 1.2)
DATABASE_URL=postgresql://...your-internal-url...

# Redis (we'll add this in step 2)
REDIS_URL=redis://...will-add-later...

# OpenAI (REQUIRED - add your key)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# JWT Secrets (generate random strings)
JWT_SECRET=your-random-secret-min-32-chars
JWT_REFRESH_SECRET=your-random-refresh-secret-min-32-chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS (we'll update after frontend deploys)
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes first time)
7. Copy your backend URL (e.g., `https://ai-code-tutor-backend.onrender.com`)

#### 1.4 Run Database Migration

Once deployed:
1. Go to your backend service
2. Click **"Shell"** tab (on the left)
3. Run:
   ```bash
   npm run migrate
   ```
4. Wait for "Migrations completed successfully!"

---

### Step 2: Create Free Redis (2 min)

#### 2.1 Create Upstash Account
1. Go to https://console.upstash.com
2. Sign up with GitHub (free)

#### 2.2 Create Redis Database
1. Click **"Create Database"**
2. Settings:
   - **Name**: `ai-code-tutor-redis`
   - **Type**: **Regional** (free)
   - **Region**: Choose closest
3. Click **"Create"**
4. Copy **"REST URL"** from dashboard
5. Copy the connection string that looks like: `redis://default:xxxxx@region.upstash.io:6379`

#### 2.3 Update Backend Environment
1. Go back to Render backend service
2. Click **"Environment"** tab
3. Update `REDIS_URL` with Upstash URL
4. Service will auto-redeploy

---

### Step 3: Deploy Frontend to Vercel (3 min)

#### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (free)

#### 3.2 Deploy Frontend
1. Click **"Add New..."** → **"Project"**
2. Import your `ai-code-tutor` repo
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   Click "Environment Variables" and add:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
   (Use your backend URL from Step 1.3.7)

5. Click **"Deploy"**
6. Wait 2-3 minutes
7. Copy your frontend URL (e.g., `https://ai-code-tutor-xxx.vercel.app`)

---

### Step 4: Update CORS (1 min)

1. Go to Render backend service
2. Click **"Environment"** tab
3. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://ai-code-tutor-xxx.vercel.app
   ```
   (Use your exact Vercel URL, no trailing slash)
4. Service will auto-redeploy

---

## ✅ Test Your Deployment

1. Visit your Vercel frontend URL
2. Sign up for a new account
3. Try generating an exercise
4. Submit some code
5. Check progress tracking

**First request might take 30-60 seconds** (Render free tier wake-up time)

---

## 🎯 Free Tier Limitations

### Render Free Tier
- ✅ **Pros**:
  - Completely free
  - PostgreSQL included
  - Auto-deploys from GitHub

- ⚠️ **Limitations**:
  - Spins down after 15 mins inactivity
  - First request after sleep: 30-60s delay
  - 750 hours/month (enough for 1 service always-on OR multiple services with sleep)

### Upstash Redis Free Tier
- ✅ 10,000 commands/day
- ✅ 256MB storage
- ⚠️ Rate limits apply

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Fast global CDN
- ⚠️ Serverless functions limited

---

## 💡 Tips for Free Tier

### Keep Backend Awake (Optional)
Use a free service like **Cron-job.org** or **UptimeRobot** to ping your backend every 10 minutes:

1. Sign up at https://uptimerobot.com (free)
2. Add monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://your-backend.onrender.com/health`
   - **Interval**: 15 minutes
3. This keeps your backend awake during active hours

### Reduce Wake-Up Time
- Cache frequently used data in Redis
- Optimize database queries
- Use connection pooling

---

## 🔄 Alternative: All on Render

You can deploy both frontend and backend on Render:

1. **Backend**: Same as above (free web service + PostgreSQL)
2. **Frontend**:
   - New Web Service
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm install -g serve && serve -s dist -p $PORT`
   - Plan: **Free**

**Note**: You'll have 2 free services (total 750 hours/month shared), so both will sleep.

---

## 📊 Cost Comparison

| Option | Cost | Always-On | Best For |
|--------|------|-----------|----------|
| **Free (Render + Vercel)** | $0 | No (sleeps) | Testing, portfolio, low traffic |
| **Render Paid** | $7/month | Yes | Small production apps |
| **Railway** | ~$15-25/month | Yes | Production apps |

---

## 🚀 Upgrade Path

When you're ready for production:

### From Free → Render Paid ($7/month)
1. Go to backend service
2. Click **"Upgrade to Paid"**
3. Select **"Starter"** plan ($7/month)
4. Backend stays awake 24/7!

### From Render → Railway ($15-25/month)
- Better performance
- Included Redis
- More resources
- See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🐛 Troubleshooting Free Tier

### "Service unavailable" on first request
- **Expected!** Free tier sleeps after 15 mins
- Wait 30-60 seconds and try again
- Backend is waking up

### "Database connection failed"
- Check `DATABASE_URL` is the **Internal Database URL** from Render
- Make sure database is fully provisioned (takes 2-3 min)

### "Redis connection errors"
- Verify `REDIS_URL` from Upstash is correct
- Check you're not exceeding 10,000 commands/day

### CORS errors
- Double-check `CORS_ORIGIN` matches Vercel URL exactly
- No trailing slash!
- Wait for backend to redeploy after changing

---

## 🎉 You're Live - For Free!

Congratulations! Your AI Code Tutor platform is running on a completely free stack!

**Share your Vercel URL** and start helping people learn to code! 🚀

### What's Next?
- Add custom domain (free on Vercel)
- Set up uptime monitoring
- Monitor usage to stay within free tiers
- Upgrade when you're ready for production

---

**Questions?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting!
