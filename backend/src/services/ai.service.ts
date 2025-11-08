import OpenAI from 'openai';
import { config } from '../config';
import type { Category, Difficulty, Exercise, TestCase, AIFeedback, TestResult } from '@ai-code-tutor/shared';

export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  async generateExercise(
    category: Category,
    topicId: string,
    topicName: string,
    difficulty: Difficulty
  ): Promise<Omit<Exercise, 'id' | 'createdAt'>> {
    const prompt = this.buildExercisePrompt(category, topicName, difficulty);

    const response = await this.openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert programming tutor. Generate educational coding exercises in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    const exerciseData = JSON.parse(content);

    return {
      category,
      topicId,
      difficulty,
      prompt: exerciseData.prompt,
      starterCode: exerciseData.starterCode,
      solution: exerciseData.solution,
      solutionExplanation: exerciseData.solutionExplanation,
      tests: exerciseData.tests,
    };
  }

  async generateFeedback(
    code: string,
    prompt: string,
    testResults: TestResult[],
    allPassed: boolean
  ): Promise<AIFeedback> {
    const feedbackPrompt = this.buildFeedbackPrompt(code, prompt, testResults, allPassed);

    const response = await this.openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: 'system',
          content: 'You are a supportive programming tutor. Provide constructive, encouraging feedback.',
        },
        {
          role: 'user',
          content: feedbackPrompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    return JSON.parse(content);
  }

  private buildExercisePrompt(category: Category, topicName: string, difficulty: Difficulty): string {
    return `Generate a ${difficulty} level coding exercise for ${category} on the topic: ${topicName}.

Return a JSON object with this exact structure:
{
  "prompt": "Clear description of what the student should implement (2-3 sentences)",
  "starterCode": "Starter code template with function signature and comments",
  "solution": "Complete reference solution",
  "solutionExplanation": "Step-by-step explanation of the solution (3-5 sentences)",
  "tests": [
    {
      "input": <any valid JSON value>,
      "expected": <any valid JSON value>,
      "description": "Brief description of this test case"
    }
  ]
}

Guidelines:
- For ${difficulty} difficulty, create an appropriate challenge level
- Include 4-6 test cases covering normal cases, edge cases, and corner cases
- Keep the exercise focused and achievable in 5-15 minutes
- Use clear, beginner-friendly language
- For JavaScript exercises, focus on pure functions when possible
- Test inputs and expected outputs should be serializable JSON values
- Make the starter code helpful but not complete`;
  }

  private buildFeedbackPrompt(
    code: string,
    prompt: string,
    testResults: TestResult[],
    allPassed: boolean
  ): string {
    const testSummary = testResults
      .map((t, i) => `Test ${i + 1}: ${t.passed ? '✓' : '✗'} - ${t.description || 'No description'}`)
      .join('\n');

    return `Provide feedback on this coding solution.

Exercise: ${prompt}

Student's Code:
\`\`\`javascript
${code}
\`\`\`

Test Results (${testResults.filter(t => t.passed).length}/${testResults.length} passed):
${testSummary}

Return a JSON object with this structure:
{
  "overall": "Brief overall assessment (1-2 sentences)",
  "suggestions": ["Specific suggestion 1", "Specific suggestion 2", ...],
  "encouragement": "Positive, motivating message",
  "hint": "Optional hint if tests are failing (only if needed)"
}

Guidelines:
- Be supportive and encouraging
- If all tests pass, praise the solution and suggest optimizations or best practices
- If tests fail, give hints without revealing the complete solution
- Focus on learning, not just correctness
- Keep suggestions actionable and specific
- Limit to 2-4 suggestions`;
  }
}
