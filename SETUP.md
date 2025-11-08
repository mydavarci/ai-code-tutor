# AI Code Tutor - Setup Guide

This guide will help you get the AI Code Tutor platform up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/get-started))
- **OpenAI API Key** (or compatible AI service) ([Get API Key](https://platform.openai.com/api-keys))

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Install all dependencies (frontend, backend, shared)
npm install
```

### 2. Start Database Services

Start PostgreSQL and Redis using Docker Compose:

```bash
docker-compose up -d
```

Wait for services to be healthy:
```bash
docker-compose ps
```

### 3. Configure Environment Variables

Create backend environment file:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your OpenAI API key:

```env
# Required: Add your OpenAI API key
OPENAI_API_KEY=sk-your-actual-api-key-here

# Optional: Customize other settings
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_code_tutor
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-in-production
```

### 4. Run Database Migrations

Set up the database schema and seed data:

```bash
npm run migrate --workspace=backend
```

This will:
- Create all necessary tables
- Set up default categories (JavaScript, React)
- Add predefined topics

### 5. Start Development Servers

Start both frontend and backend:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## First Time Usage

1. Open http://localhost:5173 in your browser
2. Click "Sign Up" and create an account
3. After logging in, you'll see the Dashboard
4. Navigate to "Practice" to start solving exercises

## Project Structure

```
ai-code-tutor/
├── frontend/          # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand state management
│   │   └── lib/          # Utilities and API client
│   └── package.json
│
├── backend/           # Node.js + Express backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── db/           # Database configuration
│   │   └── config/       # App configuration
│   └── package.json
│
├── shared/            # Shared TypeScript types
│   └── src/types/
│
└── docker-compose.yml # Database services
```

## Development Workflow

### Running Individual Services

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Building for Production

```bash
# Build all workspaces
npm run build

# Start production server
npm run start --workspace=backend
```

### Database Management

```bash
# Run migrations
npm run migrate --workspace=backend

# Access PostgreSQL CLI
docker exec -it ai-code-tutor-db psql -U postgres -d ai_code_tutor

# Access Redis CLI
docker exec -it ai-code-tutor-redis redis-cli
```

## Features Checklist

The MVP includes:

- ✅ User authentication (signup/login)
- ✅ Topic and difficulty selection
- ✅ AI-powered exercise generation
- ✅ Monaco Editor integration
- ✅ Code execution and testing
- ✅ AI feedback on submissions
- ✅ "View Solution" feature
- ✅ Daily streak tracking
- ✅ Progress monitoring
- ✅ Topic completion system

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart database services
docker-compose restart postgres

# View logs
docker-compose logs postgres
```

### Port Already in Use

If ports 3000, 5173, 5432, or 6379 are already in use:

1. Stop conflicting services
2. Or modify ports in:
   - `backend/.env` (PORT)
   - `frontend/vite.config.ts` (server.port)
   - `docker-compose.yml` (ports)

### OpenAI API Issues

- Verify your API key is correct in `backend/.env`
- Check your OpenAI account has credits
- Review rate limits on your OpenAI account

### Monaco Editor Not Loading

Clear browser cache and refresh:
```bash
# In browser DevTools Console
localStorage.clear()
location.reload()
```

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment | No | development |
| `DATABASE_URL` | PostgreSQL connection | Yes | - |
| `REDIS_URL` | Redis connection | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `OPENAI_MODEL` | AI model to use | No | gpt-4-turbo-preview |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `CORS_ORIGIN` | Allowed CORS origin | No | http://localhost:5173 |

## Next Steps

After getting the MVP running:

1. **Customize Topics**: Add more topics in the database
2. **Adjust Difficulty**: Fine-tune AI prompts for better exercise generation
3. **Extend Languages**: Add TypeScript or Python support
4. **Add Analytics**: Track user engagement metrics
5. **Deploy**: Set up production deployment (see DEPLOYMENT.md)

## Getting Help

- Check the [README.md](./README.md) for general information
- Review code comments for implementation details
- Open an issue if you encounter bugs

## License

MIT
