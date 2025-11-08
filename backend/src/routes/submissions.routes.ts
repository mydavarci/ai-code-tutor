import { Router } from 'express';
import { SubmissionService } from '../services/submission.service';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const submissionService = new SubmissionService();

// Submit code
router.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { exerciseId, code } = req.body;

    if (!exerciseId || !code) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'exerciseId and code are required',
        },
      });
    }

    const result = await submissionService.submitCode(req.userId!, exerciseId, code);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Exercise not found') {
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

// Get user submissions
router.get('/history', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const submissions = await submissionService.getUserSubmissions(req.userId!, limit);

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
