export interface Streak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
}

export interface StreakUpdateResponse {
  streak: Streak;
  increased: boolean;
}
