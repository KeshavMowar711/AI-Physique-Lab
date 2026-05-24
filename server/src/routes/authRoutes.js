import { Router } from "express";
import { getCurrentUser, googleAuth } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/google", googleAuth);
router.get("/me", requireAuth, getCurrentUser);

export default router;