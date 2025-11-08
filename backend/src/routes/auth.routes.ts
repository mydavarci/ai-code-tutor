import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { loginSchema, signupSchema } from '@ai-code-tutor/shared';

const router = Router();
const authService = new AuthService();

// Signup
router.post('/signup', async (req, res, next) => {
  try {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: validation.error.errors,
        },
      });
    }

    const { email, password } = validation.data;
    const result = await authService.signup(email, password);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'User already exists') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: error.message,
        },
      });
    }
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: validation.error.errors,
        },
      });
    }

    const { email, password } = validation.data;
    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: error.message,
        },
      });
    }
    next(error);
  }
});

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Refresh token required',
        },
      });
    }

    const tokens = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid refresh token') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: error.message,
        },
      });
    }
    next(error);
  }
});

export default router;
