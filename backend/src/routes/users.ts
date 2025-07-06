import express from 'express';
import UserController from '../controllers/UserController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/me', authenticateToken, UserController.getCurrentUser);
router.put('/profile', authenticateToken, UserController.updateProfile);

export default router;