import React, { useState } from "react";
import { X, Sliders, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";
import { defaultWeights } from "../utils/riskEngine";

export default function AlgorithmConfigModal({ weights, onSaveWeights, onClose }) {
  const [localWeights, setLocalWeights] = useState({
    academics: Math.round(weights.academics * 100),
    attendance: Math.round(weights.attendance * 100),
    progress: Math.round(weights.progress * 100),
    participation: Math.round(weights.participation * 100),
    feedback: Math.round(weights.feedback * 100),
  });

  const total =
    localWeights.academics +
    localWeights.attendance +
    localWeights.progress +
    localWeights.participation +
    localWeights.feedback;

  const isValid = total === 100;

  const handleSlider = (key, value) => {
    setLocalWeights({
      ...localWeights,
      [key]: Number(value),
    });
  };

  const handleReset = () => {
    setLocalWeights({
      academics: Math.round(defaultWeights.academics * 100),
      attendance: Math.round(defaultWeights.attendance * 100),
      progress: Math.round(defaultWeights.progress * 100),
      participation: Math.round(defaultWeights.participation * 100),
      feedback: Math.round(defaultWeights.feedback * 100),
    });
  };

  const handleSave = () => {
    if (!isValid) return;
    onSaveWeights({
      academics: localWeights.academics / 100,
      attendance: localWeights.attendance / 100,
      progress: localWeights.progress / 100,
      participation: localWeights.participation / 100,
      feedback: localWeights.feedback / 100,
    });
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div className="glass-panel" style={{
        width: "100%",
        maxWidth: "600px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-highlight)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--bg-surface-elevated)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Sliders size={20} color="var(--primary)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
              Transparent Algorithm Weight Customizer
            </h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ width: "32px", height: "32px" }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
            To prevent black-box bias, educators retain full authority to calibrate how indicators are weighted according to course characteristics (e.g. lab-intensive courses vs asynchronous distance study).
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {/* Academics */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                <span style={{ fontWeight: "600", color: "var(--text-main)" }}>Academic Assessment & Test Trajectory</span>
                <span style={{ fontWeight: "700", color: "var(--primary)" }}>{localWeights.academics}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={localWeights.academics}
                onChange={(e) => handleSlider("academics", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Attendance */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                <span style={{ fontWeight: "600", color: "var(--text-main)" }}>Attendance Stability & Consecutive Absences</span>
                <span style={{ fontWeight: "700", color: "var(--primary)" }}>{localWeights.attendance}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={localWeights.attendance}
                onChange={(e) => handleSlider("attendance", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Learning Progress */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                <span style={{ fontWeight: "600", color: "var(--text-main)" }}>Assignment Timeliness & Submission Backlog</span>
                <span style={{ fontWeight: "700", color: "var(--primary)" }}>{localWeights.progress}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={localWeights.progress}
                onChange={(e) => handleSlider("progress", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Participation */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                <span style={{ fontWeight: "600", color: "var(--text-main)" }}>In-Class Engagement & Peer Collaboration</span>
                <span style={{ fontWeight: "700", color: "var(--primary)" }}>{localWeights.participation}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={localWeights.participation}
                onChange={(e) => handleSlider("participation", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Teacher Feedback */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                <span style={{ fontWeight: "600", color: "var(--text-main)" }}>Qualitative Teacher Sentiment & Case Notes</span>
                <span style={{ fontWeight: "700", color: "var(--primary)" }}>{localWeights.feedback}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={localWeights.feedback}
                onChange={(e) => handleSlider("feedback", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

          </div>

          {/* Validation Total Bar */}
          <div style={{
            marginTop: "1.25rem",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            background: isValid ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: `1px solid ${isValid ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {isValid ? <CheckCircle2 size={16} color="#10b981" /> : <AlertTriangle size={16} color="#ef4444" />}
              <span style={{ fontSize: "0.8rem", color: isValid ? "#34d399" : "#f87171", fontWeight: "600" }}>
                {isValid ? "Total Weight: Exactly 100% (Balanced)" : `Total Weight is ${total}%. Must equal 100%.`}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="btn-ghost"
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", gap: "0.3rem" }}
            >
              <RotateCcw size={12} /> Reset Defaults
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.75rem",
          background: "var(--bg-surface-elevated)"
        }}>
          <button onClick={onClose} className="btn-secondary" style={{ fontSize: "0.8rem" }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="btn-primary"
            style={{ fontSize: "0.8rem", opacity: isValid ? 1 : 0.5 }}
          >
            Apply Weight Model
          </button>
        </div>
      </div>
    </div>
  );
}
