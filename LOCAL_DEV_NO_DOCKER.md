# Local Development with Cloud Databases

If Docker doesn't work on your system, use these free cloud databases:

## PostgreSQL - Supabase (Free)

1. Sign up: https://supabase.com
2. Create new project: `ai-code-tutor`
3. Get connection string from Project Settings → Database
4. Paste into `backend/.env`:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres
   ```

## Redis - Upstash (Free)

1. Sign up: https://console.upstash.com
2. Create database: `ai-code-tutor-redis`
3. Copy connection string
4. Paste into `backend/.env`:
   ```
   REDIS_URL=redis://[YOUR-UPSTASH-URL]
   ```

## Then Run Migrations and Start

```bash
# Run migrations
npm run migrate --workspace=backend

# Start dev servers
npm run dev
```

No Docker needed! ✨
