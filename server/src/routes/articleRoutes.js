import express from 'express';
import { generateArticle } from '../controllers/articleController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', authenticateUser, generateArticle);

export default router;
