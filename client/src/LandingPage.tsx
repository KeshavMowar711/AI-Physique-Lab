import { SignInButton } from "@clerk/clerk-react";

export const LandingPage = () => {
  return (
    <div className="landing-screen">
      <div className="hero">
        <h1>AI Physique Tracker</h1>
        <p>Analyze muscle growth, tracking points, and weak areas with Gemini AI.</p>
        <SignInButton mode="modal">
          <button className="primary-button">Sign In to Start Tracking</button>
        </SignInButton>
      </div>
    </div>
  );
};