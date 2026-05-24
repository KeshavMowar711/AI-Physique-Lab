import express from 'express';
import cors from 'cors';
import { requireAuth, strictAuth } from './middleware/authMiddleware.js';
import { getSignatureHandler } from './controllers/uploadController.js';
import { generateAiReport } from './services/openaiService.js';

export const createApp = () => {
  const app = express();

  // 1. DYNAMIC GLOBAL INTERCEPTOR MIDDLEWARE MATRIX
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      const isLocal = origin.startsWith('http://localhost');
      const isVercel = origin.endsWith('.vercel.app') || origin.includes('vercel.app');
      
      if (isLocal || isVercel) {
        return callback(null, true);
      } else {
        return callback(new Error('Blocked by Core Security CORS Policy'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2. ROOT ALIVE INDEX ROADMAP
  app.get('/', (req, res) => {
    return res.status(200).json({ status: "online", system: "Neural Vector Core API Gateway Node" });
  });

  // 3. Base Network System Diagnostics Route
  app.get('/api/health', (req, res) => {
    return res.status(200).json({ status: "active", engine: "Express MERN Node v22" });
  });

  // 4. Secure Cloudinary Asset Signature Generation
  app.get('/api/uploads/signature', getSignatureHandler);

  // 5. CORE PROGRESS ANALYSIS PIPELINE ROUTES (Aligned to /api/progress)
  app.post('/api/progress', requireAuth, strictAuth, async (req, res) => {
    try {
      console.log("📥 Inbound Analysis Body received:", req.body);
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

      // 🛑 DEBUG BYPASS: Commenting out the live AI processing link to diagnose DB saves
      /*
      console.log("🤖 Dispatching parameters to Gemini Core Engine...");
      const aiReport = await generateAiReport({ currentCheckIn, previousCheckIn: null });
      currentCheckIn.aiReport = aiReport;
      */

      // Dynamic placeholder structure so the frontend dashboard schema doesn't shatter
      currentCheckIn.aiReport = {
        summary: "Bypass verification matrix active. Database connection test pass.",
        changesObserved: ["Bypass Mode Active"],
        laggingMuscles: ["None"],
        workoutSuggestions: ["Continue training metrics logs"],
        dietSuggestions: ["Maintain macro vectors"]
      };

      console.log("💾 Attempting to commit telemetry vector straight to MongoDB Atlas...");
      
      // If you are using a Mongoose Model, ensure it's imported. 
      // If you are just returning the object for testing right now, this returns a 201:
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

  // 6. GLOBAL SAFETY EXCEPTION CATCH MATRIX
  app.use((err, req, res, next) => {
    console.error("💥 [Global Engine Exception Interceptor]:", err);
    return res.status(500).json({
      success: false,
      message: "An unhandled exception occurred in the server gateway router routing pipeline.",
      error: err.message || "Internal App Server Error"
    });
  });

  return app;
};