# Railway Quick Start - 5 Minutes

Deploy AI Code Tutor to Railway in 5 minutes!

## Step 1: Push to GitHub (1 min)

```bash
# Make sure all code is pushed
git push
```

## Step 2: Deploy to Railway (2 min)

1. Go to https://railway.app
2. Click **"New Project"**
3. Click **"Deploy from GitHub repo"**
4. Select your **ai-code-tutor** repository
5. Railway detects it and starts deploying

## Step 3: Add Databases (1 min)

In your Railway project:

1. Click **"New"** → **"Database"** → **"PostgreSQL"**
2. Click **"New"** → **"Database"** → **"Redis"**

Railway automatically connects them! ✨

## Step 4: Configure Services (1 min)

### Backend Service

1. Click on the backend service
2. Go to **"Variables"** tab
3. Click **"RAW Editor"** and paste:

```env
OPENAI_API_KEY=sk-your-openai-key-here
JWT_SECRET=generate-a-random-32-char-string
JWT_REFRESH_SECRET=generate-another-random-32-char-string
CORS_ORIGIN=*
NODE_ENV=production
```

4. Click **"Update Variables"**

### Frontend Service

Railway auto-detects and deploys! No config needed initially.

## Step 5: Generate Domains & Update CORS

1. **Backend**:
   - Click service → **"Settings"** → **"Generate Domain"**
   - Copy URL (e.g., `https://backend-xxx.railway.app`)

2. **Frontend**:
   - Click service → **"Settings"** → **"Generate Domain"**
   - Copy URL (e.g., `https://frontend-xxx.railway.app`)

3. **Update Backend CORS**:
   - Go back to backend **"Variables"**
   - Change `CORS_ORIGIN=*` to `CORS_ORIGIN=https://frontend-xxx.railway.app`

4. **Update Frontend API URL**:
   - Go to frontend **"Variables"**
   - Add: `VITE_API_URL=https://backend-xxx.railway.app/api`

## Step 6: Run Database Migration

After backend deploys successfully:

### Option A: Railway Dashboard
1. Backend service → **"Settings"** → scroll to **"Custom Start Command"**
2. Temporarily change to: `npm run migrate && npm run start`
3. Wait for deploy
4. Change back to: `npm run start`

### Option B: Railway CLI (Recommended)
```bash
# Install CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migration
railway run --service backend npm run migrate
```

## Done! 🎉

Visit your frontend URL and start using AI Code Tutor!

## Generate Secure Secrets

For JWT secrets:

```bash
# Mac/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Troubleshooting

### "Can't connect to backend"
- Check frontend `VITE_API_URL` matches backend domain
- Check backend `CORS_ORIGIN` matches frontend domain
- No trailing slashes!

### "Database errors"
- Make sure migration ran successfully
- Check PostgreSQL is running in Railway dashboard

### "AI not working"
- Verify `OPENAI_API_KEY` is set correctly
- Check you have OpenAI credits

## Cost

**Free tier**: $5/month credit (enough for testing)
**Typical cost**: $15-25/month for production use

## Next Steps

- See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
- Set up custom domain
- Configure monitoring
- Set up backups

---

Need help? Check the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide!
