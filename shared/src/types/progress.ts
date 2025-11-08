export interface TopicProgress {
  userId: string;
  topicId: string;
  solvedCount: number;
  totalAttempts: number;
  completedAt?: Date;
  lastActivityAt: Date;
}

export interface UserProgress {
  totalExercisesSolved: number;
  totalXP: number;
  topicProgress: TopicProgress[];
  completedTopics: string[];
}

export const COMPLETION_THRESHOLD = 5;
