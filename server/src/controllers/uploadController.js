import { v2 as cloudinary } from 'cloudinary';

// Initialize configuration values dynamically
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getSignatureHandler = async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY) {
      console.error("❌ CLOUDINARY CONFIG ERROR: Keys are missing from process.env inside the signature controller.");
      return res.status(500).json({
        success: false,
        message: "Server environmental configuration mismatch: Cloudinary credentials missing."
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'gym_progress_photos';

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET
    );

    console.log("✅ Secure upload signature token successfully generated.");

    return res.status(200).json({
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });

  } catch (error) {
    console.error("💥 Signature Generation Core Error Log:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to generate upload signature: ${error.message}` 
    });
  }
};