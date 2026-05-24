import { v2 as cloudinary } from 'cloudinary';

export const getSignatureHandler = async (req, res) => {
  // 👇 ADD THESE DUMP DIAGNOSTICS LINES HERE
  console.log("=== RUNTIME CONFIGURATION INSPECTION ===");
  console.log("Cloud Name Exists?:", !!process.env.CLOUDINARY_CLOUD_NAME);
  console.log("API Key Exists?:", !!process.env.CLOUDINARY_API_KEY);
  console.log("API Secret Exists?:", !!process.env.CLOUDINARY_API_SECRET);
  console.log("========================================");

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("❌ CLOUDINARY CONFIG ERROR: Keys are missing from process.env inside signature block.");
      return res.status(500).json({
        success: false,
        message: "Server environmental configuration mismatch: Cloudinary credentials missing."
      });
    }

    // Initialize config dynamically right inside execution scope
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'gym_progress_photos';

    // Safe path execution using the direct utility method
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      apiSecret
    );

    console.log("✅ Secure upload signature token successfully generated.");

    return res.status(200).json({
      signature,
      timestamp,
      folder,
      apiKey,
      cloudName
    });

  } catch (error) {
    console.error("💥 Signature Generation Core Error Log:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to generate upload signature: ${error.message}` 
    });
  }
};