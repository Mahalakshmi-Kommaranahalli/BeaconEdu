import React, { useState } from "react";
import confetti from "canvas-confetti";
import { 
  ClipboardCheck, 
  Clock, 
  Sparkles, 
  UserCheck, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  PlusCircle,
  FileText
} from "lucide-react";

export default function InterventionHub({
  students,
  risks,
  anonymize,
  onSelectStudent,
  onUpdateStudent,
  currentUser
}) {
  const [filterStage, setFilterStage] = useState("ALL");
  const isStudent = currentUser?.role === "Student";

  const stages = [
    { id: "Recommended", label: "Early Detection / Recommended", icon: AlertCircle, color: "#d97706", bg: "#fffbeb" },
    { id: "Approved", label: "Educator Approved", icon: UserCheck, color: "#0284c7", bg: "#e0f2fe" },
    { id: "In Progress", label: "Active Support Underway", icon: Clock, color: "#0369a1", bg: "#f0f9ff" },
    { id: "Resolved", label: "Successfully Recovered", icon: Sparkles, color: "#059669", bg: "#ecfdf5" }
  ];

  // Group students by stage
  const studentsByStage = {
    Recommended: [],
    Approved: [],
    "In Progress": [],
    Resolved: []
  };

  students.forEach((s) => {
    const status = s.interventionPlan?.status;
    if (status && studentsByStage[status]) {
      studentsByStage[status].push(s);
    }
  });

  const advanceStatus = (student, currentStage) => {
    if (isStudent) return; // Prevent student tampering
    let nextStage = "Approved";
    if (currentStage === "Recommended") nextStage = "Approved";
    else if (currentStage === "Approved") nextStage = "In Progress";
    else if (currentStage === "In Progress") {
      nextStage = "Resolved";
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const updated = {
      ...student,
      interventionPlan: {
        ...student.interventionPlan,
        status: nextStage,
        notes: (student.interventionPlan?.notes || "") + ` · Status updated to ${nextStage} on ${new Date().toISOString().split("T")[0]}`
      }
    };
    onUpdateStudent(updated);
  };

  return (
    <div style={{ padding: "0 0 2rem" }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ClipboardCheck size={22} color="var(--primary)" />
              <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-main)" }}>
                {isStudent ? "My Academic Support & Recovery Pipeline" : "Educator Intervention Management Studio"}
              </h2>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "3px" }}>
              {isStudent 
                ? "Track the real-time stage of your academic interventions and support plans created by faculty advisors." 
                : "Collaborative multi-tiered support workflow. Educators review, approve, modify, and track student recovery."}
            </p>
          </div>

          <div style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "0.5rem 0.85rem",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem"
          }}>
            <Sparkles size={18} color="#10b981" />
            <div>
              <div style={{ fontSize: "0.74rem", fontWeight: "700", color: "#34d399" }}>
                {isStudent ? "Support Plan Progress" : "Recovery Rate Benchmark"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {isStudent 
                  ? "Milestone status is verified and updated by your faculty mentor"
                  : `${studentsByStage["Resolved"].length} of ${students.filter(s => s.interventionPlan?.status && s.interventionPlan?.status !== "None").length} active cases back on healthy trajectory`}
              </div>
            </div>
          </div>
        </div>

        {isStudent && (
          <div style={{
            marginTop: "1rem",
            padding: "0.6rem 0.85rem",
            borderRadius: "var(--radius-sm)",
            background: "rgba(59, 130, 246, 0.08)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.75rem",
            color: "#1e40af"
          }}>
            <AlertCircle size={15} color="#3b82f6" />
            <span>
              <strong>Read-Only Mode:</strong> As a student, you can review all assigned interventions, mentors, and target dates. Stage transitions (Approved, In Progress, Resolved) are authorized and updated by faculty.
            </span>
          </div>
        )}
      </div>

      {/* 4-Column Board */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem",
        alignItems: "flex-start"
      }}>
        {stages.map((stage) => {
          const list = studentsByStage[stage.id] || [];
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className="glass-panel"
              style={{
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                overflow: "hidden",
                minHeight: "500px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Column Header */}
              <div style={{
                padding: "0.85rem 1rem",
                borderBottom: "1px solid var(--border-subtle)",
                background: stage.bg,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Icon size={16} color={stage.color} />
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)" }}>
                    {stage.label}
                  </span>
                </div>
                <span style={{
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "9999px",
                  background: stage.color,
                  color: "#ffffff"
                }}>
                  {list.length}
                </span>
              </div>

              {/* Column Body / Student Cards */}
              <div style={{ padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
                {list.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    No students currently in this stage.
                  </div>
                ) : (
                  list.map((student) => {
                    const risk = risks[student.id];
                    const displayName = anonymize ? `Student #${student.id.replace("STU-", "")}` : student.name;
                    const plan = student.interventionPlan;

                    return (
                      <div
                        key={student.id}
                        className="glass-card"
                        style={{
                          padding: "0.85rem",
                          border: "1px solid var(--border-subtle)",
                          background: "var(--bg-surface-elevated)",
                          borderRadius: "8px"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                          <div>
                            <div style={{ fontWeight: "700", fontSize: "0.86rem", color: "var(--text-main)" }}>
                              {displayName}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <span style={{ fontWeight: "700", color: "#0369a1" }}>{student.branch || student.grade}</span> · <span>{student.section || "Section A"}</span>
                            </div>
                          </div>
                          <span className={`badge ${risk?.badgeClass}`}>
                            {risk?.compositeScore}%
                          </span>
                        </div>

                        {/* Title & Strategy */}
                        <div style={{
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: "6px",
                          padding: "0.55rem 0.65rem",
                          marginBottom: "0.6rem",
                          border: "1px solid var(--border-subtle)"
                        }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--primary)" }}>
                            {plan?.title || "Targeted Support"}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                            {plan?.strategy}
                          </div>
                        </div>

                        {/* Goal */}
                        <div style={{ fontSize: "0.72rem", color: "var(--text-main)", marginBottom: "0.6rem" }}>
                          <strong style={{ color: "var(--text-muted)" }}>Goal:</strong> {plan?.targetGoal}
                        </div>

                        {/* Assigned To */}
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                          👤 Assigned: {plan?.assignedTo}
                        </div>

                        {/* Card Action Controls */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem" }}>
                          <button
                            onClick={() => onSelectStudent(student)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "var(--text-muted)",
                              fontSize: "0.72rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem"
                            }}
                          >
                            <span>Open Details</span>
                            <ExternalLink size={12} />
                          </button>

                          {!isStudent && stage.id !== "Resolved" && (
                            <button
                              onClick={() => advanceStatus(student, stage.id)}
                              className="btn-primary"
                              style={{
                                fontSize: "0.7rem",
                                padding: "0.3rem 0.6rem",
                                borderRadius: "4px"
                              }}
                            >
                              <span>{stage.id === "Recommended" ? "Approve Plan" : stage.id === "Approved" ? "Begin Support" : "Mark Recovered"}</span>
                              <ArrowRight size={12} />
                            </button>
                          )}

                          {isStudent && (
                            <span style={{
                              fontSize: "0.68rem",
                              fontWeight: "600",
                              color: "var(--text-muted)",
                              background: "rgba(0,0,0,0.04)",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px"
                            }}>
                              {stage.id === "Resolved" ? "✅ Completed" : "⏳ Active Stage"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
