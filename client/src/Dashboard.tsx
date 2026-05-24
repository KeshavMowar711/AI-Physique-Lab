import { CheckInForm } from "./components/CheckInForm";
import { useState, useEffect } from "react";

interface DashboardProps {
  user: { firstName?: string | null } | null;
  getAuthToken: () => Promise<string | null>;
}

export const Dashboard = ({ user, getAuthToken }: DashboardProps) => {
  const [history, setHistory] = useState<any[]>([]);
  const [clerkToken, setClerkToken] = useState<string>("");
  const [loadingToken, setLoadingToken] = useState<boolean>(true);
  
  const [livePreviews, setLivePreviews] = useState({
    front: "",
    side: "",
    back: ""
  });

  // DYNAMIC API CONFIGURATION MATRIX: 
  // Looks for Vercel's environment variables first, otherwise targets your local fallback server
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("[Dashboard] Initializing authorization token handshake...");
        const token = await getAuthToken();
        if (token) {
          console.log("[Dashboard] Token acquired successfully.");
          setClerkToken(token);
          await fetchHistory(token);
        } else {
          console.warn("[Dashboard] Handshake completed but no active token returned.");
        }
      } catch (err) {
        console.error("[Dashboard] Authentication handshake failed:", err);
      } finally {
        setLoadingToken(false);
      }
    };
    initAuth();
  }, [getAuthToken]);

  const fetchHistory = async (token: string) => {
    try {
      // FIXED: Swapped out relative paths for the absolute dynamic configuration variable
      const response = await fetch(`${API_BASE_URL}/api/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.status === 401) {
        console.error("[Dashboard] Backend returned 401 Unauthorized. Session token is invalid or expired.");
        return;
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setHistory(result.data);
      }
    } catch (err) {
      console.error("[Dashboard] Failed to connect to telemetry data pipeline:", err);
    }
  };

  const handleCheckInSubmit = async (formData: any) => {
    try {
      // FIXED: Configured absolute target pathway mapping
      const response = await fetch(`${API_BASE_URL}/api/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${clerkToken}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success && result.data) {
        setHistory((prev) => [result.data, ...prev]);
        setLivePreviews({ front: "", side: "", back: "" });
      }
    } catch (err) {
      console.error("[Dashboard] Vector submission failed:", err);
    }
  };

  const handlePhotoStaging = (key: "front" | "side" | "back", url: string) => {
    setLivePreviews(prev => ({ ...prev, [key]: url }));
  };

  if (loadingToken) {
    return (
      <div style={{ background: "var(--bg-pure-black)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-heavy-display)", fontSize: "1.5rem", color: "var(--accent-gymshark)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Synchronizing Auth Matrix...
        </span>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-pure-black)", minHeight: "100vh" }}>
      
      <div className="hero-header-section">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--accent-gymshark)", textTransform: "uppercase", letterSpacing: "0.25em", display: "block" }}>
            Operational Engine Active
          </span>
          <h1 className="heavy-display-text">
            Unleash Your Strength,<br />Redefine Your Limits.
          </h1>
          <button className="btn-stark-action">Initialize Core Diagnostics</button>
        </div>
      </div>

      <div className="industrial-card-grid">
        <div className="gymshark-card">
          <div className="image-frame">
            <img 
              src={livePreviews.front || history[0]?.photos?.front || "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop"} 
              alt="Front Profile Reference Frame" 
            />
          </div>
          <div className="card-footer-banner">Front Profile</div>
        </div>

        <div className="gymshark-card">
          <div className="image-frame">
            <img 
              src={livePreviews.side || history[0]?.photos?.side || "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=600&auto=format&fit=crop"} 
              alt="Side Profile Reference Frame" 
            />
          </div>
          <div className="card-footer-banner">Side Profile</div>
        </div>

        <div className="gymshark-card">
          <div className="image-frame">
            <img 
              src={livePreviews.back || history[0]?.photos?.back || "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop"} 
              alt="Back Profile Reference Frame" 
            />
          </div>
          <div className="card-footer-banner">Back Profile</div>
        </div>
      </div>

      <div className="dashboard-stark-divider">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="stark-display-text">
            Current Vector: {history[0]?.goal || "STANDBY PHASE"}
          </h2>
          <p style={{ fontWeight: "700", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.85rem", color: "#444446" }}>
            Mass Index: {history[0]?.weightKg ? `${history[0].weightKg} KG` : "--"} &bull; Caloric Threshold: {history[0]?.calories ? `${history[0].calories} KCAL` : "--"}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 24px 100px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "40px" }}>
          
          <div>
            <CheckInForm 
              authToken={clerkToken} 
              onSubmit={handleCheckInSubmit} 
              onPhotoStaged={handlePhotoStaging} 
            />
          </div>

          <div>
            <div style={{ background: "var(--bg-deep-charcoal)", border: "1px solid var(--border-subtle)", padding: "32px", borderRadius: "6px" }}>
              <h3 style={{ fontFamily: "var(--font-heavy-display)", fontSize: "1.6rem", textTransform: "uppercase", marginBottom: "16px", borderBottom: "2px solid var(--accent-gymshark)", paddingBottom: "8px", letterSpacing: "0.02em" }}>
                AI Coach Directives
              </h3>
              <p style={{ color: "var(--text-gray-muted)", lineHeight: "1.7", fontSize: "0.95rem" }}>
                {history[0]?.aiReport?.summary || "Awaiting structural telemetry vectors to generate tactical progress charts..."}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};