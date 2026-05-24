import React, { useState } from "react";
import { getUploadSignature } from "../lib/api";

interface CheckInFormProps {
  authToken: string;
  onSubmit: (formData: any) => Promise<void>;
  onPhotoStaged: (key: "front" | "side" | "back", url: string) => void;
}

export const CheckInForm = ({ authToken, onSubmit, onPhotoStaged }: CheckInFormProps) => {
  const [form, setForm] = useState({
    weightKg: "",
    calories: "",
    goal: "recomp",
    workoutNotes: "",
    photos: { front: "", side: "", back: "" },
  });

  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({
    front: false,
    side: false,
    back: false,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (key: "front" | "side" | "back", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [key]: true }));

    try {
      const sig = await getUploadSignature(authToken);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sig.apiKey);
      fd.append("timestamp", String(sig.timestamp));
      fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      
      setForm((prev) => ({
        ...prev,
        photos: { ...prev.photos, [key]: data.secure_url },
      }));

      // Fire state update to replace top-row previews instantly
      onPhotoStaged(key, data.secure_url);

    } catch (err) {
      console.error("Asset upload failed:", err);
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        weightKg: parseFloat(form.weightKg) || 0,
        calories: parseInt(form.calories) || 0,
      });
      setForm({
        weightKg: "",
        calories: "",
        goal: "recomp",
        workoutNotes: "",
        photos: { front: "", side: "", back: "" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-matrix-form">
      <div className="form-title-heavy">Log Entry Parameters</div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-input-wrapper">
            <label className="form-label-premium">Current Mass (KG)</label>
            <input
              type="number"
              name="weightKg"
              step="0.1"
              className="input-premium"
              placeholder="0.0"
              value={form.weightKg}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-input-wrapper">
            <label className="form-label-premium">Caloric Budget (KCAL)</label>
            <input
              type="number"
              name="calories"
              className="input-premium"
              placeholder="2500"
              value={form.calories}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-input-wrapper">
          <label className="form-label-premium">Micro-Cycle Strategy</label>
          <select name="goal" className="input-premium" value={form.goal} onChange={handleInputChange} style={{ background: "var(--bg-input-field)" }}>
            <option value="recomp">Body Recomposition Phase</option>
            <option value="cut">Controlled Deficit (Cut)</option>
            <option value="bulk">Hypertrophy Surplus (Bulk)</option>
          </select>
        </div>

        <div className="form-input-wrapper">
          <label className="form-label-premium">Performance & Lift Manifests</label>
          <textarea
            name="workoutNotes"
            className="input-premium"
            placeholder="Log target lifts, failures, sleep variables..."
            value={form.workoutNotes}
            onChange={handleInputChange}
            rows={3}
            style={{ resize: "none" }}
          />
        </div>

        <div style={{ margin: "20px 0" }}>
          <label className="form-label-premium">Physique Alignment Captures</label>
          <div className="aspect-grid">
            {(["front", "side", "back"] as const).map((view) => {
              const hasFile = !!form.photos[view];
              return (
                <div key={view}>
                  <input 
                    type="file" 
                    id={`file-${view}`} 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(view, e)} 
                    disabled={!authToken || uploading[view]}
                    style={{ display: "none" }} 
                  />
                  <label 
                    htmlFor={`file-${view}`} 
                    className={`aspect-upload-btn ${hasFile ? 'has-file' : ''}`}
                  >
                    {uploading[view] ? (
                      <span style={{ color: "var(--accent-gymshark)" }}>Saving...</span>
                    ) : hasFile ? (
                      <span>✓ Ready</span>
                    ) : (
                      <span>+ {view}</span>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <button type="submit" className="btn-gymshark-prime" disabled={loading || !authToken}>
          {loading ? "Processing..." : "Compile Vector Matrix →"}
        </button>
      </form>
    </div>
  );
};