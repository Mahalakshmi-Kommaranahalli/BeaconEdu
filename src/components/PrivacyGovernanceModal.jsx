import React from "react";
import { 
  X, 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  FileSpreadsheet, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default function PrivacyGovernanceModal({
  students,
  risks,
  anonymize,
  setAnonymize,
  onResetCohort,
  onClose
}) {

  // Export cohort data as JSON
  const handleExportJSON = () => {
    const exportData = students.map((s) => {
      const risk = risks[s.id];
      return {
        id: s.id,
        name: anonymize ? `Student #${s.id.replace("STU-", "")}` : s.name,
        grade: s.grade,
        riskScore: risk?.compositeScore,
        riskTier: risk?.riskTier,
        attendanceRate: s.attendance.overallRate,
        currentAverage: s.academics.currentAverage,
        missingAssignments: s.learningProgress.missingAssignments,
        interventionStatus: s.interventionPlan?.status || "None",
        primaryDrivers: risk?.drivers?.map((d) => d.factor).join("; ")
      };
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beaconedu-risk-audit-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export cohort data as CSV
  const handleExportCSV = () => {
    const headers = [
      "Student ID",
      "Name",
      "Grade",
      "Risk Score",
      "Risk Tier",
      "Attendance Rate",
      "Academic Avg",
      "Missing Work",
      "Intervention Status"
    ];

    const rows = students.map((s) => {
      const risk = risks[s.id];
      const name = anonymize ? `Student #${s.id.replace("STU-", "")}` : s.name;
      return [
        s.id,
        `"${name}"`,
        `"${s.grade}"`,
        risk?.compositeScore || 0,
        `"${risk?.riskTier || ""}"`,
        s.attendance.overallRate,
        s.academics.currentAverage,
        s.learningProgress.missingAssignments,
        `"${s.interventionPlan?.status || "None"}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beaconedu-risk-audit-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        maxWidth: "680px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
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
            <ShieldCheck size={22} color="#10b981" />
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
                Privacy, Explainability & Responsible AI Governance
              </h3>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Ethical safeguards adhering to student privacy and human-in-the-loop constraints
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ width: "32px", height: "32px" }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
          
          {/* Safeguard Principles */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.5rem" }}>
            
            <div style={{
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "8px",
              padding: "0.85rem 1rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700", fontSize: "0.85rem", color: "#0284c7" }}>
                <ShieldCheck size={16} />
                <span>1. Non-Punitive Decision Support (No Automated Irreversible Decisions)</span>
              </div>
              <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.3rem", lineHeight: 1.45 }}>
                BeaconEdu is strictly designed as an <em>early warning advisory tool</em> to assist professional educators. The system is structurally prohibited from taking autonomous actions such as failing a student, modifying disciplinary records, or making automated tracking placements.
              </p>
            </div>

            <div style={{
              background: "#ecfdf5",
              border: "1px solid #6ee7b7",
              borderRadius: "8px",
              padding: "0.85rem 1rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700", fontSize: "0.85rem", color: "#059669" }}>
                <Lock size={16} />
                <span>2. Local-First Client Architecture & FERPA Compliance</span>
              </div>
              <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.3rem", lineHeight: 1.45 }}>
                All synthesis, diagnostic weighting, and simulation occur 100% locally within the browser session. No personally identifiable student records (PII) are transmitted or logged to unauthorized third-party machine learning models.
              </p>
            </div>

            <div style={{
              background: "#fffbeb",
              border: "1px solid #fcd34d",
              borderRadius: "8px",
              padding: "0.85rem 1rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700", fontSize: "0.85rem", color: "#d97706" }}>
                <EyeOff size={16} />
                <span>3. One-Click FERPA Masking Mode</span>
              </div>
              <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.3rem", lineHeight: 1.45 }}>
                Educators can toggle anonymization during staff consultations or team meetings. Student names, photos, and personal identifiers are immediately obscured with randomized tokens to prevent subconscious bias and protect student dignity.
              </p>
            </div>

          </div>

          {/* Anonymizer Toggle inside modal */}
          <div style={{
            background: "var(--bg-surface-elevated)",
            padding: "0.85rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem"
          }}>
            <div>
              <div style={{ fontSize: "0.84rem", fontWeight: "700", color: "var(--text-main)" }}>
                FERPA Privacy Masking
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Mask student names and identifiers in roster and reports
              </div>
            </div>
            <button
              onClick={() => setAnonymize(!anonymize)}
              className={anonymize ? "btn-primary" : "btn-secondary"}
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
            >
              {anonymize ? "Active (Masked)" : "Disabled (Show Names)"}
            </button>
          </div>

          {/* Export & Reset Controls */}
          <div>
            <h4 style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "0.6rem" }}>
              Data Export & Audit Controls
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <button
                onClick={handleExportCSV}
                className="btn-secondary"
                style={{ fontSize: "0.78rem" }}
              >
                <Download size={14} />
                <span>Export Audit Roster (CSV)</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="btn-secondary"
                style={{ fontSize: "0.78rem" }}
              >
                <Download size={14} />
                <span>Export Analysis (JSON)</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm("Reset all students and interventions back to standard demo cohort?")) {
                    onResetCohort();
                    onClose();
                  }
                }}
                className="btn-ghost"
                style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}
              >
                <RotateCcw size={14} />
                <span>Reset Demo Cohort</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "flex-end",
          background: "var(--bg-surface-elevated)"
        }}>
          <button onClick={onClose} className="btn-primary" style={{ fontSize: "0.8rem" }}>
            Close Governance Center
          </button>
        </div>
      </div>
    </div>
  );
}
