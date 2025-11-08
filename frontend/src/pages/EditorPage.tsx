import { useState, useEffect } from 'react';
import { useExerciseStore } from '../store/exercise.store';
import { useProgressStore } from '../store/progress.store';
import TopicSelector from '../components/TopicSelector';
import CodeEditor from '../components/CodeEditor';
import TestResults from '../components/TestResults';
import FeedbackPanel from '../components/FeedbackPanel';
import SolutionModal from '../components/SolutionModal';
import type { Category, Difficulty } from '@ai-code-tutor/shared';

export default function EditorPage() {
  const {
    currentExercise,
    lastSubmission,
    isLoading,
    generateExercise,
    submitCode,
    getSolution,
    clearExercise,
  } = useExerciseStore();

  const { fetchCategories, categories } = useProgressStore();

  const [code, setCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (currentExercise) {
      setCode(currentExercise.starterCode);
    }
  }, [currentExercise]);

  const handleGenerateExercise = async () => {
    if (!selectedCategory || !selectedTopicId || !selectedDifficulty) {
      alert('Please select category, topic, and difficulty');
      return;
    }

    clearExercise();
    await generateExercise(selectedCategory, selectedTopicId, selectedDifficulty);
  };

  const handleRunCode = async () => {
    if (!currentExercise) return;

    setIsSubmitting(true);
    try {
      await submitCode(currentExercise.id, code);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowSolution = async () => {
    if (!currentExercise) return;

    if (!currentExercise.solution) {
      await getSolution(currentExercise.id);
    }

    setShowSolution(true);
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="h-full grid grid-cols-12 gap-4 p-4">
        {/* Left Sidebar - Topic Selection */}
        <div className="col-span-3 flex flex-col space-y-4 overflow-y-auto">
          <TopicSelector
            categories={categories}
            selectedCategory={selectedCategory}
            selectedTopicId={selectedTopicId}
            selectedDifficulty={selectedDifficulty}
            onCategoryChange={setSelectedCategory}
            onTopicChange={setSelectedTopicId}
            onDifficultyChange={setSelectedDifficulty}
            onGenerate={handleGenerateExercise}
            isLoading={isLoading}
          />

          {/* Exercise Prompt */}
          {currentExercise && (
            <div className="card">
              <h3 className="font-semibold text-lg mb-2">Exercise</h3>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{currentExercise.prompt}</p>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span className="capitalize">{currentExercise.difficulty}</span>
                <span>{currentExercise.tests.length} test cases</span>
              </div>
            </div>
          )}
        </div>

        {/* Middle - Code Editor */}
        <div className="col-span-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Code Editor</h2>

            <div className="flex space-x-2">
              <button
                onClick={handleRunCode}
                disabled={!currentExercise || isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Submitting...' : 'Run & Submit'}
              </button>

              {currentExercise && (
                <button
                  onClick={handleShowSolution}
                  className="btn btn-outline"
                >
                  View Solution
                </button>
              )}
            </div>
          </div>

          <div className="flex-1">
            <CodeEditor
              value={code}
              onChange={setCode}
              disabled={!currentExercise}
            />
          </div>
        </div>

        {/* Right Sidebar - Results & Feedback */}
        <div className="col-span-3 flex flex-col space-y-4 overflow-y-auto">
          {lastSubmission && (
            <>
              <TestResults submission={lastSubmission.submission} />
              {lastSubmission.submission.feedback && (
                <FeedbackPanel feedback={lastSubmission.submission.feedback} />
              )}

              {lastSubmission.xpEarned && (
                <div className="card bg-green-50 border-2 border-green-200">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎉</div>
                    <div className="font-semibold text-green-700">
                      +{lastSubmission.xpEarned} XP
                    </div>
                    {lastSubmission.streakUpdated && (
                      <div className="text-sm text-green-600 mt-1">
                        Streak updated! 🔥
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {!currentExercise && (
            <div className="card text-center text-gray-500">
              <p>Select a topic and difficulty to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Solution Modal */}
      {showSolution && currentExercise && (
        <SolutionModal
          solution={currentExercise.solution || ''}
          explanation={currentExercise.solutionExplanation || ''}
          onClose={() => setShowSolution(false)}
        />
      )}
    </div>
  );
}
