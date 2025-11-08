import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProgressStore } from '../store/progress.store';
import { COMPLETION_THRESHOLD } from '@ai-code-tutor/shared';

export default function DashboardPage() {
  const { progress, streak, categories, fetchProgress, fetchStreak, fetchCategories } = useProgressStore();

  useEffect(() => {
    fetchProgress();
    fetchStreak();
    fetchCategories();
  }, [fetchProgress, fetchStreak, fetchCategories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="text-sm font-medium text-gray-600 mb-1">Current Streak</div>
          <div className="text-3xl font-bold text-orange-600 flex items-center">
            🔥 {streak?.currentStreak || 0} days
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Longest: {streak?.longestStreak || 0} days
          </div>
        </div>

        <div className="card">
          <div className="text-sm font-medium text-gray-600 mb-1">Exercises Solved</div>
          <div className="text-3xl font-bold text-primary-600">
            {progress?.totalExercisesSolved || 0}
          </div>
        </div>

        <div className="card">
          <div className="text-sm font-medium text-gray-600 mb-1">Total XP</div>
          <div className="text-3xl font-bold text-green-600">
            {progress?.totalXP || 0}
          </div>
        </div>
      </div>

      {/* Topics Progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>

        {categories.map((category) => {
          const categoryProgress = progress?.topicProgress.filter((tp) =>
            category.topics.some((t) => t.id === tp.topicId)
          ) || [];

          return (
            <div key={category.id} className="card mb-6">
              <h3 className="text-xl font-semibold mb-4">{category.name}</h3>

              <div className="space-y-3">
                {category.topics.map((topic) => {
                  const topicProgress = categoryProgress.find((tp) => tp.topicId === topic.id);
                  const solvedCount = topicProgress?.solvedCount || 0;
                  const isCompleted = topicProgress?.completedAt != null;
                  const percentage = Math.min((solvedCount / COMPLETION_THRESHOLD) * 100, 100);

                  return (
                    <div key={topic.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="font-medium">{topic.name}</div>
                          {isCompleted && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                              Completed
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {solvedCount} / {COMPLETION_THRESHOLD}
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="card bg-primary-50 border-2 border-primary-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to practice?</h3>
          <p className="text-gray-700 mb-4">
            Choose a topic and start solving exercises to improve your skills
          </p>
          <Link to="/editor" className="btn btn-primary">
            Start Practicing
          </Link>
        </div>
      </div>
    </div>
  );
}
