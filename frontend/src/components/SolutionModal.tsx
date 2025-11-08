import Editor from '@monaco-editor/react';

interface SolutionModalProps {
  solution: string;
  explanation: string;
  onClose: () => void;
}

export default function SolutionModal({ solution, explanation, onClose }: SolutionModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Reference Solution</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Explanation */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Explanation</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{explanation}</p>
          </div>

          {/* Solution Code */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Solution Code</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={solution}
                theme="vs-light"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
