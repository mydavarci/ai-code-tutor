import { query, getClient } from '../db';
import type { UserProgress, TopicProgress } from '@ai-code-tutor/shared';
import { COMPLETION_THRESHOLD } from '@ai-code-tutor/shared';

export class ProgressService {
  async updateProgress(userId: string, topicId: string): Promise<void> {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Upsert progress
      await client.query(
        `INSERT INTO progress (user_id, topic_id, solved_count, total_attempts, last_activity_at)
         VALUES ($1, $2, 1, 1, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, topic_id)
         DO UPDATE SET
           solved_count = progress.solved_count + 1,
           total_attempts = progress.total_attempts + 1,
           last_activity_at = CURRENT_TIMESTAMP`,
        [userId, topicId]
      );

      // Check if topic should be marked as completed
      const progressResult = await client.query(
        'SELECT solved_count FROM progress WHERE user_id = $1 AND topic_id = $2',
        [userId, topicId]
      );

      const solvedCount = progressResult.rows[0].solved_count;

      if (solvedCount >= COMPLETION_THRESHOLD) {
        await client.query(
          `UPDATE progress
           SET completed_at = COALESCE(completed_at, CURRENT_TIMESTAMP)
           WHERE user_id = $1 AND topic_id = $2`,
          [userId, topicId]
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserProgress(userId: string): Promise<UserProgress> {
    // Get topic progress
    const progressResult = await query(
      `SELECT
         p.topic_id,
         p.solved_count,
         p.total_attempts,
         p.completed_at,
         p.last_activity_at
       FROM progress p
       WHERE p.user_id = $1
       ORDER BY p.last_activity_at DESC`,
      [userId]
    );

    const topicProgress: TopicProgress[] = progressResult.rows.map(row => ({
      userId,
      topicId: row.topic_id,
      solvedCount: row.solved_count,
      totalAttempts: row.total_attempts,
      completedAt: row.completed_at,
      lastActivityAt: row.last_activity_at,
    }));

    // Get totals
    const totalsResult = await query(
      `SELECT
         COUNT(*) FILTER (WHERE passed = true) as total_solved,
         COUNT(DISTINCT topic_id) FILTER (WHERE completed_at IS NOT NULL) as completed_topics
       FROM progress p
       LEFT JOIN submissions s ON s.user_id = p.user_id
       WHERE p.user_id = $1`,
      [userId]
    );

    const totalExercisesSolved = parseInt(totalsResult.rows[0]?.total_solved || '0', 10);
    const completedTopics = progressResult.rows
      .filter(row => row.completed_at)
      .map(row => row.topic_id);

    // Calculate total XP (simple calculation based on solved exercises)
    const totalXP = totalExercisesSolved * 20; // Average XP per exercise

    return {
      totalExercisesSolved,
      totalXP,
      topicProgress,
      completedTopics,
    };
  }
}
