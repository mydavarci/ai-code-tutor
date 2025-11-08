# AI Code Tutor - Interactive Coding Platform

A comprehensive web-based learning platform where users practice JavaScript and React through AI-generated exercises, receive intelligent feedback, and track their progress with gamification features.

## 🎯 Overview

AI Code Tutor provides an interactive environment for developers to improve their coding skills through:

- **AI-Generated Exercises**: Personalized coding challenges tailored to your selected topic and difficulty level
- **Real-time Feedback**: Intelligent AI analysis of your code with actionable suggestions
- **Browser-Based IDE**: Full-featured Monaco Editor (VS Code's editor) running in your browser
- **Progress Tracking**: Monitor your improvement across topics with completion tracking
- **Streak System**: Stay motivated with daily coding streaks and XP rewards
- **Multi-Level Learning**: Progress from Easy to Expert across 18+ topics

## ✨ Features

### Core Features (MVP - Completed)

- ✅ **User Authentication**: Secure signup/login with JWT
- ✅ **Topic Selection**: Choose from JavaScript or React, 18+ subtopics
- ✅ **4 Difficulty Levels**: Easy, Medium, Hard, Expert
- ✅ **AI Exercise Generation**: Unique exercises generated on-demand
- ✅ **Monaco Editor**: Professional code editor with syntax highlighting
- ✅ **Automated Testing**: Run test cases against your code
- ✅ **AI Feedback**: Get constructive feedback on your solutions
- ✅ **Solution Viewing**: Learn from reference solutions with explanations
- ✅ **Daily Streaks**: Track consecutive days of practice
- ✅ **Progress Dashboard**: Visualize your learning journey
- ✅ **Topic Completion**: Unlock achievements by mastering topics

### Topics Covered

**JavaScript**:
- Variables & Data Types
- Functions
- Arrays
- Objects
- Promises & Async
- DOM Manipulation
- Algorithms
- Closures
- Prototypes

**React**:
- JSX & Components
- State & Props
- React Hooks
- Custom Hooks
- Context API
- useReducer
- Redux
- React Router
- Performance Optimization

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker** & Docker Compose ([Download](https://www.docker.com/get-started))
- **OpenAI API Key** ([Get Key](https://platform.openai.com/api-keys))

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Start database services**
   ```bash
   docker-compose up -d
   ```

3. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your OPENAI_API_KEY
   ```

4. **Run database migrations**
   ```bash
   npm run migrate --workspace=backend
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 🏗️ Architecture

### Technology Stack

**Frontend**:
- React 18 + TypeScript
- Vite (build tool)
- Monaco Editor (code editor)
- Tailwind CSS (styling)
- Zustand (state management)
- Axios (API client)
- React Router (navigation)

**Backend**:
- Node.js + Express
- TypeScript
- PostgreSQL (database)
- Redis (caching & rate limiting)
- OpenAI API (AI features)
- JWT (authentication)
- bcrypt (password hashing)

**Shared**:
- TypeScript types
- Zod validation schemas

### Project Structure

```
ai-code-tutor/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand stores
│   │   ├── lib/             # Utilities
│   │   └── main.tsx
│   └── package.json
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── db/              # Database
│   │   └── config/
│   └── package.json
│
├── shared/                   # Shared TypeScript types
│   └── src/types/
│
├── docker-compose.yml        # Database services
└── package.json              # Root workspace config
```

## 📖 How It Works

### User Flow

1. **Authentication**: Users sign up or log in
2. **Topic Selection**: Choose category (JS/React), topic, and difficulty
3. **Exercise Generation**: AI generates a unique coding challenge
4. **Coding**: Write solution in Monaco Editor
5. **Submission**: Code is tested and evaluated
6. **Feedback**: Receive AI-powered feedback and suggestions
7. **Solution**: Optionally view reference solution
8. **Progress**: Track completion and maintain streaks

### AI Integration

The platform uses OpenAI's GPT models to:
- Generate contextual coding exercises
- Create test cases
- Provide solution explanations
- Analyze submitted code
- Offer personalized feedback and hints

### Code Execution

- **Browser-based** (MVP): Safe execution using `Function` constructor
- **Future**: Server-side sandboxed execution with Docker containers

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting per IP and user
- CORS protection
- Helmet.js security headers
- Input validation with Zod
- SQL injection prevention (parameterized queries)

## 🎮 Gamification

- **Daily Streaks**: Consecutive days of practice
- **XP System**: Earn points based on difficulty
  - Easy: 10 XP
  - Medium: 25 XP
  - Hard: 50 XP
  - Expert: 100 XP
- **Topic Completion**: Solve 5+ exercises to complete a topic
- **Progress Tracking**: Visual progress bars and statistics

## 🛣️ Roadmap

### Phase 2 - Quality (Planned)
- [ ] Server-side secure code execution
- [ ] React-specific UI exercises
- [ ] Enhanced test suites
- [ ] User profiles and badges
- [ ] A/B testing framework

### Phase 3 - Growth (Future)
- [ ] TypeScript support
- [ ] Python exercises
- [ ] Multiplayer challenges
- [ ] Teacher/classroom mode
- [ ] Shareable exercise links
- [ ] Community-contributed exercises
- [ ] Mobile app

## 🚢 Deployment

### Deploy to Railway (Recommended)

The easiest way to deploy AI Code Tutor is using Railway:

**Quick Start (5 minutes)**:
1. Push your code to GitHub
2. Go to https://railway.app and create a new project
3. Deploy from your GitHub repo
4. Add PostgreSQL and Redis databases
5. Configure environment variables
6. Done! ✨

📖 **Detailed Guide**: See [RAILWAY_QUICK_START.md](./RAILWAY_QUICK_START.md) for step-by-step instructions

📖 **Full Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide

### Other Platforms

The platform can also be deployed to:
- **Vercel** (frontend) + **Render** (backend)
- **Netlify** (frontend) + **Railway** (backend)
- **AWS**, **GCP**, or **Azure** (advanced)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Commands

```bash
# Install dependencies
npm install

# Development mode (runs frontend + backend)
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Build all workspaces
npm run build

# Run database migrations
npm run migrate --workspace=backend

# Start databases
docker-compose up -d

# Stop databases
docker-compose down
```

## 📊 API Documentation

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Topics
- `GET /api/topics` - Get all categories and topics

### Exercises
- `POST /api/exercises/generate` - Generate new exercise
- `POST /api/exercises/solution` - Get solution

### Submissions
- `POST /api/submissions` - Submit code
- `GET /api/submissions/history` - Get submission history

### Progress
- `GET /api/progress` - Get user progress
- `GET /api/progress/streak` - Get streak info

## 🐛 Troubleshooting

See [SETUP.md](./SETUP.md#troubleshooting) for common issues and solutions.

## 📝 License

MIT License - feel free to use this project for learning or as a base for your own platform.

## 🙏 Acknowledgments

- Monaco Editor by Microsoft
- OpenAI for AI capabilities
- The open-source community

---

**Happy Coding!** 🚀
