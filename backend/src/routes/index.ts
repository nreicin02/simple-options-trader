import { Router } from 'express';
import userRoutes from './users';
import marketRoutes from './market';
import tradingRoutes from './trading';
// import authRoutes from './authRoutes';
// import other domain routes as needed

const router = Router();

router.use('/users', userRoutes);
router.use('/market', marketRoutes);
router.use('/trading', tradingRoutes);
// router.use('/auth', authRoutes);
// Add other domain routers here

export default router; 