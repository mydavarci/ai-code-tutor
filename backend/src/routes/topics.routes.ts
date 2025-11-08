import { Router } from 'express';
import { TopicService } from '../services/topic.service';

const router = Router();
const topicService = new TopicService();

// Get all categories and topics
router.get('/', async (req, res, next) => {
  try {
    const categories = await topicService.getAllCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

// Get single topic
router.get('/:topicId', async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const topic = await topicService.getTopicById(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Topic not found',
        },
      });
    }

    res.json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
