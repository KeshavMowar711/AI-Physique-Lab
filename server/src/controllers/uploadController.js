import crypto from 'crypto';

export const getSignatureHandler = (req, res) => {
  try {
    console.log("📥 [Signature System] Executing secure cryptographic signature token allocation loop...");
    
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Direct fallback verification
    if (!cloudName || !apiKey || !apiSecret) {
      console.error("❌ [Signature System] Critical environment error: Missing Cloudinary environmental variables.");
      return res.status(500).json({
        success: false,
        message: "Environmental variables missing on production host cluster partition."
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'gym_progress_photos';
    
    // Cloudinary standard alphabetized serialization parameter string signature
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    // Cryptographic SHA-1 digest allocation using native runtime crypto module
    const signature = crypto
      .createHash('sha1')
      .update(signatureString)
      .digest('hex');

    console.log("✅ [Signature System] Cryptographic validation string built successfully.");

    return res.status(200).json({
      success: true,
      signature,
      timestamp,
      folder,
      apiKey,
      cloudName
    });

  } catch (error) {
    console.error("💥 [Signature System] Structural runtime crash detected:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server allocation fault."
    });
  }
};