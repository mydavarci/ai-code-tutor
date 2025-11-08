import { query, getClient } from '../db';
import type { Streak, StreakUpdateResponse } from '@ai-code-tutor/shared';

export class StreakService {
  async updateStreak(userId: string): Promise<StreakUpdateResponse> {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Get current streak
      const streakResult = await client.query(
        'SELECT * FROM streaks WHERE user_id = $1',
        [userId]
      );

      const today = new Date().toISOString().split('T')[0];
      let increased = false;

      if (streakResult.rows.length === 0) {
        // Create new streak
        await client.query(
          `INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date)
           VALUES ($1, 1, 1, $2)`,
          [userId, today]
        );
        increased = true;
      } else {
        const streak = streakResult.rows[0];
        const lastDate = new Date(streak.last_activity_date).toISOString().split('T')[0];

        if (lastDate === today) {
          // Already counted today, no change
          increased = false;
        } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          let newStreak: number;

          if (lastDate === yesterdayStr) {
            // Consecutive day
            newStreak = streak.current_streak + 1;
          } else {
            // Streak broken, reset to 1
            newStreak = 1;
          }

          const newLongest = Math.max(newStreak, streak.longest_streak);

          await client.query(
            `UPDATE streaks
             SET current_streak = $1, longest_streak = $2, last_activity_date = $3
             WHERE user_id = $4`,
            [newStreak, newLongest, today, userId]
          );

          increased = true;
        }
      }

      // Get updated streak
      const updatedResult = await client.query(
        'SELECT * FROM streaks WHERE user_id = $1',
        [userId]
      );

      await client.query('COMMIT');

      const streak = this.mapStreak(updatedResult.rows[0]);

      return { streak, increased };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getStreak(userId: string): Promise<Streak | null> {
    const result = await query(
      'SELECT * FROM streaks WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapStreak(result.rows[0]);
  }

  private mapStreak(row: any): Streak {
    return {
      userId: row.user_id,
      currentStreak: row.current_streak,
      longestStreak: row.longest_streak,
      lastActivityDate: row.last_activity_date,
    };
  }
}
