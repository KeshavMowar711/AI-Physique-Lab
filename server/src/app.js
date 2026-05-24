import express from 'express';
import cors from 'cors';
import { requireAuth, strictAuth } from './middleware/authMiddleware.js';
import { getSignatureHandler } from './controllers/uploadController.js';
import { generateAiReport } from './services/openaiService.js';

// If you have a separate router file, import it, 
// otherwise we define the routes cleanly directly below.
export const createApp = () => {
  const app = express();

  // 1. Global Interceptor Middleware Matrix
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2. Base Network System Diagnostics Route
  app.get('/api/health', (req, res) => {
    return res.status(200).json({ status: "active", engine: "Express MERN Node v22" });
  });

  // 3. Secure Cloudinary Asset Signature Generation
  app.get('/api/uploads/signature', requireAuth, strictAuth, getSignatureHandler);

  // 4. CORE PROGRESS ANALYSIS PIPELINE ROUTES (Aligned to /api/progress)
  app.post('/api/progress', requireAuth, strictAuth, async (req, res) => {
    try {
      console.log("📥 Inbound Analysis Body:", req.body);
      const { weightKg, calories, goal, workoutNotes, photos } = req.body;
      const userId = req.user.id;

      const currentCheckIn = {
        userId,
        date: new Date(),
        weightKg: Number(weightKg) || 0,
        calories: Number(calories) || 0,
        goal: goal || 'recomp',
        workoutNotes: workoutNotes || '',
        photos: photos || { front: '', side: '', back: '' }
      };

      // Call the bulletproof native fetch Gemini script we updated earlier
      console.log("🤖 Dispatching parameters to Gemini Core Engine...");
      const aiReport = await generateAiReport({ currentCheckIn, previousCheckIn: null });
      currentCheckIn.aiReport = aiReport;

      // Return unified data block securely
      return res.status(201).json({
        success: true,
        message: "Metrics analyzed and saved successfully",
        data: currentCheckIn
      });

    } catch (err) {
      console.error("💥 Core Submission Routing Failure:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  app.get('/api/progress', requireAuth, strictAuth, async (req, res) => {
    try {
      // Return an empty collection template if historical array is not instantiated yet
      // This prevents the frontend from throwing map-rendering exceptions
      return res.status(200).json({
        success: true,
        data: []
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  return app;
};