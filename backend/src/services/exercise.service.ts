import { query } from '../db';
import { AIService } from './ai.service';
import type { Category, Difficulty, Exercise } from '@ai-code-tutor/shared';

export class ExerciseService {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  async generateExercise(
    category: Category,
    topicId: string,
    difficulty: Difficulty
  ): Promise<Exercise> {
    // Get topic name
    const topicResult = await query('SELECT name FROM topics WHERE id = $1', [topicId]);
    if (topicResult.rows.length === 0) {
      throw new Error('Topic not found');
    }
    const topicName = topicResult.rows[0].name;

    // Generate exercise using AI
    const exerciseData = await this.aiService.generateExercise(
      category,
      topicId,
      topicName,
      difficulty
    );

    // Save to database
    const result = await query(
      `INSERT INTO exercises (category, topic_id, difficulty, prompt, starter_code, solution, solution_explanation, tests)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, category, topic_id, difficulty, prompt, starter_code, solution, solution_explanation, tests, created_at`,
      [
        exerciseData.category,
        exerciseData.topicId,
        exerciseData.difficulty,
        exerciseData.prompt,
        exerciseData.starterCode,
        exerciseData.solution,
        exerciseData.solutionExplanation,
        JSON.stringify(exerciseData.tests),
      ]
    );

    return this.mapExercise(result.rows[0]);
  }

  async getExercise(exerciseId: string): Promise<Exercise | null> {
    const result = await query(
      'SELECT * FROM exercises WHERE id = $1',
      [exerciseId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapExercise(result.rows[0]);
  }

  async getSolution(exerciseId: string): Promise<{ solution: string; explanation: string } | null> {
    const result = await query(
      'SELECT solution, solution_explanation FROM exercises WHERE id = $1',
      [exerciseId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      solution: result.rows[0].solution,
      explanation: result.rows[0].solution_explanation,
    };
  }

  async recordSolutionView(userId: string, exerciseId: string): Promise<void> {
    await query(
      'INSERT INTO solution_views (user_id, exercise_id) VALUES ($1, $2)',
      [userId, exerciseId]
    );
  }

  private mapExercise(row: any): Exercise {
    return {
      id: row.id,
      category: row.category,
      topicId: row.topic_id,
      difficulty: row.difficulty,
      prompt: row.prompt,
      starterCode: row.starter_code,
      solution: row.solution,
      solutionExplanation: row.solution_explanation,
      tests: JSON.parse(row.tests),
      createdAt: row.created_at,
    };
  }
}
