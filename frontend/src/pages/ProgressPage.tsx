import { useEffect } from 'react';
import { useProgressStore } from '../store/progress.store';
import { format } from 'date-fns';

export default function ProgressPage() {
  const { progress, streak, categories, fetchProgress, fetchStreak, fetchCategories } = useProgressStore();

  useEffect(() => {
    fetchProgress();
    fetchStreak();
    fetchCategories();
  }, [fetchProgress, fetchStreak, fetchCategories]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

      {/* Streak Stats */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Streak</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Current Streak</div>
            <div className="text-4xl font-bold text-orange-600 flex items-center">
              🔥 {streak?.currentStreak || 0}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Longest Streak</div>
            <div className="text-4xl font-bold text-gray-900">
              {streak?.longestStreak || 0}
            </div>
          </div>
        </div>
        {streak && (
          <div className="mt-4 text-sm text-gray-600">
            Last activity: {format(new Date(streak.lastActivityDate), 'PPP')}
          </div>
        )}
      </div>

      {/* Overall Stats */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Overall Statistics</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total XP</div>
            <div className="text-3xl font-bold text-green-600">
              {progress?.totalXP || 0}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Exercises Solved</div>
            <div className="text-3xl font-bold text-primary-600">
              {progress?.totalExercisesSolved || 0}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Topics Completed</div>
            <div className="text-3xl font-bold text-purple-600">
              {progress?.completedTopics.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Topic Details */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Topic Breakdown</h2>

        <div className="space-y-4">
          {progress?.topicProgress.map((tp) => {
            const category = categories.find((c) =>
              c.topics.some((t) => t.id === tp.topicId)
            );
            const topic = category?.topics.find((t) => t.id === tp.topicId);

            if (!topic) return null;

            return (
              <div key={tp.topicId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{topic.name}</div>
                    <div className="text-sm text-gray-500">{category?.name}</div>
                  </div>
                  {tp.completedAt && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full text-sm">
                      ✓ Completed
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Solved: </span>
                    <span className="font-semibold">{tp.solvedCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Attempts: </span>
                    <span className="font-semibold">{tp.totalAttempts}</span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Last activity: {format(new Date(tp.lastActivityAt), 'PPP')}
                </div>
              </div>
            );
          })}

          {(!progress?.topicProgress || progress.topicProgress.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No progress yet. Start solving exercises to track your progress!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
