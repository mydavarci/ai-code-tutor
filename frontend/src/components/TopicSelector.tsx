import type { Category, Difficulty, CategoryData } from '@ai-code-tutor/shared';

interface TopicSelectorProps {
  categories: CategoryData[];
  selectedCategory: Category | null;
  selectedTopicId: string | null;
  selectedDifficulty: Difficulty | null;
  onCategoryChange: (category: Category | null) => void;
  onTopicChange: (topicId: string | null) => void;
  onDifficultyChange: (difficulty: Difficulty | null) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

export default function TopicSelector({
  categories,
  selectedCategory,
  selectedTopicId,
  selectedDifficulty,
  onCategoryChange,
  onTopicChange,
  onDifficultyChange,
  onGenerate,
  isLoading,
}: TopicSelectorProps) {
  const currentCategory = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="card">
      <h3 className="font-semibold text-lg mb-4">Select Topic</h3>

      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            className="input"
            value={selectedCategory || ''}
            onChange={(e) => {
              onCategoryChange(e.target.value as Category);
              onTopicChange(null);
            }}
          >
            <option value="">Select category...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Topic */}
        {currentCategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <select
              className="input"
              value={selectedTopicId || ''}
              onChange={(e) => onTopicChange(e.target.value)}
            >
              <option value="">Select topic...</option>
              {currentCategory.topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <div className="grid grid-cols-2 gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => onDifficultyChange(difficulty)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === difficulty
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={!selectedCategory || !selectedTopicId || !selectedDifficulty || isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? 'Generating...' : 'Generate Exercise'}
        </button>
      </div>
    </div>
  );
}
