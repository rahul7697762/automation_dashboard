import express from 'express';
import { createWebCall, handleWebhook, syncCalls } from '../controllers/retellController.js';

const router = express.Router();

router.post('/create-web-call', createWebCall);
router.post('/webhook/retell', handleWebhook);
router.get('/sync-calls', syncCalls);

export default router;
