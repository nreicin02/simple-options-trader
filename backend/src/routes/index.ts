import { Router } from 'express';
import userRoutes from './users';
import marketRoutes from './market';
import tradingRoutes from './trading';
// import authRoutes from './authRoutes';
// import other domain routes as needed
import { getOpenAIChatCompletion } from '../services/OpenAIService';

const router = Router();

router.use('/users', userRoutes);
router.use('/market', marketRoutes);
router.use('/trading', tradingRoutes);
// router.use('/auth', authRoutes);
// Add other domain routers here

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages must be an array' });
    }
    const aiResponse = await getOpenAIChatCompletion(messages);
    return res.json({ response: aiResponse });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'OpenAI error' });
  }
});

export default router; 