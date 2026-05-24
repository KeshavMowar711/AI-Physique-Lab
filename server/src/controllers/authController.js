import { User } from "../models/User.js";
import { signAuthToken, verifyGoogleToken } from "../services/authService.js";

export const googleAuth = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "Google credential is required" });
  }

  const googleProfile = await verifyGoogleToken(credential);

  const user = await User.findOneAndUpdate(
    { googleId: googleProfile.googleId },
    {
      $set: {
        email: googleProfile.email,
        name: googleProfile.name,
        avatarUrl: googleProfile.avatarUrl
      }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  const token = signAuthToken(user);

  res.json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl
    }
  });
};

export const getCurrentUser = async (req, res) => {
  res.json({
    user: req.user
  });
};