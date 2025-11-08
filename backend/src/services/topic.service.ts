import { query } from '../db';
import type { CategoryData, Topic } from '@ai-code-tutor/shared';

export class TopicService {
  async getAllCategories(): Promise<CategoryData[]> {
    const categoriesResult = await query(
      'SELECT * FROM categories ORDER BY name'
    );

    const categories: CategoryData[] = [];

    for (const categoryRow of categoriesResult.rows) {
      const topicsResult = await query(
        'SELECT * FROM topics WHERE category_id = $1 ORDER BY name',
        [categoryRow.id]
      );

      const topics: Topic[] = topicsResult.rows.map(row => ({
        id: row.id,
        categoryId: row.category_id,
        name: row.name,
        slug: row.slug,
        description: row.description,
      }));

      categories.push({
        id: categoryRow.id,
        name: categoryRow.name,
        slug: categoryRow.slug,
        topics,
      });
    }

    return categories;
  }

  async getTopicById(topicId: string): Promise<Topic | null> {
    const result = await query(
      'SELECT * FROM topics WHERE id = $1',
      [topicId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      categoryId: row.category_id,
      name: row.name,
      slug: row.slug,
      description: row.description,
    };
  }
}
