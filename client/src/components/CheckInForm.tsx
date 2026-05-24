import React, { useState } from "react";

interface CheckInFormProps {
  authToken: string;
  onSubmit: (formData: any) => Promise<void>;
  onPhotoStaged: (key: "front" | "side" | "back", url: string) => void;
}

export const CheckInForm = ({ authToken, onSubmit, onPhotoStaged }: CheckInFormProps) => {
  // DYNAMIC BACKEND TARGET ROUTING MATRIX
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [weightKg, setWeightKg] = useState("");
  const [calories, setCalories] = useState("");
  const [goal, setGoal] = useState("recomp");
  const [workoutNotes, setWorkoutNotes] = useState("");
  
  const [photos, setPhotos] = useState({
    front: "",
    side: "",
    back: ""
  });

  const [uploading, setUploading] = useState({
    front: false,
    side: false,
    back: false
  });

  // SECURE CLOUDINARY DIRECT MEDIA UPLOAD PIPELINE
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, position: "front" | "side" | "back") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [position]: true }));

    try {
      console.log(`[Media Pipeline] Fetching secure signature token for ${position} profile...`);
      
      // FIXED: Uses absolute base path instead of standard relative path proxying
      const sigResponse = await fetch(`${API_BASE_URL}/api/uploads/signature`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });

      if (!sigResponse.ok) {
        throw new Error(`Signature generation failed with network code: ${sigResponse.status}`);
      }

      const sigData = await sigResponse.json();
      
      // Construct Cloudinary Multi-part data package payload
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("api_key", sigData.apiKey);
      cloudinaryFormData.append("timestamp", sigData.timestamp.toString());
      cloudinaryFormData.append("signature", sigData.signature);
      if (sigData.folder) {
        cloudinaryFormData.append("folder", sigData.folder);
      }

      console.log("[Media Pipeline] Dispatching binary payload straight to Cloudinary Bucket...");
      const cloudResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData
        }
      );

      const cloudData = await cloudResponse.json();
      
      if (cloudData.secure_url) {
        console.log(`[Media Pipeline] ${position} frame saved down successfully:`, cloudData.secure_url);
        setPhotos(prev => ({ ...prev, [position]: cloudData.secure_url }));
        onPhotoStaged(position, cloudData.secure_url);
      } else {
        throw new Error(cloudData.error?.message || "Unknown Cloudinary response failure");
      }

    } catch (err) {
      console.error(`💥 Cloudinary Core Asset Injection Failure (${position}):`, err);
      alert(`Photo upload failed: ${err instanceof Error ? err.message : "Network Disruption"}`);
    } finally {
      setUploading(prev => ({ ...prev, [position]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      weightKg: parseFloat(weightKg),
      calories: parseInt(calories),
      goal,
      workoutNotes,
      photos
    };

    await onSubmit(payload);
    
    // Clear localized state buffers upon successful loop commit
    setWeightKg("");
    setCalories("");
    setWorkoutNotes("");
    setPhotos({ front: "", side: "", back: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="stark-industrial-form" style={{ background: "var(--bg-deep-charcoal)", border: "1px solid var(--border-subtle)", padding: "32px", borderRadius: "6px" }}>
      <h3 style={{ fontFamily: "var(--font-heavy-display)", fontSize: "1.6rem", textTransform: "uppercase", marginBottom: "24px", letterSpacing: "0.02em" }}>
        Log Structural Telemetry
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", marginBottom: "8px", color: "var(--text-gray-muted)" }}>Mass (KG)</label>
          <input type="number" step="0.1" required value={weightKg} onChange={(e) => setWeightKg(e.target.value)} style={{ width: "100%", padding: "12px", background: "var(--bg-pure-black)", border: "1px solid var(--border-subtle)", color: "#fff", borderRadius: "4px" }} placeholder="82.5" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", marginBottom: "8px", color: "var(--text-gray-muted)" }}>Energy Intake (KCAL)</label>
          <input type="number" required value={calories} onChange={(e) => setCalories(e.target.value)} style={{ width: "100%", padding: "12px", background: "var(--bg-pure-black)", border: "1px solid var(--border-subtle)", color: "#fff", borderRadius: "4px" }} placeholder="2750" />
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", marginBottom: "8px", color: "var(--text-gray-muted)" }}>Target Matrix Vector</label>
        <select value={goal} onChange={(e) => setGoal(e.target.value)} style={{ width: "100%", padding: "12px", background: "var(--bg-pure-black)", border: "1px solid var(--border-subtle)", color: "#fff", borderRadius: "4px" }}>
          <option value="cut">Aggressive Deficit (Cut)</option>
          <option value="bulk">Surplus Hypertrophy (Bulk)</option>
          <option value="recomp">Body Recomposition (Recomp)</option>
        </select>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", marginBottom: "8px", color: "var(--text-gray-muted)" }}>Training Diagnostics & Notes</label>
        <textarea rows={3} value={workoutNotes} onChange={(e) => setWorkoutNotes(e.target.value)} style={{ width: "100%", padding: "12px", background: "var(--bg-pure-black)", border: "1px solid var(--border-subtle)", color: "#fff", borderRadius: "4px", resize: "none" }} placeholder="Push session completed. Hit 100KG on Bench for sets of 6... RPE 9."></textarea>
      </div>

      <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "20px", marginBottom: "32px" }}>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", marginBottom: "16px", color: "var(--accent-gymshark)" }}>Physique Reference Profiles</label>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* FRONT PROFILE SLIP */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "between", background: "var(--bg-pure-black)", padding: "12px", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700" }}>Front View:</span>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "front")} style={{ marginLeft: "auto", fontSize: "0.8rem" }} />
            {uploading.front && <span style={{ fontSize: "0.75rem", color: "var(--accent-gymshark)" }}>LOCKING IN...</span>}
            {photos.front && <span style={{ fontSize: "0.75rem", color: "#4CAF50" }}>✅ STAGED</span>}
          </div>

          {/* SIDE PROFILE SLIP */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "between", background: "var(--bg-pure-black)", padding: "12px", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700" }}>Side View:</span>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "side")} style={{ marginLeft: "auto", fontSize: "0.8rem" }} />
            {uploading.side && <span style={{ fontSize: "0.75rem", color: "var(--accent-gymshark)" }}>LOCKING IN...</span>}
            {photos.side && <span style={{ fontSize: "0.75rem", color: "#4CAF50" }}>✅ STAGED</span>}
          </div>

          {/* BACK PROFILE SLIP */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "between", background: "var(--bg-pure-black)", padding: "12px", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700" }}>Back View:</span>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "back")} style={{ marginLeft: "auto", fontSize: "0.8rem" }} />
            {uploading.back && <span style={{ fontSize: "0.75rem", color: "var(--accent-gymshark)" }}>LOCKING IN...</span>}
            {photos.back && <span style={{ fontSize: "0.75rem", color: "#4CAF50" }}>✅ STAGED</span>}
          </div>
        </div>
      </div>

      <button type="submit" style={{ width: "100%", padding: "16px", background: "var(--accent-gymshark)", color: "var(--bg-pure-black)", border: "none", borderRadius: "4px", fontFamily: "var(--font-heavy-display)", textTransform: "uppercase", fontWeight: "900", letterSpacing: "0.05em", cursor: "pointer", transition: "transform 0.1s ease" }}>
        Commit Check-In Vector
      </button>
    </form>
  );
};