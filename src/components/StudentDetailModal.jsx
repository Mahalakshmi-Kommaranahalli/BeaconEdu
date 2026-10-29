import React, { useState } from "react";
import confetti from "canvas-confetti";
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Clock, 
  FileText, 
  Send,
  Zap,
  Info
} from "lucide-react";
import { simulateRiskProjection } from "../utils/riskEngine";

export default function StudentDetailModal({
  student,
  risk,
  weights,
  anonymize,
  onClose,
  onUpdateStudent
}) {
  if (!student || !risk) return null;

  const [activeTab, setActiveTab] = useState("explain"); // "explain", "trends", "subjects", "feedback", "simulator", "intervention"
  
  // "What-If" simulator state
  const [simAdjustments, setSimAdjustments] = useState({
    attendanceBoost: 10,
    missingAssignmentsResolved: Math.min(student.learningProgress.missingAssignments, 3),
    gradeGain: 8,
    participationBoost: 15
  });

  // New feedback note form state
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteSentiment, setNewNoteSentiment] = useState("Concern");
  const [newNoteTeacher, setNewNoteTeacher] = useState("Mrs. Lawson (Advisor)");

  // Intervention editor state
  const [planTitle, setPlanTitle] = useState(student.interventionPlan?.title || (risk.suggestedInterventions[0] || "Custom Academic Recovery Plan"));
  const [planStrategy, setPlanStrategy] = useState(student.interventionPlan?.strategy || "1-on-1 Mentorship + Pacing Modification");
  const [planAssigned, setPlanAssigned] = useState(student.interventionPlan?.assignedTo || "Educator Team & Guidance Counselor");
  const [planGoal, setPlanGoal] = useState(student.interventionPlan?.targetGoal || "Raise attendance above 85% and recover 3 missing assignments");
  const [planStatus, setPlanStatus] = useState(student.interventionPlan?.status || "Recommended");
  const [planNotes, setPlanNotes] = useState(student.interventionPlan?.notes || "");

  const displayName = anonymize ? `Student #${student.id.replace("STU-", "")}` : student.name;
  const avatarInitials = anonymize ? `#${student.id.replace("STU-", "")}` : student.name.split(" ").map((n) => n[0]).join("");

  // Calculate simulation outcome
  const projection = simulateRiskProjection(student, simAdjustments, weights);

  // Save intervention changes
  const handleSaveIntervention = (newStatus = planStatus) => {
    const updatedPlan = {
      status: newStatus,
      title: planTitle,
      strategy: planStrategy,
      assignedTo: planAssigned,
      targetGoal: planGoal,
      createdDate: student.interventionPlan?.createdDate || new Date().toISOString().split("T")[0],
      notes: planNotes
    };

    const updatedStudent = {
      ...student,
      interventionPlan: updatedPlan
    };

    if (newStatus === "Resolved") {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    onUpdateStudent(updatedStudent);
    setPlanStatus(newStatus);
  };

  // Add qualitative teacher note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote = {
      id: `TN-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      teacher: newNoteTeacher,
      sentiment: newNoteSentiment,
      tag: "Observation",
      text: newNoteText.trim()
    };

    const updatedNotes = [newNote, ...(student.teacherNotes || [])];
    const updatedStudent = {
      ...student,
      teacherNotes: updatedNotes
    };

    onUpdateStudent(updatedStudent);
    setNewNoteText("");
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
        maxWidth: "960px",
        maxHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-highlight)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        overflow: "hidden"
      }}>
        
        {/* Modal Top Header */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--bg-surface-elevated)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: anonymize ? "#475569" : student.avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "1.1rem"
            }}>
              {avatarInitials}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)" }}>
                  {displayName}
                </h2>
                <span className={`badge ${risk.badgeClass}`}>
                  {risk.riskTier} ({risk.compositeScore}%)
                </span>
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {student.id} · {student.grade} · {student.section || student.homeroom}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              background: "#e0f2fe",
              border: "1px solid #bae6fd",
              padding: "0.35rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.72rem",
              color: "#0369a1",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}>
              <ShieldCheck size={14} color="#0284c7" /> Advisory Mode Only
            </div>
            <button
              onClick={onClose}
              className="btn-ghost"
              style={{ width: "36px", height: "36px" }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          padding: "0.5rem 1.5rem",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          overflowX: "auto"
        }}>
          {[
            { id: "explain", label: "Explainability & Diagnostics", icon: AlertTriangle },
            { id: "trends", label: "Longitudinal Trends", icon: TrendingUp },
            { id: "subjects", label: "Courses & LMS Activity", icon: BookOpen },
            { id: "feedback", label: `Teacher Notes (${student.teacherNotes?.length || 0})`, icon: MessageSquare },
            { id: "simulator", label: "What-If Simulator", icon: Sliders },
            { id: "intervention", label: "Intervention Plan", icon: CheckCircle2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "0.5rem 0.85rem",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: isActive ? "#e0f2fe" : "transparent",
                  color: isActive ? "#0284c7" : "var(--text-muted)",
                  borderBottom: isActive ? "2px solid #0284c7" : "2px solid transparent",
                  whiteSpace: "nowrap"
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
          
          {/* TAB 1: EXPLAINABILITY & DIAGNOSTICS */}
          {activeTab === "explain" && (
            <div>
              <div style={{
                background: "#f0f9ff",
                border: "1px solid #bae6fd",
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md)",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem"
              }}>
                <Info size={18} color="#0284c7" style={{ marginTop: "2px", flexShrink: 0 }} />
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-main)" }}>Transparent Decision Support:</strong> This risk score is decomposed into 5 transparent weighted pillars. Review the specific factors below to design a personalized support plan.
                </div>
              </div>

              {/* 5-Pillar Score Cards */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "0.75rem",
                marginBottom: "1.5rem"
              }}>
                {[
                  { label: "Academics", score: risk.components.academicRisk, weight: `${weights.academics * 100}%` },
                  { label: "Attendance", score: risk.components.attendanceRisk, weight: `${weights.attendance * 100}%` },
                  { label: "Progress/Timeliness", score: risk.components.progressRisk, weight: `${weights.progress * 100}%` },
                  { label: "Participation", score: risk.components.participationRisk, weight: `${weights.participation * 100}%` },
                  { label: "Teacher Feedback", score: risk.components.feedbackRisk, weight: `${weights.feedback * 100}%` }
                ].map((item, idx) => {
                  const isHigh = item.score >= 65;
                  const isMod = item.score >= 40 && item.score < 65;
                  const color = isHigh ? "#ef4444" : isMod ? "#f59e0b" : "#10b981";

                  return (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-surface-elevated)",
                        border: `1px solid ${isHigh ? "rgba(239, 68, 68, 0.3)" : "var(--border-subtle)"}`,
                        borderRadius: "8px",
                        padding: "0.75rem"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        <span>{item.label}</span>
                        <span>Wt: {item.weight}</span>
                      </div>
                      <div style={{ fontSize: "1.4rem", fontWeight: "800", color, marginTop: "0.2rem" }}>
                        {item.score}%
                      </div>
                      <div style={{
                        height: "4px",
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: "2px",
                        overflow: "hidden",
                        marginTop: "0.4rem"
                      }}>
                        <div style={{ width: `${item.score}%`, height: "100%", background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Primary Drivers (Why is this student flagged?) */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "0.6rem" }}>
                  Primary Risk Drivers
                </h4>
                {risk.drivers.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No elevated risk signals detected. Student is on track.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {risk.drivers.map((driver, i) => (
                      <div
                        key={i}
                        style={{
                          background: driver.severity === "critical" ? "rgba(239, 68, 68, 0.08)" : "rgba(245, 158, 11, 0.08)",
                          border: `1px solid ${driver.severity === "critical" ? "rgba(239, 68, 68, 0.25)" : "rgba(245, 158, 11, 0.25)"}`,
                          borderRadius: "8px",
                          padding: "0.75rem 1rem",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.75rem"
                        }}
                      >
                        <AlertTriangle
                          size={18}
                          color={driver.severity === "critical" ? "#ef4444" : "#f59e0b"}
                          style={{ marginTop: "2px", flexShrink: 0 }}
                        />
                        <div>
                          <div style={{
                            fontWeight: "700",
                            fontSize: "0.84rem",
                            color: driver.severity === "critical" ? "#f87171" : "#fbbf24"
                          }}>
                            {driver.factor} (+{driver.weightImpact} pts to composite score)
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-main)", marginTop: "2px" }}>
                            {driver.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Protective Factors */}
              {risk.protectiveFactors.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "0.6rem" }}>
                    Protective Strengths & Assets
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {risk.protectiveFactors.map((strength, i) => (
                      <div
                        key={i}
                        style={{
                          background: "rgba(16, 185, 129, 0.08)",
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                          borderRadius: "6px",
                          padding: "0.5rem 0.85rem",
                          fontSize: "0.78rem",
                          color: "#34d399",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                      >
                        <CheckCircle2 size={15} />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Recommended Interventions */}
              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "0.6rem" }}>
                  Suggested Targeted Educational Interventions
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.6rem" }}>
                  {risk.suggestedInterventions.map((intervention, i) => (
                    <div
                      key={i}
                      style={{
                        background: "var(--bg-surface-elevated)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                        padding: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Zap size={16} color="var(--primary)" />
                        <span style={{ fontSize: "0.8rem", color: "var(--text-main)", fontWeight: "500" }}>
                          {intervention}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setPlanTitle(intervention);
                          setActiveTab("intervention");
                        }}
                        style={{
                          background: "#e0f2fe",
                          color: "#0284c7",
                          border: "1px solid #bae6fd",
                          borderRadius: "4px",
                          padding: "0.3rem 0.6rem",
                          fontSize: "0.72rem",
                          fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LONGITUDINAL TRENDS */}
          {activeTab === "trends" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)" }}>
                    6-Week Progression: Academics vs Attendance
                  </h4>
                  <p style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    Weekly evaluation of grade trajectory against attendance stability
                  </p>
                </div>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.74rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#0284c7" }} />
                    <span style={{ color: "var(--text-main)", fontWeight: "600" }}>Academic Avg (%)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#38bdf8" }} />
                    <span style={{ color: "var(--text-main)", fontWeight: "600" }}>Attendance Rate (%)</span>
                  </div>
                </div>
              </div>

              {/* Custom SVG Line Chart */}
              <div style={{
                background: "#f0f9ff",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem",
                border: "1px solid #bae6fd"
              }}>
                <svg viewBox="0 0 600 240" style={{ width: "100%", height: "240px", overflow: "visible" }}>
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((val) => {
                    const y = 200 - (val / 100) * 180;
                    return (
                      <g key={val}>
                        <line x1="40" y1={y} x2="580" y2={y} stroke="#cbd5e1" strokeDasharray="3 3" />
                        <text x="30" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end">{val}%</text>
                      </g>
                    );
                  })}

                  {/* Week Labels */}
                  {["W-1", "W-2", "W-3", "W-4", "W-5", "W-6 (Current)"].map((w, idx) => {
                    const x = 70 + idx * 95;
                    return (
                      <text key={idx} x={x} y="225" fill="#475569" fontSize="11" textAnchor="middle" fontWeight="600">{w}</text>
                    );
                  })}

                  {/* Academic Points & Path */}
                  {(() => {
                    const data = student.academics.trend || [70, 70, 70, 70, 70, 70];
                    const pts = data.map((v, i) => `${70 + i * 95},${200 - (v / 100) * 180}`).join(" ");
                    return (
                      <>
                        <polyline fill="none" stroke="#0284c7" strokeWidth="3" points={pts} />
                        {data.map((v, i) => (
                          <circle key={i} cx={70 + i * 95} cy={200 - (v / 100) * 180} r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                        ))}
                      </>
                    );
                  })()}

                  {/* Attendance Points & Path */}
                  {(() => {
                    const data = student.attendance.trend || [85, 85, 85, 85, 85, 85];
                    const pts = data.map((v, i) => `${70 + i * 95},${200 - (v / 100) * 180}`).join(" ");
                    return (
                      <>
                        <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 2" points={pts} />
                        {data.map((v, i) => (
                          <circle key={i} cx={70 + i * 95} cy={200 - (v / 100) * 180} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Trend Analysis Callout */}
              <div style={{
                marginTop: "1rem",
                padding: "0.85rem 1rem",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                display: "flex",
                justifyContent: "space-between"
              }}>
                <span>
                  <strong>Trajectory Assessment:</strong> Recent 3-week correlation indicates {student.attendance.consecutiveAbsences > 0 ? "attendance lapses closely precede academic assessment drop-offs." : "stable presence with isolated concept struggles."}
                </span>
                <span style={{ color: student.academics.recentDrop < 0 ? "#f87171" : "#34d399", fontWeight: "700" }}>
                  Delta: {student.academics.recentDrop}%
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: SUBJECTS & LMS ACTIVITY */}
          {activeTab === "subjects" && (
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "0.75rem" }}>
                Course-by-Course Performance
              </h4>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {student.academics.subjects.map((sub, i) => {
                  const isCrit = sub.status === "Critical";
                  const isWarn = sub.status === "Warning";
                  const color = isCrit ? "#ef4444" : isWarn ? "#f59e0b" : "#10b981";

                  return (
                    <div
                      key={i}
                      style={{
                        background: "var(--bg-surface-elevated)",
                        border: `1px solid ${isCrit ? "rgba(239, 68, 68, 0.3)" : "var(--border-subtle)"}`,
                        borderRadius: "8px",
                        padding: "0.85rem"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "700", fontSize: "0.85rem", color: "var(--text-main)" }}>
                          {sub.name}
                        </span>
                        <span style={{
                          fontSize: "0.68rem",
                          fontWeight: "700",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          background: `rgba(${isCrit ? "239, 68, 68" : isWarn ? "245, 158, 11" : "16, 185, 129"}, 0.15)`,
                          color
                        }}>
                          {sub.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "800", color, marginTop: "0.4rem" }}>
                        {sub.grade}%
                      </div>
                    </div>
                  );
                })}
              </div>

              <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "0.75rem" }}>
                Digital LMS & Assignment Pacing Signals
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                <div className="glass-card" style={{ padding: "0.85rem" }}>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Missing Coursework</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: "800", color: student.learningProgress.missingAssignments > 2 ? "#ef4444" : "#10b981", marginTop: "0.2rem" }}>
                    {student.learningProgress.missingAssignments} items
                  </div>
                </div>

                <div className="glass-card" style={{ padding: "0.85rem" }}>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Submission Timeliness</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: "800", color: student.learningProgress.submissionTimeliness < 70 ? "#f59e0b" : "#10b981", marginTop: "0.2rem" }}>
                    {student.learningProgress.submissionTimeliness}%
                  </div>
                </div>

                <div className="glass-card" style={{ padding: "0.85rem" }}>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Weekly LMS Platform Hours</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#06b6d4", marginTop: "0.2rem" }}>
                    {student.learningProgress.lmsWeeklyHours} hrs
                  </div>
                </div>

                <div className="glass-card" style={{ padding: "0.85rem" }}>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Instructional Video Completion</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#a855f7", marginTop: "0.2rem" }}>
                    {student.learningProgress.videoCompletionRate}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TEACHER NOTES & OBSERVATIONS */}
          {activeTab === "feedback" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)" }}>
                    Educator Qualitative Observations
                  </h4>
                  <p style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    Non-numeric context: Behavioral cues, personal distress, and engagement logs
                  </p>
                </div>
              </div>

              {/* Add New Observation Form */}
              <form onSubmit={handleAddNote} style={{
                background: "var(--bg-surface-elevated)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                marginBottom: "1.25rem"
              }}>
                <div style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "0.5rem" }}>
                  Log New Section Observation
                </div>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Record qualitative observation (e.g. participation changes, concept hurdles, peer interaction)..."
                  rows={2}
                  style={{
                    width: "100%",
                    background: "var(--bg-surface)",
                    color: "var(--text-main)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "6px",
                    padding: "0.6rem",
                    fontSize: "0.8rem",
                    resize: "vertical",
                    outline: "none"
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <select
                      value={newNoteSentiment}
                      onChange={(e) => setNewNoteSentiment(e.target.value)}
                      style={{
                        background: "var(--bg-surface)",
                        color: "var(--text-main)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "6px",
                        padding: "0.35rem 0.6rem",
                        fontSize: "0.75rem"
                      }}
                    >
                      <option value="Concern">Concern</option>
                      <option value="Urgent">Urgent Alert</option>
                      <option value="Neutral">Neutral</option>
                      <option value="Positive">Positive Improvement</option>
                    </select>

                    <input
                      type="text"
                      value={newNoteTeacher}
                      onChange={(e) => setNewNoteTeacher(e.target.value)}
                      placeholder="Teacher Name / Course"
                      style={{
                        background: "var(--bg-surface)",
                        color: "var(--text-main)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "6px",
                        padding: "0.35rem 0.6rem",
                        fontSize: "0.75rem",
                        width: "180px"
                      }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem" }}>
                    <Send size={13} />
                    <span>Post Note</span>
                  </button>
                </div>
              </form>

              {/* Feed of Notes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {student.teacherNotes && student.teacherNotes.length > 0 ? (
                  student.teacherNotes.map((note) => {
                    const isUrgent = note.sentiment === "Urgent";
                    const isConcern = note.sentiment === "Concern";
                    const isPos = note.sentiment === "Positive";
                    const color = isUrgent ? "#ef4444" : isConcern ? "#f59e0b" : isPos ? "#10b981" : "var(--text-muted)";

                    return (
                      <div
                        key={note.id}
                        style={{
                          background: "var(--bg-surface-elevated)",
                          borderLeft: `3px solid ${color}`,
                          borderRadius: "6px",
                          padding: "0.85rem 1rem"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontWeight: "700", fontSize: "0.82rem", color: "var(--text-main)" }}>
                              {note.teacher}
                            </span>
                            <span style={{
                              fontSize: "0.68rem",
                              fontWeight: "600",
                              color,
                              background: `rgba(${isUrgent ? "239,68,68" : isConcern ? "245,158,11" : isPos ? "16,185,129" : "150,150,150"}, 0.15)`,
                              padding: "0.1rem 0.4rem",
                              borderRadius: "4px"
                            }}>
                              {note.sentiment}
                            </span>
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            {note.date}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-main)", lineHeight: 1.45 }}>
                          "{note.text}"
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>
                    No teacher notes recorded yet.
                  </p>
                )}
              </div>

            </div>
          )}

          {/* TAB 5: WHAT-IF INTERVENTION SIMULATOR */}
          {activeTab === "simulator" && (
            <div>
              <div style={{
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                border: "1px solid #bae6fd",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                marginBottom: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>
                    Intervention Impact Projection Simulator
                  </h4>
                  <p style={{ fontSize: "0.76rem", color: "#475569" }}>
                    Model how specific educational interventions will recover student trajectory before committing
                  </p>
                </div>

                {/* Score Projection Badges */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Current Score</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color: risk.tierColor }}>
                      {projection.baselineScore}%
                    </div>
                  </div>
                  <div style={{ fontSize: "1.2rem", color: "#64748b" }}>→</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.7rem", color: "#047857", fontWeight: "700" }}>Projected Score</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "#059669" }}>
                      {projection.projectedScore}%
                    </div>
                  </div>
                  <div style={{
                    background: "#ecfdf5",
                    border: "1px solid #6ee7b7",
                    padding: "0.4rem 0.65rem",
                    borderRadius: "6px",
                    color: "#047857",
                    fontWeight: "700",
                    fontSize: "0.85rem"
                  }}>
                    -{projection.scoreReduction} pts risk reduction!
                  </div>
                </div>
              </div>

              {/* Sliders */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                
                {/* Attendance Boost */}
                <div className="glass-card">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                    <span style={{ fontWeight: "600", color: "var(--text-main)" }}>Attendance Support Plan</span>
                    <span style={{ color: "var(--primary)", fontWeight: "700" }}>+{simAdjustments.attendanceBoost}% attendance</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="5"
                    value={simAdjustments.attendanceBoost}
                    onChange={(e) => setSimAdjustments({ ...simAdjustments, attendanceBoost: Number(e.target.value) })}
                    style={{ width: "100%" }}
                  />
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                    Modeled as: Bus schedule resolution, morning check-in counselor.
                  </div>
                </div>

                {/* Missing Assignments Resolved */}
                <div className="glass-card">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                    <span style={{ fontWeight: "600", color: "var(--text-main)" }}>Study Hall Homework Recovery</span>
                    <span style={{ color: "var(--primary)", fontWeight: "700" }}>{simAdjustments.missingAssignmentsResolved} assignments completed</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(student.learningProgress.missingAssignments, 4)}
                    step="1"
                    value={simAdjustments.missingAssignmentsResolved}
                    onChange={(e) => setSimAdjustments({ ...simAdjustments, missingAssignmentsResolved: Number(e.target.value) })}
                    style={{ width: "100%" }}
                  />
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                    Modeled as: Scaffolded catch-up blocks to resolve backlog.
                  </div>
                </div>

                {/* Grade Gain from Tutoring */}
                <div className="glass-card">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                    <span style={{ fontWeight: "600", color: "var(--text-main)" }}>1-on-1 Tutoring / Retake Gain</span>
                    <span style={{ color: "var(--primary)", fontWeight: "700" }}>+{simAdjustments.gradeGain}% assessment gain</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="2"
                    value={simAdjustments.gradeGain}
                    onChange={(e) => setSimAdjustments({ ...simAdjustments, gradeGain: Number(e.target.value) })}
                    style={{ width: "100%" }}
                  />
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                    Modeled as: Remedial tutoring on core algebra/science concepts.
                  </div>
                </div>

                {/* Participation Boost */}
                <div className="glass-card">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                    <span style={{ fontWeight: "600", color: "var(--text-main)" }}>Peer Group Engagement</span>
                    <span style={{ color: "var(--primary)", fontWeight: "700" }}>+{simAdjustments.participationBoost} engagement pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="5"
                    value={simAdjustments.participationBoost}
                    onChange={(e) => setSimAdjustments({ ...simAdjustments, participationBoost: Number(e.target.value) })}
                    style={{ width: "100%" }}
                  />
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                    Modeled as: Pairing with peer study mentor in collaborative labs.
                  </div>
                </div>

              </div>

              {/* Action trigger */}
              <div style={{ textAlign: "right", marginTop: "1.25rem" }}>
                <button
                  onClick={() => {
                    setPlanGoal(`Achieve +${simAdjustments.attendanceBoost}% attendance and resolve ${simAdjustments.missingAssignmentsResolved} missing assignments`);
                    setActiveTab("intervention");
                  }}
                  className="btn-primary"
                  style={{ fontSize: "0.82rem" }}
                >
                  <CheckCircle2 size={16} />
                  <span>Translate Simulation to Formal Action Plan</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 6: ACTIONABLE INTERVENTION PLAN */}
          {activeTab === "intervention" && (
            <div>
              <div style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md)",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem"
              }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.85rem", color: "#34d399" }}>
                    Human-in-the-Loop Educator Governance
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    All interventions require certified educator authorization. AI cannot unilaterally penalize or modify student status.
                  </div>
                </div>

                {/* Status Switcher */}
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {["Recommended", "Approved", "In Progress", "Resolved"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleSaveIntervention(st)}
                      style={{
                        padding: "0.35rem 0.7rem",
                        borderRadius: "6px",
                        border: "1px solid var(--border-subtle)",
                        fontSize: "0.74rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        background: planStatus === st ? "var(--primary)" : "var(--bg-surface)",
                        color: planStatus === st ? "#ffffff" : "var(--text-muted)"
                      }}
                    >
                      {st === "Resolved" && "🎉 "}
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Intervention Title
                  </label>
                  <input
                    type="text"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    style={{
                      width: "100%",
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "6px",
                      padding: "0.55rem",
                      fontSize: "0.82rem",
                      color: "var(--text-main)",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Support Strategy / Method
                  </label>
                  <input
                    type="text"
                    value={planStrategy}
                    onChange={(e) => setPlanStrategy(e.target.value)}
                    style={{
                      width: "100%",
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "6px",
                      padding: "0.55rem",
                      fontSize: "0.82rem",
                      color: "var(--text-main)",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Assigned Educators / Support Staff
                  </label>
                  <input
                    type="text"
                    value={planAssigned}
                    onChange={(e) => setPlanAssigned(e.target.value)}
                    style={{
                      width: "100%",
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "6px",
                      padding: "0.55rem",
                      fontSize: "0.82rem",
                      color: "var(--text-main)",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Measurable Success Milestone
                  </label>
                  <input
                    type="text"
                    value={planGoal}
                    onChange={(e) => setPlanGoal(e.target.value)}
                    style={{
                      width: "100%",
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "6px",
                      padding: "0.55rem",
                      fontSize: "0.82rem",
                      color: "var(--text-main)",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Intervention Case Notes & Meeting Log
                </label>
                <textarea
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  rows={3}
                  placeholder="Record parent check-ins, student commitments, progress check dates..."
                  style={{
                    width: "100%",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "6px",
                    padding: "0.6rem",
                    fontSize: "0.82rem",
                    color: "var(--text-main)",
                    outline: "none",
                    resize: "vertical"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  Last updated: {student.interventionPlan?.createdDate || "Today"}
                </span>

                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button
                    onClick={() => handleSaveIntervention("Resolved")}
                    className="btn-secondary"
                    style={{
                      borderColor: "#10b981",
                      color: "#34d399",
                      fontSize: "0.8rem",
                      background: "rgba(16, 185, 129, 0.1)"
                    }}
                  >
                    <Sparkles size={14} />
                    <span>Mark Recovered & Celebrate 🎉</span>
                  </button>

                  <button
                    onClick={() => handleSaveIntervention()}
                    className="btn-primary"
                    style={{ fontSize: "0.8rem" }}
                  >
                    <CheckCircle2 size={15} />
                    <span>Save Plan Changes</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
