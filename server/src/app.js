import express from 'express';
import cors from 'cors';
import { requireAuth, strictAuth } from './middleware/authMiddleware.js';
import { getSignatureHandler } from './controllers/uploadController.js';
import { generateAiReport } from './services/openaiService.js';

export const createApp = () => {
  const app = express();

  // 1. DYNAMIC GLOBAL INTERCEPTOR MIDDLEWARE MATRIX
  // FIXED: Allows BOTH your local dev tool and your live production Vercel frontend to bypass security filters cleanly
  const allowedOrigins = [
    'http://localhost:5173',
    'https://ai-physique-lab-client-gduu5asue-keshavmowar711s-projects.vercel.app', // <-- CHANGE THIS to your exact live Vercel frontend domain string!
  ];

  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2. ROOT ALIVE INDEX ROADMAP
  // FIXED: Bypasses native browser 404 rendering when visiting your Render backend URL directly
  app.get('/', (req, res) => {
    return res.status(200).json({ status: "online", system: "Neural Vector Core API Gateway Node" });
  });

  // 3. Base Network System Diagnostics Route
  app.get('/api/health', (req, res) => {
    return res.status(200).json({ status: "active", engine: "Express MERN Node v22" });
  });

  // 4. Secure Cloudinary Asset Signature Generation
  app.get('/api/uploads/signature', requireAuth, strictAuth, getSignatureHandler);

  // 5. CORE PROGRESS ANALYSIS PIPELINE ROUTES (Aligned to /api/progress)
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

      console.log("🤖 Dispatching parameters to Gemini Core Engine...");
      const aiReport = await generateAiReport({ currentCheckIn, previousCheckIn: null });
      currentCheckIn.aiReport = aiReport;

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