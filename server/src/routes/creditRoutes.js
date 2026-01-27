import express from 'express';
import { getCredits, deductCredits } from '../controllers/creditController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/balance', authenticateUser, getCredits); // Changed from /:userId to /balance using auth token
router.post('/deduct', authenticateUser, deductCredits);

export default router;
