import crypto from 'crypto';

export const getSignatureHandler = async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // 1. Environmental Variable Shield
    if (!cloudName || !apiKey || !apiSecret) {
      console.error("❌ CLOUDINARY CONFIG ERROR: Keys are missing from process.env inside the signature controller.");
      return res.status(500).json({
        success: false,
        message: "Server environmental configuration mismatch: Cloudinary credentials missing."
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'gym_progress_photos';

    // 2. Structural Sign Parameters Generation Matrix
    // Cloudinary requires parameters to be ordered alphabetically for signature hashes
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    // 3. Generate SHA-1 Hex Signature using Native Node Crypto
    const signature = crypto
      .createHash('sha1')
      .update(signatureString)
      .digest('hex');

    console.log("✅ Native cryptographic upload signature successfully generated.");

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