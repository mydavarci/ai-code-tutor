import { Router } from 'express';
import { ProgressService } from '../services/progress.service';
import { StreakService } from '../services/streak.service';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const progressService = new ProgressService();
const streakService = new StreakService();

// Get user progress
router.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const progress = await progressService.getUserProgress(req.userId!);

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
});

// Get user streak
router.get('/streak', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const streak = await streakService.getStreak(req.userId!);

    res.json({
      success: true,
      data: streak,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
