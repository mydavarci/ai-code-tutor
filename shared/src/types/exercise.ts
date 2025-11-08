import { Category, Difficulty } from './topic';

export interface TestCase {
  input: any;
  expected: any;
  description?: string;
}

export interface Exercise {
  id: string;
  category: Category;
  topicId: string;
  difficulty: Difficulty;
  prompt: string;
  starterCode: string;
  solution: string;
  solutionExplanation: string;
  tests: TestCase[];
  createdAt: Date;
}

export interface GenerateExerciseRequest {
  category: Category;
  topicId: string;
  difficulty: Difficulty;
}

export interface GenerateExerciseResponse {
  exercise: Exercise;
}
