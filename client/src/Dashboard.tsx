import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
// FIXED: Path steps directly into components folder layout without shifting hierarchies
import { CheckInForm } from "./components/CheckInForm";

interface AiReportSchema {
  summary: string;
  changesObserved: string[];
  laggingMuscles: string[];
  workoutSuggestions: string[];
  dietSuggestions: string[];
}

interface CheckInRecord {
  _id?: string;
  userId: string;
  date: string | Date;
  weightKg: number;
  calories: number;
  goal: string;
  workoutNotes: string;
  photos: {
    front: string;
    side: string;
    back: string;
  };
  aiReport?: AiReportSchema;
}

export const Dashboard = () => {
  const { getToken } = useAuth();
  const [checkInHistory, setCheckInHistory] = useState<CheckInRecord[]>([]);
  const [activeReport, setActiveReport] = useState<AiReportSchema | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = window.location.hostname.includes("vercel.app")
    ? "https://ai-physique-lab.onrender.com"
    : (import.meta.env.VITE_API_URL || "http://localhost:5000");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/api/progress`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          setCheckInHistory(resData.data);
          if (resData.data.length > 0 && resData.data[0].aiReport) {
            setActiveReport(resData.data[0].aiReport);
          }
        }
      } catch (err) {
        console.error("💥 Failed to pull historic data vectors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getToken, API_BASE_URL]);

  const handleFormSubmit = async (payload: any) => {
    try {
      console.log("[Dashboard Cluster] Dispatching telemetry package to Render...");
      const token = await getToken();
      
      const response = await fetch(`${API_BASE_URL}/api/progress`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (resData.success && resData.data) {
        console.log("💾 Global telemetry registry locked down successfully!", resData.data);
        
        const newRecord: CheckInRecord = resData.data;
        setCheckInHistory(prev => [newRecord, ...prev]);
        
        if (newRecord.aiReport) {
          setActiveReport(newRecord.aiReport);
        }
        
        alert("Check-in metric package committed cleanly to Atlas!");
      } else {
        alert(`Submission routing rejected: ${resData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("💥 Dashboard pipeline submission exception:", err);
      alert("Submission dropped due to an internal system schema error.");
    }
  };

  const handlePhotoStaged = (key: "front" | "side" | "back", url: string) => {
    console.log(`[Dashboard Master] Staged photo saved memory pointer for ${key}:`, url);
  };

  return (
    <div style={{ background: "var(--bg-pure-black)", color: "#fff", minHeight: "100vh", padding: "40px" }}>
      <header style={{ marginBottom: "40px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "20px" }}>
        <h1 style={{ fontFamily: "var(--font-heavy-display)", fontSize: "2.5rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff" }}>
          Neural Vector Labs <span style={{ color: "var(--accent-gymshark)" }}>// PHYSIQUE PORTAL</span>
        </h1>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>
        
        {/* LEFT COLUMN: INPUT */}
        <div>
          <CheckInForm authToken="" onSubmit={handleFormSubmit} onPhotoStaged={handlePhotoStaged} />
        </div>

        {/* RIGHT COLUMN: REGEN MATRIX LOG STREAM */}
        <div style={{ background: "var(--bg-deep-charcoal)", border: "1px solid var(--border-subtle)", padding: "32px", borderRadius: "6px", minHeight: "550px" }}>
          <h3 style={{ fontFamily: "var(--font-heavy-display)", fontSize: "1.6rem", textTransform: "uppercase", marginBottom: "24px", letterSpacing: "0.02em" }}>
            Database Log Stream
          </h3>

          {activeReport ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ background: "var(--bg-pure-black)", borderLeft: "4px solid var(--accent-gymshark)", padding: "20px", borderRadius: "4px" }}>
                <h4 style={{ color: "var(--accent-gymshark)", textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 900, marginBottom: "8px" }}>Coaching Summary Matrix</h4>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#e0e0e0" }}>{activeReport.summary}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ background: "var(--bg-pure-black)", padding: "16px", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
                  <h5 style={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 900, marginBottom: "12px", color: "#999" }}>Changes Observed</h5>
                  <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "0.85rem", color: "#ccc" }}>
                    {activeReport.changesObserved?.map((item, idx) => <li key={idx} style={{ marginBottom: "6px" }}>{item}</li>)}
                  </ul>
                </div>

                <div style={{ background: "var(--bg-pure-black)", padding: "16px", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
                  <h5 style={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 900, marginBottom: "12px", color: "#999" }}>Lagging Muscle Indicators</h5>
                  <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "0.85rem", color: "#ccc" }}>
                    {activeReport.laggingMuscles?.map((item, idx) => <li key={idx} style={{ marginBottom: "6px" }}>{item}</li>)}
                  </ul>
                </div>
              </div>

              <div style={{ background: "var(--bg-pure-black)", padding: "20px", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
                <h4 style={{ textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 900, marginBottom: "12px", color: "var(--accent-gymshark)" }}>Optimization Targets Directive</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "0.85rem" }}>
                  <div>
                    <h6 style={{ margin: "0 0 8px 0", color: "#fff", fontWeight: 700 }}>Training suggestions:</h6>
                    <ul style={{ paddingLeft: "16px", margin: 0, color: "#aaa" }}>
                      {activeReport.workoutSuggestions?.map((item, idx) => <li key={idx} style={{ marginBottom: "4px" }}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h6 style={{ margin: "0 0 8px 0", color: "#fff", fontWeight: 700 }}>Nutritional Suggestion Matrix:</h6>
                    <ul style={{ paddingLeft: "16px", margin: 0, color: "#aaa" }}>
                      {activeReport.dietSuggestions?.map((item, idx) => <li key={idx} style={{ marginBottom: "4px" }}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "350px", color: "var(--text-gray-muted)", border: "1px dashed var(--border-subtle)", borderRadius: "4px" }}>
              <p style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {loading ? "Decrypting local state index buffer..." : "Awaiting transmission package parameters... Stage metrics to initialize feedback."}
              </p>
            </div>
          )}

          {/* HISTORIC STREAM PREVIEW */}
          {checkInHistory.length > 1 && (
            <div style={{ marginTop: "32px", borderTop: "1px solid var(--border-subtle)", paddingTop: "24px" }}>
              <h4 style={{ fontFamily: "var(--font-heavy-display)", fontSize: "1.1rem", textTransform: "uppercase", marginBottom: "16px" }}>Historic Entry Log Streams</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {checkInHistory.slice(1).map((record, index) => (
                  <div key={record._id || index} onClick={() => record.aiReport && setActiveReport(record.aiReport)} style={{ display: "flex", justifyContent: "space-between", background: "var(--bg-pure-black)", padding: "12px 16px", borderRadius: "4px", border: "1px solid var(--border-subtle)", cursor: "pointer", fontSize: "0.85rem" }}>
                    <span>{new Date(record.date).toLocaleDateString()} - Vector Entry ({record.goal.toUpperCase()})</span>
                    <span style={{ color: "var(--accent-gymshark)", fontWeight: 700 }}>{record.weightKg} KG</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};