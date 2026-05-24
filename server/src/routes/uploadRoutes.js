import express from 'express';
import { requireAuth, strictAuth } from '../middleware/authMiddleware.js';
import { getSignatureHandler } from '../controllers/uploadController.js';

const router = express.Router();

// requireAuth populates req.auth -> strictAuth validates it
router.get('/signature', requireAuth, strictAuth, getSignatureHandler);

export default router;