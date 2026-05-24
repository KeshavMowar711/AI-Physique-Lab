import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

// 1. Core verification middleware. 
// This reads the Authorization header automatically.
export const requireAuth = ClerkExpressWithAuth({
  // Optional config parameters can go here if needed
});

// 2. Strict guard middleware.
// ClerkExpressWithAuth does NOT block requests by default—it just populates req.auth.
// This function strictly drops the connection with a clear message if no session exists.
export const strictAuth = (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    console.error("❌ Auth Failed: No valid Clerk session found in req.auth");
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized: Invalid or missing Clerk Session Token." 
    });
  }
  
  // Map the Clerk user ID to req.user for consistency across controllers
  req.user = { id: req.auth.userId };
  next();
};