import express from 'express';
import { addToSheet } from '../controllers/googleSheetsController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authenticateUser, addToSheet);

export default router;
