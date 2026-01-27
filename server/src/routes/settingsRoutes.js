import express from 'express';
import { saveSettings, getSettings } from '../controllers/settingsController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, saveSettings);
router.get('/', authenticateUser, getSettings);

export default router;
