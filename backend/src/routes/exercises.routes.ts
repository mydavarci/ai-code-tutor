import { Router } from 'express';
import { ExerciseService } from '../services/exercise.service';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { Category, Difficulty } from '@ai-code-tutor/shared';

const router = Router();
const exerciseService = new ExerciseService();

// Generate new exercise
router.post('/generate', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { category, topicId, difficulty } = req.body;

    if (!category || !topicId || !difficulty) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'category, topicId, and difficulty are required',
        },
      });
    }

    if (!Object.values(Category).includes(category)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid category',
        },
      });
    }

    const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid difficulty',
        },
      });
    }

    const exercise = await exerciseService.generateExercise(category, topicId, difficulty);

    // Don't return solution to client
    const { solution, solutionExplanation, ...exerciseWithoutSolution } = exercise;

    res.json({
      success: true,
      data: exerciseWithoutSolution,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Topic not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message,
        },
      });
    }
    next(error);
  }
});

// Get solution for an exercise
router.post('/solution', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { exerciseId } = req.body;

    if (!exerciseId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'exerciseId is required',
        },
      });
    }

    const solution = await exerciseService.getSolution(exerciseId);

    if (!solution) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Exercise not found',
        },
      });
    }

    // Record that user viewed the solution
    await exerciseService.recordSolutionView(req.userId!, exerciseId);

    res.json({
      success: true,
      data: solution,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
