import type { Submission } from '@ai-code-tutor/shared';

interface TestResultsProps {
  submission: Submission;
}

export default function TestResults({ submission }: TestResultsProps) {
  const { result } = submission;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Test Results</h3>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            result.allPassed
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {result.passedCount} / {result.totalCount} Passed
        </div>
      </div>

      <div className="space-y-2">
        {result.results.map((testResult, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              testResult.passed
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="font-medium text-sm">
                {testResult.passed ? '✓' : '✗'} Test {index + 1}
              </div>
              {testResult.description && (
                <div className="text-xs text-gray-600">{testResult.description}</div>
              )}
            </div>

            {!testResult.passed && (
              <div className="mt-2 space-y-1 text-xs">
                <div>
                  <span className="text-gray-600">Input: </span>
                  <code className="bg-white px-1 py-0.5 rounded">
                    {JSON.stringify(testResult.input)}
                  </code>
                </div>
                <div>
                  <span className="text-gray-600">Expected: </span>
                  <code className="bg-white px-1 py-0.5 rounded text-green-700">
                    {JSON.stringify(testResult.expected)}
                  </code>
                </div>
                <div>
                  <span className="text-gray-600">Got: </span>
                  <code className="bg-white px-1 py-0.5 rounded text-red-700">
                    {JSON.stringify(testResult.actual)}
                  </code>
                </div>
                {testResult.error && (
                  <div className="text-red-600 mt-1">
                    Error: {testResult.error}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
