import { SignedIn, SignedOut, useUser, useAuth } from "@clerk/clerk-react";
import { SignInButton } from "@clerk/clerk-react";
import { Dashboard } from "./Dashboard";
import "./styles.css"; 

function App() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const getAuthToken = async () => {
    return await getToken();
  };

  return (
    <>
      {/* -----------------------------------------------------
         STATE A: USER IS LOGGED OUT (PREMIUM ACTIVE ENTRANCE GATE)
         ----------------------------------------------------- */}
      <SignedOut>
        <div className="auth-gate-viewport">
          <div className="auth-gate-card">
            
            <span className="auth-gate-badge">Neural Vector Engine</span>
            
            <h1 className="auth-gate-title">
              AI Physique<br />Tracker
            </h1>
            
            <p className="auth-gate-subtitle">
              Analyze muscle growth vectors, establish tracking nodes, and isolate structural weak areas powered entirely by Gemini AI diagnostics.
            </p>

            {/* Clerk hooks up the action event directly to this styled button */}
            <SignInButton mode="modal">
              <button className="btn-auth-trigger">
                <span>Sign In to Start Tracking</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </SignInButton>

          </div>
        </div>
      </SignedOut>

      {/* -----------------------------------------------------
         STATE B: USER IS LOGGED IN (OPERATIONAL WORKSPACE)
         ----------------------------------------------------- */}
      <SignedIn>
        <Dashboard user={user} getAuthToken={getAuthToken} />
      </SignedIn>
    </>
  );
}

export default App;