import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Define potential locations where your .env file might be hiding
const possiblePaths = [
  path.resolve(__dirname, '../.env'),       // inside server/
  path.resolve(__dirname, '../../.env'),    // inside AI Progress Tracker/
  path.resolve(__dirname, '.env'),          // inside server/src/
];

let envLoaded = false;

for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    console.log(`\n✅ FOUND AND LOADED .ENV AT: ${p}\n`);
    envLoaded = true;
    break;
  } else {
    console.log(`❌ Checked path (not found): ${p}`);
  }
}

if (!envLoaded) {
  console.log("\n🚨 CRITICAL: Could not find your .env file anywhere!");
  console.log("Please create a file named exactly '.env' inside your 'server' folder.\n");
}

// 2. Diagnostics
console.log("--- ENVIRONMENT VERIFICATION ---");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ CONFIGURED" : "❌ MISSING");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "❌ MISSING");
console.log("---------------------------------\n");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});