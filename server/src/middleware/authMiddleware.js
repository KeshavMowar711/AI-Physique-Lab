import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// 1. Standard Soft Auth Interceptor
export const requireAuth = ClerkExpressRequireAuth({
  // This ensures that even behind cloud proxies (like Render/Cloudflare), 
  // Clerk reads the incoming Bearer JWT token seamlessly.
  authorizedParties: [
    'https://ai-physique-lab-client.vercel.app',
    'http://localhost:5173'
  ]
});

// 2. Strict User Validation Gate
export const strictAuth = (req, res, next) => {
  // If Clerk's middleware validated the token, it populates req.auth
  // Let's make this check highly flexible for both development and production formats
  const authContext = req.auth || req.session?.auth;

  if (!authContext || !authContext.userId) {
    console.error("❌ [Auth Shield] Inbound request dropped: Missing or unverified Clerk Session Token Token.");
    return res.status(401).json({
      success: false,
      message: "Access Denied: Session signature validation failed."
    });
  }

  // Bind the validated user context to the request body container
  req.user = { id: authContext.userId };
  next();
};