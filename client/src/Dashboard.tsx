import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
// FIXED: Path updated from '../components/CheckInForm' to match root src/ location
import { CheckInForm } from "./components/CheckInForm";

// FIXED: Defined explicit prop interface to satisfy the App.tsx contract
interface DashboardProps {
  user?: any;
  getAuthToken?: () => Promise<string | null>;
}

export const Dashboard = ({ user, getAuthToken }: DashboardProps) => {
  const { getToken } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // DYNAMIC BACKEND TARGET ROUTING MATRIX
  const API_BASE_URL = window.location.hostname.includes("vercel.app")
    ? "https://ai-physique-lab.onrender.com"
    : (import.meta.env.VITE_API_URL || "http://localhost:5000");

  const fetchTelemetryHistory = async () => {
    try {
      console.log("[Dashboard] Initializing authorization token handshake...");
      // FIXED: Fall back to provided prop method if local hook is out of bounds
      const token = getAuthToken ? await getAuthToken() : await getToken();
      if (!token) throw new Error("Authentication token signature missing");
      console.log("[Dashboard] Token acquired successfully.");

      const response = await fetch(`${API_BASE_URL}/api/progress`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Database pipeline network rejection");
      const resData = await response.json();
      
      if (resData.success) {
        setHistory(resData.data);
      }
    } catch (err) {
      console.error("[Dashboard] Failed to connect to telemetry data pipeline:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInSubmit = async (formData: any) => {
    try {
      const token = getAuthToken ? await getAuthToken() : await getToken();
      const response = await fetch(`${API_BASE_URL}/api/progress`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();
      if (resData.success) {
        alert("Check-in metric package committed cleanly to Atlas!");
        fetchTelemetryHistory(); 
      } else {
        alert(`Core Engine Rejection: ${resData.message}`);
      }
    } catch (err) {
      console.error("💥 Critical Submission Rupture:", err);
    }
  };

  useEffect(() => {
    fetchTelemetryHistory();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "var(--bg-pure-black)", color: "var(--accent-gymshark)" }}>
        INITIALIZING SYSTEM CORE...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-pure-black)", color: "#fff", padding: "40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        
        {/* LEFT COLUMN: LOGGER FORM */}
        <div>
          <CheckInForm 
            authToken="" 
            onSubmit={handleCheckInSubmit}
            // FIXED: Explicitly typed parameters to satisfy type contract checks
            onPhotoStaged={(position: "front" | "side" | "back", url: string) => console.log(`Staged ${position}: ${url}`)}
          />
        </div>

        {/* RIGHT COLUMN: ANALYTICS FEED */}
        <div style={{ background: "var(--bg-deep-charcoal)", border: "1px solid var(--border-subtle)", padding: "32px", borderRadius: "6px" }}>
          <h3 style={{ fontFamily: "var(--font-heavy-display)", fontSize: "1.6rem", textTransform: "uppercase", marginBottom: "24px", letterSpacing: "0.02em" }}>
            Telemetry Database Log Stream
          </h3>
          {history.length === 0 ? (
            <p style={{ color: "var(--text-gray-muted)", fontSize: "0.9rem" }}>No historical telemetry entries detected in active partition vector.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {history.map((entry: any, index: number) => (
                <div key={index} style={{ padding: "16px", background: "var(--bg-pure-black)", border: "1px solid var(--border-subtle)", borderRadius: "4px" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--accent-gymshark)", fontWeight: "bold" }}>VECTOR #{index + 1}</span>
                  <p style={{ margin: "4px 0" }}>Mass: {entry.weightKg} KG | Intake: {entry.calories} KCAL</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};