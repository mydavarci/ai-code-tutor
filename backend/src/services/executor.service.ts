import type { TestCase, TestResult, SubmissionResult } from '@ai-code-tutor/shared';

export class ExecutorService {
  async executeCode(code: string, tests: TestCase[]): Promise<SubmissionResult> {
    const results: TestResult[] = [];

    for (const test of tests) {
      try {
        const result = await this.runSingleTest(code, test);
        results.push(result);
      } catch (error) {
        results.push({
          passed: false,
          input: test.input,
          expected: test.expected,
          actual: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          description: test.description,
        });
      }
    }

    const passedCount = results.filter(r => r.passed).length;
    const allPassed = passedCount === results.length;

    return {
      allPassed,
      passedCount,
      totalCount: results.length,
      results,
    };
  }

  private async runSingleTest(code: string, test: TestCase): Promise<TestResult> {
    try {
      // Create a safe execution context
      // In production, this should be server-side with proper sandboxing
      const wrappedCode = this.wrapCodeForExecution(code);

      // Execute the code
      const func = new Function('input', `
        ${wrappedCode}

        // Call the main function
        if (typeof solution === 'function') {
          return solution(input);
        } else {
          throw new Error('No solution function found');
        }
      `);

      const actual = func(test.input);

      // Deep equality check
      const passed = this.deepEqual(actual, test.expected);

      return {
        passed,
        input: test.input,
        expected: test.expected,
        actual,
        description: test.description,
      };
    } catch (error) {
      return {
        passed: false,
        input: test.input,
        expected: test.expected,
        actual: null,
        error: error instanceof Error ? error.message : 'Execution error',
        description: test.description,
      };
    }
  }

  private wrapCodeForExecution(code: string): string {
    // Wrap user code to prevent access to dangerous APIs
    // In production, use a proper sandbox like vm2 or isolated-vm
    return `
      'use strict';
      ${code}
    `;
  }

  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true;

    if (a === null || b === null) return a === b;
    if (a === undefined || b === undefined) return a === b;

    if (typeof a !== typeof b) return false;

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((val, idx) => this.deepEqual(val, b[idx]));
    }

    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);

      if (keysA.length !== keysB.length) return false;

      return keysA.every(key => this.deepEqual(a[key], b[key]));
    }

    return false;
  }
}
