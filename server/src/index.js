import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we are running live in the cloud environment partition matrix
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

if (!isProduction) {
  // Local environment file-discovery fallback loop
  const possiblePaths = [
    path.resolve(__dirname, '../.env'),       // inside server/
    path.resolve(__dirname, '../../.env'),    // inside AI Progress Tracker/
    path.resolve(__dirname, '.env'),          // inside server/src/
  ];

  let envLoaded = false;

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
      console.log(`\n✅ FOUND AND LOADED LOCAL .ENV AT: ${p}\n`);
      envLoaded = true;
      break;
    } else {
      console.log(`❌ Checked local path (not found): ${p}`);
    }
  }

  if (!envLoaded) {
    console.log("\n🚨 CRITICAL WARNING: Could not find a physical .env configuration file.");
  }
} else {
  console.log("\n🚀 PRODUCTION ENGINE ACTIVATED: Utilizing environment variables straight from Render shell matrix.\n");
}

// Global Diagnostics Logging Array Block
console.log("--- ENGINE ENVIRONMENT VERIFICATION ---");
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ CONFIGURED" : "❌ MISSING");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ CONFIGURED" : "❌ MISSING");
console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? "✅ CONFIGURED" : "❌ MISSING");
console.log("---------------------------------------\n");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB Atlas cluster node partition
  await connectDatabase();
  
  // Initialize the complete router express configuration context
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`🚀 Neural Vector Core API Node running live on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("💥 SYSTEM CRASH: Failed to launch application gateway container:", error);
  process.exit(1);
});