import { query } from '../db';
import { ExecutorService } from './executor.service';
import { AIService } from './ai.service';
import { ProgressService } from './progress.service';
import { StreakService } from './streak.service';
import type { Submission, SubmitCodeResponse } from '@ai-code-tutor/shared';

export class SubmissionService {
  private executorService: ExecutorService;
  private aiService: AIService;
  private progressService: ProgressService;
  private streakService: StreakService;

  constructor() {
    this.executorService = new ExecutorService();
    this.aiService = new AIService();
    this.progressService = new ProgressService();
    this.streakService = new StreakService();
  }

  async submitCode(
    userId: string,
    exerciseId: string,
    code: string
  ): Promise<SubmitCodeResponse> {
    // Get exercise
    const exerciseResult = await query(
      'SELECT * FROM exercises WHERE id = $1',
      [exerciseId]
    );

    if (exerciseResult.rows.length === 0) {
      throw new Error('Exercise not found');
    }

    const exercise = exerciseResult.rows[0];
    const tests = JSON.parse(exercise.tests);

    // Execute code and run tests
    const result = await this.executorService.executeCode(code, tests);

    // Generate AI feedback
    const feedback = await this.aiService.generateFeedback(
      code,
      exercise.prompt,
      result.results,
      result.allPassed
    );

    // Save submission
    const submissionResult = await query(
      `INSERT INTO submissions (user_id, exercise_id, code, result, feedback, passed)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, exercise_id, code, result, feedback, passed, created_at`,
      [userId, exerciseId, code, JSON.stringify(result), JSON.stringify(feedback), result.allPassed]
    );

    const submission = this.mapSubmission(submissionResult.rows[0]);

    let xpEarned = 0;
    let streakUpdated = false;

    // Update progress and streak if passed
    if (result.allPassed) {
      await this.progressService.updateProgress(userId, exercise.topic_id);
      const streakResult = await this.streakService.updateStreak(userId);
      streakUpdated = streakResult.increased;

      // Calculate XP based on difficulty
      const difficultyXP = {
        easy: 10,
        medium: 25,
        hard: 50,
        expert: 100,
      };
      xpEarned = difficultyXP[exercise.difficulty as keyof typeof difficultyXP] || 10;
    }

    return {
      submission,
      xpEarned: result.allPassed ? xpEarned : undefined,
      streakUpdated,
    };
  }

  async getUserSubmissions(userId: string, limit = 50): Promise<Submission[]> {
    const result = await query(
      `SELECT * FROM submissions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows.map(row => this.mapSubmission(row));
  }

  private mapSubmission(row: any): Submission {
    return {
      id: row.id,
      userId: row.user_id,
      exerciseId: row.exercise_id,
      code: row.code,
      result: JSON.parse(row.result),
      feedback: row.feedback ? JSON.parse(row.feedback) : undefined,
      passed: row.passed,
      createdAt: row.created_at,
    };
  }
}
