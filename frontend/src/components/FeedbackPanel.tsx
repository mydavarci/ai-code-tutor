import type { AIFeedback } from '@ai-code-tutor/shared';

interface FeedbackPanelProps {
  feedback: AIFeedback;
}

export default function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  return (
    <div className="card bg-blue-50 border-2 border-blue-200">
      <h3 className="font-semibold text-lg mb-3 flex items-center">
        <span className="mr-2">💡</span>
        AI Feedback
      </h3>

      <div className="space-y-3">
        {/* Overall */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Overall</div>
          <p className="text-sm text-gray-800">{feedback.overall}</p>
        </div>

        {/* Suggestions */}
        {feedback.suggestions && feedback.suggestions.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Suggestions</div>
            <ul className="space-y-1">
              {feedback.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-800 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hint */}
        {feedback.hint && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="text-sm font-medium text-yellow-800 mb-1">Hint</div>
            <p className="text-sm text-yellow-700">{feedback.hint}</p>
          </div>
        )}

        {/* Encouragement */}
        {feedback.encouragement && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">{feedback.encouragement}</p>
          </div>
        )}
      </div>
    </div>
  );
}
