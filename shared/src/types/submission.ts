export interface TestResult {
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
  error?: string;
  description?: string;
}

export interface SubmissionResult {
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  results: TestResult[];
}

export interface AIFeedback {
  overall: string;
  suggestions: string[];
  encouragement: string;
  hint?: string;
}

export interface Submission {
  id: string;
  userId: string;
  exerciseId: string;
  code: string;
  result: SubmissionResult;
  feedback?: AIFeedback;
  passed: boolean;
  createdAt: Date;
}

export interface SubmitCodeRequest {
  exerciseId: string;
  code: string;
}

export interface SubmitCodeResponse {
  submission: Submission;
  xpEarned?: number;
  streakUpdated?: boolean;
}
