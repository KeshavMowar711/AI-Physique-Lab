import crypto from 'crypto';

export const getSignatureHandler = async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // DETAILED DIAGNOSTIC GUARD CHECK Matrix
    const missingKeys = [];
    if (!cloudName) missingKeys.push("CLOUDINARY_CLOUD_NAME");
    if (!apiKey) missingKeys.push("CLOUDINARY_API_KEY");
    if (!apiSecret) missingKeys.push("CLOUDINARY_API_SECRET");

    if (missingKeys.length > 0) {
      console.error(`❌ Environment Check Failure. Missing variables: ${missingKeys.join(', ')}`);
      return res.status(500).json({
        success: false,
        message: `Environmental Configuration Broken. Missing variables from host: ${missingKeys.join(', ')}`
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'gym_progress_photos';
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    const signature = crypto
      .createHash('sha1')
      .update(signatureString)
      .digest('hex');

    return res.status(200).json({
      signature,
      timestamp,
      folder,
      apiKey,
      cloudName
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: `Failed to generate upload signature: ${error.message}` 
    });
  }
};