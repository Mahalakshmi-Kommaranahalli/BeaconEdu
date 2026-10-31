import React, { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import { 
  Compass, 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Sun, 
  Moon, 
  LogOut, 
  MessageSquare, 
  Sliders, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  FileText,
  UserCheck,
  ChevronRight,
  Award,
  Zap,
  Target
} from "lucide-react";
import { calculateStudentRisk, simulateRiskProjection } from "../utils/riskEngine";

export default function StudentPortal({
  currentUser,
  students,
  weights,
  theme,
  toggleTheme,
  onLogout,
  onUpdateStudent
}) {
  // Find the exact student record matching this logged-in student
  const student = useMemo(() => {
    const sId = currentUser?.studentId || currentUser?.id;
    return students.find((s) => s.id === sId) || students[0];
  }, [students, currentUser]);

  // Calculate live explainable risk for this specific student
  const risk = useMemo(() => {
    return calculateStudentRisk(student, weights);
  }, [student, weights]);

  // Tab navigation inside Student Portal
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "courses" | "intervention" | "simulator"

  // Simulator adjustments state
  const [simAdjustments, setSimAdjustments] = useState({
    attendanceBoost: 10,
    missingAssignmentsResolved: Math.min(student.learningProgress?.missingAssignments || 0, 2),
    gradeGain: 8,
    participationBoost: 10
  });

  // Student reflection note state
  const [reflectionText, setReflectionText] = useState("");
  const [advisorMessage, setAdvisorMessage] = useState("");
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // Student milestone checklist state (stored locally or in student notes)
  const [completedMilestones, setCompletedMilestones] = useState(() => {
    const saved = localStorage.getItem(`beaconedu_milestones_${student.id}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Calculate projected outcome for What-If simulator
  const projection = useMemo(() => {
    return simulateRiskProjection(student, simAdjustments, weights);
  }, [student, simAdjustments, weights]);

  const toggleMilestone = (key) => {
    const next = { ...completedMilestones, [key]: !completedMilestones[key] };
    setCompletedMilestones(next);
    localStorage.setItem(`beaconedu_milestones_${student.id}`, JSON.stringify(next));

    // Celebrate if completing
    if (!completedMilestones[key]) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleSendReflection = (e) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    const newNote = {
      id: `SN-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      teacher: `Student (${student.name})`,
      sentiment: "Positive",
      tag: "Student Reflection",
      text: reflectionText.trim()
    };

    const updatedStudent = {
      ...student,
      teacherNotes: [newNote, ...(student.teacherNotes || [])]
    };

    onUpdateStudent(updatedStudent);
    setReflectionText("");
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  const handleSendAdvisorMessage = (e) => {
    e.preventDefault();
    if (!advisorMessage.trim()) return;

    const newNote = {
      id: `SN-MSG-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      teacher: `Student Request to ${student.interventionPlan?.assignedTo || "Advisor"}`,
      sentiment: "Concern",
      tag: "1-on-1 Help Request",
      text: advisorMessage.trim()
    };

    const updatedStudent = {
      ...student,
      teacherNotes: [newNote, ...(student.teacherNotes || [])]
    };

    onUpdateStudent(updatedStudent);
    setAdvisorMessage("");
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setShowAdvisorModal(false);
    }, 1800);
  };

  // Determine status color and label
  const isHighRisk = risk.riskTier === "High Risk";
  const isModerateRisk = risk.riskTier === "Moderate Risk";
  const statusColor = isHighRisk ? "#dc2626" : isModerateRisk ? "#d97706" : "#059669";
  const statusBg = isHighRisk ? "#fef2f2" : isModerateRisk ? "#fffbeb" : "#ecfdf5";
  const statusBorder = isHighRisk ? "#fca5a5" : isModerateRisk ? "#fcd34d" : "#6ee7b7";
  const statusText = isHighRisk ? "Action Recommended" : isModerateRisk ? "Moderate Attention" : "Good Standing / On Track";

  // Predefined default milestones based on student data
  const defaultMilestones = [
    { key: "m1", title: `Review target materials for ${student.academics.subjects[0]?.name || "Core Subjects"}`, tag: "Academics" },
    { key: "m2", title: "Maintain 100% attendance in upcoming lab and lecture sessions", tag: "Attendance" },
    { key: "m3", title: `Complete and submit ${student.learningProgress.missingAssignments > 0 ? student.learningProgress.missingAssignments : 1} pending coursework module`, tag: "Submission" },
    { key: "m4", title: "Participate at least once during in-class discussions", tag: "Engagement" }
  ];

  const completedCount = defaultMilestones.filter((m) => completedMilestones[m.key]).length;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      
      {/* ============================================================ */}
      {/* STUDENT PORTAL NAVBAR */}
      {/* ============================================================ */}
      <header className="glass-panel" style={{
        margin: "1rem 2rem 0",
        padding: "0.85rem 1.5rem",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(2, 132, 199, 0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          
          {/* Brand & Student Portal Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.28)"
            }}>
              <GraduationCap size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <h1 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.02em" }}>
                  BeaconEdu
                </h1>
                <span style={{
                  background: "#e0f2fe",
                  color: "#0369a1",
                  border: "1px solid #bae6fd",
                  fontSize: "0.68rem",
                  padding: "0.15rem 0.55rem",
                  borderRadius: "9999px",
                  fontWeight: "700"
                }}>
                  🎓 Student Academic Portal
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
                Personal Performance Insights & Growth Advisory • Confidential Record
              </p>
            </div>
          </div>

          {/* Student Tabs */}
          <nav style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            background: "#f0f9ff",
            padding: "0.3rem",
            borderRadius: "8px",
            border: "1px solid #bae6fd"
          }}>
            {[
              { id: "overview", label: "Overview & Health", icon: Sparkles },
              { id: "courses", label: "My Courses & Grades", icon: BookOpen },
              { id: "intervention", label: "Support & Goals", icon: Target },
              { id: "simulator", label: "What-If Simulator", icon: Sliders }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    background: isActive ? "#0284c7" : "transparent",
                    color: isActive ? "#ffffff" : "#475569",
                    boxShadow: isActive ? "0 2px 6px rgba(2, 132, 199, 0.25)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    transition: "all 0.18s"
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            
            {/* Reach Out / Message Advisor */}
            <button
              onClick={() => setShowAdvisorModal(true)}
              className="btn-primary"
              style={{
                fontSize: "0.78rem",
                padding: "0.45rem 0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <MessageSquare size={14} />
              <span>Contact Advisor</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost"
              title="Toggle Light / Dark mode"
              style={{ width: "36px", height: "36px" }}
            >
              {theme === "dark" ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#0284c7" />}
            </button>

            {/* Student Account Badge & Logout */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              paddingLeft: "0.75rem",
              borderLeft: "1px solid #e2e8f0"
            }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: student.avatarColor || "#0284c7",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "0.8rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
              }}>
                {student.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#0f172a", lineHeight: 1.1 }}>
                  {student.name}
                </div>
                <div style={{ fontSize: "0.68rem", color: "#0284c7", fontWeight: "600" }}>
                  {student.id} • {student.branch} ({student.section})
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Sign out of student account"
                className="btn-ghost"
                style={{ width: "34px", height: "34px", color: "#64748b" }}
              >
                <LogOut size={16} />
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* ============================================================ */}
      {/* MAIN STUDENT CONTENT */}
      {/* ============================================================ */}
      <main className="container" style={{ flex: 1, padding: "1.5rem 2rem 3rem" }}>
        
        {/* Student Welcome Header Card */}
        <div style={{
          background: "linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #075985 100%)",
          borderRadius: "12px",
          padding: "1.5rem 1.85rem",
          color: "#ffffff",
          marginBottom: "1.5rem",
          boxShadow: "0 8px 24px rgba(2, 132, 199, 0.16)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Subtle geometric background circle */}
          <div style={{
            position: "absolute",
            top: "-40%",
            right: "-5%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
              <span style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(4px)",
                padding: "0.2rem 0.6rem",
                borderRadius: "4px",
                fontSize: "0.72rem",
                fontWeight: "700",
                letterSpacing: "0.03em"
              }}>
                STUDENT RECORD #{student.id}
              </span>
              <span style={{ fontSize: "0.75rem", color: "#bae6fd" }}>
                Dept. of {student.branch} • {student.section}
              </span>
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.02em" }}>
              Welcome back, {student.name}!
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#e0f2fe", maxWidth: "620px", marginTop: "0.35rem", lineHeight: 1.4 }}>
              This portal reflects your private academic progress, multi-factor trajectory, and support interventions. Our platform is 100% non-punitive and designed to empower your success.
            </p>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            padding: "0.85rem 1.25rem",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#bae6fd", textTransform: "uppercase", fontWeight: "700" }}>
                Current Status
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "#ffffff", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.15rem" }}>
                <span style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: isHighRisk ? "#f87171" : isModerateRisk ? "#fbbf24" : "#34d399"
                }} />
                {statusText}
              </div>
            </div>
            <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.2)" }} />
            <div>
              <div style={{ fontSize: "0.7rem", color: "#bae6fd", textTransform: "uppercase", fontWeight: "700" }}>
                Risk Index
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: "900", color: "#ffffff" }}>
                {risk.compositeScore} <span style={{ fontSize: "0.75rem", fontWeight: "500", opacity: 0.8 }}>/ 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW & HEALTH */}
        {/* ============================================================ */}
        {activeTab === "overview" && (
          <div>
            {/* 4 Core Indicators Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem"
            }}>
              
              {/* Card 1: Attendance */}
              <div className="glass-card" style={{ borderTop: `4px solid ${student.attendance.overallRate < 80 ? "#dc2626" : "#0284c7"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                    Attendance Regularity
                  </span>
                  <Calendar size={18} color="#0284c7" />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "1.85rem", fontWeight: "800", color: "#0f172a" }}>
                    {student.attendance.overallRate}%
                  </span>
                  <span style={{ fontSize: "0.75rem", color: student.attendance.overallRate >= 85 ? "#059669" : "#dc2626", fontWeight: "600" }}>
                    Target: 85%+
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.75rem" }}>
                  Consecutive Absences: <strong>{student.attendance.consecutiveAbsences || 0}</strong> • Unexcused: <strong>{student.attendance.unexcusedCount || 0}</strong>
                </div>
                {/* 6-Week Trajectory Bars */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "34px", background: "#f8fafc", padding: "4px 6px", borderRadius: "6px" }}>
                  {student.attendance.trend?.map((rate, i) => (
                    <div
                      key={i}
                      title={`Week ${i + 1}: ${rate}% attendance`}
                      style={{
                        flex: 1,
                        height: `${Math.max(15, (rate / 100) * 100)}%`,
                        background: rate < 75 ? "#f87171" : rate < 85 ? "#fbbf24" : "#38bdf8",
                        borderRadius: "2px",
                        transition: "height 0.3s ease"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Card 2: Academic Performance */}
              <div className="glass-card" style={{ borderTop: `4px solid ${student.academics.currentAverage < 60 ? "#dc2626" : "#0284c7"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                    Academic Average & GPA
                  </span>
                  <BookOpen size={18} color="#0284c7" />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "1.85rem", fontWeight: "800", color: "#0f172a" }}>
                    {student.academics.currentAverage}%
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#0284c7", fontWeight: "700" }}>
                    GPA {student.academics.gpa}
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.75rem" }}>
                  Recent trajectory: <strong style={{ color: student.academics.recentDrop < 0 ? "#dc2626" : "#059669" }}>
                    {student.academics.recentDrop > 0 ? `+${student.academics.recentDrop}%` : `${student.academics.recentDrop}%`}
                  </strong> • Failed: <strong>{student.academics.failedAssessments || 0}</strong>
                </div>
                {/* Academic trend bars */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "34px", background: "#f8fafc", padding: "4px 6px", borderRadius: "6px" }}>
                  {student.academics.trend?.map((score, i) => (
                    <div
                      key={i}
                      title={`Assessment ${i + 1}: ${score}%`}
                      style={{
                        flex: 1,
                        height: `${Math.max(15, (score / 100) * 100)}%`,
                        background: score < 60 ? "#f87171" : score < 75 ? "#fbbf24" : "#0284c7",
                        borderRadius: "2px"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Card 3: Learning Timeliness & LMS */}
              <div className="glass-card" style={{ borderTop: `4px solid ${student.learningProgress.missingAssignments > 1 ? "#dc2626" : "#0284c7"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                    Submission & Timeliness
                  </span>
                  <Clock size={18} color="#0284c7" />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "1.85rem", fontWeight: "800", color: student.learningProgress.missingAssignments > 0 ? "#dc2626" : "#0f172a" }}>
                    {student.learningProgress.missingAssignments}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>
                    Missing Assignments
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.75rem" }}>
                  Timeliness: <strong>{student.learningProgress.submissionTimeliness}%</strong> • LMS Study: <strong>{student.learningProgress.lmsWeeklyHours} hrs/wk</strong>
                </div>
                {/* Progress bar */}
                <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden", marginTop: "1rem" }}>
                  <div style={{
                    width: `${student.learningProgress.submissionTimeliness}%`,
                    height: "100%",
                    background: student.learningProgress.submissionTimeliness < 70 ? "#f87171" : "#0284c7",
                    borderRadius: "9999px"
                  }} />
                </div>
              </div>

              {/* Card 4: Participation */}
              <div className="glass-card" style={{ borderTop: "4px solid #0284c7" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                    Classroom Engagement
                  </span>
                  <Zap size={18} color="#0284c7" />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "1.85rem", fontWeight: "800", color: "#0f172a" }}>
                    {student.participation.score}%
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#0284c7", fontWeight: "600" }}>
                    {student.participation.classEngagement} Activity
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.75rem" }}>
                  Collaboration: <strong>{student.participation.peerCollaboration}</strong> • Questions: <strong>{student.participation.questionsAsked}</strong>
                </div>
                {/* Engagement gauge bar */}
                <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden", marginTop: "1rem" }}>
                  <div style={{
                    width: `${student.participation.score}%`,
                    height: "100%",
                    background: student.participation.score < 60 ? "#fbbf24" : "#10b981",
                    borderRadius: "9999px"
                  }} />
                </div>
              </div>

            </div>

            {/* Middle Section: Explainable Diagnostic Drivers & Protective Factors */}
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
              
              {/* Left: What Needs Attention & Strengths */}
              <div className="glass-panel" style={{ padding: "1.25rem", background: "#ffffff" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Sparkles size={18} color="#0284c7" />
                  <span>Explainable Diagnostics: What Affects Your Standing</span>
                </h3>

                {/* Primary Drivers / Growth Areas */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#991b1b", textTransform: "uppercase", marginBottom: "0.45rem", letterSpacing: "0.03em" }}>
                    ⚠️ Primary Attention Signals ({risk.drivers.length})
                  </div>
                  {risk.drivers.length === 0 ? (
                    <div style={{ fontSize: "0.8rem", color: "#059669", background: "#ecfdf5", padding: "0.6rem 0.85rem", borderRadius: "6px" }}>
                      ✨ Excellent work! No critical risk flags detected across attendance or grades.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                      {risk.drivers.map((driver, idx) => (
                        <div key={idx} style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.5rem",
                          padding: "0.55rem 0.75rem",
                          background: "#fef2f2",
                          border: "1px solid #fee2e2",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          color: "#991b1b"
                        }}>
                          <AlertTriangle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: "2px" }} />
                          <div>{driver}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Protective Factors / Strengths */}
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#065f46", textTransform: "uppercase", marginBottom: "0.45rem", letterSpacing: "0.03em" }}>
                    🛡️ Your Protective Strengths & Assets ({risk.protectiveFactors?.length || 0})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {(risk.protectiveFactors || ["Active platform learner", "Good class participation baseline"]).map((fac, idx) => (
                      <div key={idx} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        background: "#ecfdf5",
                        border: "1px solid #d1fae5",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        color: "#065f46"
                      }}>
                        <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0 }} />
                        <div>{fac}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right: Active Support & Mentorship Summary */}
              <div className="glass-panel" style={{ padding: "1.25rem", background: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Target size={18} color="#0284c7" />
                      <span>Active Advisory Support</span>
                    </h3>
                    <span style={{
                      background: "#e0f2fe",
                      color: "#0369a1",
                      border: "1px solid #bae6fd",
                      fontSize: "0.7rem",
                      padding: "0.15rem 0.55rem",
                      borderRadius: "9999px",
                      fontWeight: "700"
                    }}>
                      {student.interventionPlan?.status || "Active Plan"}
                    </span>
                  </div>

                  <div style={{
                    background: "#f0f9ff",
                    border: "1px solid #bae6fd",
                    borderRadius: "8px",
                    padding: "0.85rem",
                    marginBottom: "1rem"
                  }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#0369a1", textTransform: "uppercase" }}>
                      Plan Strategy
                    </div>
                    <div style={{ fontSize: "0.88rem", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>
                      {student.interventionPlan?.title || "Course Remediation & Guidance"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#475569", marginTop: "0.35rem" }}>
                      🎯 <strong>Target Goal:</strong> {student.interventionPlan?.targetGoal || "Raise attendance above 85% and resolve pending submissions"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.35rem" }}>
                      👤 <strong>Assigned Mentor:</strong> {student.interventionPlan?.assignedTo || "Department Advisory Faculty"}
                    </div>
                  </div>

                  {/* Milestone checklist preview */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "700", color: "#475569", marginBottom: "0.35rem" }}>
                      <span>Student Milestones</span>
                      <span>{completedCount} of {defaultMilestones.length} Completed</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden", marginBottom: "0.75rem" }}>
                      <div style={{
                        width: `${(completedCount / defaultMilestones.length) * 100}%`,
                        height: "100%",
                        background: "#0284c7",
                        borderRadius: "9999px",
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                  <button
                    onClick={() => setActiveTab("intervention")}
                    className="btn-secondary"
                    style={{ flex: 1, fontSize: "0.8rem", padding: "0.5rem", justifyContent: "center" }}
                  >
                    View All Goals
                  </button>
                  <button
                    onClick={() => setShowAdvisorModal(true)}
                    className="btn-primary"
                    style={{ flex: 1, fontSize: "0.8rem", padding: "0.5rem", justifyContent: "center" }}
                  >
                    Message Advisor
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: MY COURSES & GRADES */}
        {/* ============================================================ */}
        {activeTab === "courses" && (
          <div className="glass-panel" style={{ padding: "1.5rem", background: "#ffffff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a" }}>
                  Enrolled Courses & Academic Trajectory
                </h3>
                <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "2px" }}>
                  Direct breakdown of subjects, current marks, and required recovery thresholds.
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <span style={{ fontSize: "0.75rem", background: "#f0f9ff", border: "1px solid #bae6fd", padding: "0.3rem 0.65rem", borderRadius: "6px", color: "#0369a1", fontWeight: "700" }}>
                  Branch: {student.branch}
                </span>
                <span style={{ fontSize: "0.75rem", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "0.3rem 0.65rem", borderRadius: "6px", color: "#334155", fontWeight: "700" }}>
                  Section: {student.section}
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
              {student.academics.subjects?.map((sub, idx) => {
                const isCritical = sub.status === "Critical" || sub.grade < 60;
                const isWarning = sub.status === "Warning" || (sub.grade >= 60 && sub.grade < 75);
                const tagColor = isCritical ? "#dc2626" : isWarning ? "#d97706" : "#059669";
                const tagBg = isCritical ? "#fef2f2" : isWarning ? "#fffbeb" : "#ecfdf5";
                const tagBorder = isCritical ? "#fca5a5" : isWarning ? "#fcd34d" : "#6ee7b7";

                return (
                  <div
                    key={idx}
                    style={{
                      border: `1px solid ${isCritical ? "#fca5a5" : "#e2e8f0"}`,
                      borderRadius: "10px",
                      padding: "1.1rem",
                      background: isCritical ? "#fffdfd" : "#ffffff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
                          {sub.name}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>
                          Semester Evaluation Course
                        </div>
                      </div>
                      <span style={{
                        background: tagBg,
                        color: tagColor,
                        border: `1px solid ${tagBorder}`,
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.55rem",
                        borderRadius: "9999px",
                        fontWeight: "700"
                      }}>
                        {sub.status || (isCritical ? "Critical" : isWarning ? "Warning" : "Satisfactory")}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "1.65rem", fontWeight: "900", color: tagColor }}>
                        {sub.grade}%
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        Passing Threshold: 50%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden", marginBottom: "0.75rem" }}>
                      <div style={{
                        width: `${Math.min(100, sub.grade)}%`,
                        height: "100%",
                        background: tagColor,
                        borderRadius: "9999px",
                        transition: "width 0.4s ease"
                      }} />
                    </div>

                    <div style={{ fontSize: "0.76rem", color: "#475569", lineHeight: 1.35 }}>
                      {isCritical ? (
                        <span>⚠️ <strong>Recommendation:</strong> Complete pending lab recursion tasks and review with course teaching assistant.</span>
                      ) : isWarning ? (
                        <span>💡 <strong>Recommendation:</strong> Consolidate midpoint notes before upcoming summative assessments.</span>
                      ) : (
                        <span>✅ <strong>On Track:</strong> Strong understanding demonstrated in assignments.</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: SUPPORT & GOALS */}
        {/* ============================================================ */}
        {activeTab === "intervention" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.25rem" }}>
            
            {/* Left: Interactive Milestones Checklist */}
            <div className="glass-panel" style={{ padding: "1.5rem", background: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <CheckCircle2 size={18} color="#0284c7" />
                    <span>My Action Milestones</span>
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "#64748b" }}>
                    Tick off tasks as you complete them to track your recovery velocity.
                  </p>
                </div>
                <span style={{
                  background: "#e0f2fe",
                  color: "#0369a1",
                  border: "1px solid #bae6fd",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  fontSize: "0.74rem",
                  fontWeight: "700"
                }}>
                  {completedCount} / {defaultMilestones.length} Done
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {defaultMilestones.map((m) => {
                  const isDone = !!completedMilestones[m.key];
                  return (
                    <div
                      key={m.key}
                      onClick={() => toggleMilestone(m.key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.85rem 1rem",
                        borderRadius: "8px",
                        border: `1px solid ${isDone ? "#6ee7b7" : "#e2e8f0"}`,
                        background: isDone ? "#ecfdf5" : "#f8fafc",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => {}}
                        style={{ cursor: "pointer", width: "16px", height: "16px", accentColor: "#059669" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: "0.84rem",
                          fontWeight: "700",
                          color: isDone ? "#047857" : "#1e293b",
                          textDecoration: isDone ? "line-through" : "none"
                        }}>
                          {m.title}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: isDone ? "#059669" : "#64748b" }}>
                          Category: {m.tag}
                        </div>
                      </div>
                      {isDone && <Award size={16} color="#059669" />}
                    </div>
                  );
                })}
              </div>

              {/* Student Self-Reflection Box */}
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem" }}>
                <h4 style={{ fontSize: "0.92rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.4rem" }}>
                  Submit Progress Reflection to Mentor
                </h4>
                <p style={{ fontSize: "0.76rem", color: "#64748b", marginBottom: "0.65rem" }}>
                  Have you completed a pending assignment or clarified a doubt? Let your mentor know.
                </p>
                <form onSubmit={handleSendReflection}>
                  <textarea
                    rows={3}
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="e.g. I submitted my DSA assignment on the portal and attended today's tutorial session..."
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.82rem",
                      outline: "none",
                      resize: "none",
                      marginBottom: "0.6rem"
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={!reflectionText.trim()}
                    style={{ fontSize: "0.78rem", padding: "0.45rem 0.85rem", display: "flex", alignItems: "center", gap: "0.35rem" }}
                  >
                    <Send size={13} />
                    <span>Post Student Note</span>
                  </button>
                </form>
              </div>

            </div>

            {/* Right: Advisor Notes & History */}
            <div className="glass-panel" style={{ padding: "1.5rem", background: "#ffffff" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <MessageSquare size={18} color="#0284c7" />
                <span>Advisor & Teacher Feedback</span>
              </h3>
              <p style={{ fontSize: "0.76rem", color: "#64748b", marginBottom: "1rem" }}>
                Official advisory feedback logged by department faculty.
              </p>

              {(!student.teacherNotes || student.teacherNotes.length === 0) ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "#64748b", fontSize: "0.82rem", background: "#f8fafc", borderRadius: "8px" }}>
                  No feedback notes logged yet.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "420px", overflowY: "auto" }}>
                  {student.teacherNotes.map((note) => {
                    const isStudentNote = note.teacher?.includes("Student");
                    return (
                      <div
                        key={note.id}
                        style={{
                          padding: "0.85rem 1rem",
                          borderRadius: "8px",
                          border: `1px solid ${isStudentNote ? "#bae6fd" : "#e2e8f0"}`,
                          background: isStudentNote ? "#f0f9ff" : "#f8fafc"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: "800", color: isStudentNote ? "#0369a1" : "#0f172a" }}>
                            {note.teacher}
                          </span>
                          <span style={{ fontSize: "0.68rem", color: "#64748b" }}>
                            {note.date}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "#334155", lineHeight: 1.4 }}>
                          {note.text}
                        </p>
                        {note.tag && (
                          <span style={{
                            display: "inline-block",
                            marginTop: "0.45rem",
                            fontSize: "0.65rem",
                            padding: "0.1rem 0.45rem",
                            borderRadius: "4px",
                            background: isStudentNote ? "#e0f2fe" : "#e2e8f0",
                            color: isStudentNote ? "#0284c7" : "#475569",
                            fontWeight: "700"
                          }}>
                            {note.tag}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: WHAT-IF SIMULATOR */}
        {/* ============================================================ */}
        {activeTab === "simulator" && (
          <div className="glass-panel" style={{ padding: "1.5rem", background: "#ffffff" }}>
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sliders size={20} color="#0284c7" />
                <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a" }}>
                  Interactive Academic Recovery Simulator
                </h3>
              </div>
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "3px" }}>
                Simulate how specific improvements in your attendance, missing assignments, and quiz preparation directly improve your risk index and standing.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.5rem", alignItems: "center" }}>
              
              {/* Sliders Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", background: "#f8fafc", padding: "1.25rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                
                {/* Missing Assignments */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem" }}>
                    <span>Resolve Missing Assignments:</span>
                    <strong style={{ color: "#0284c7" }}>+{simAdjustments.missingAssignmentsResolved} assignments</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(1, student.learningProgress?.missingAssignments || 3)}
                    value={simAdjustments.missingAssignmentsResolved}
                    onChange={(e) => setSimAdjustments({ ...simAdjustments, missingAssignmentsResolved: parseInt(e.target.value) })}
                    style={{ width: "100%", accentColor: "#0284c7" }}
                  />
                </div>

                {/* Attendance Boost */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem" }}>
                    <span>Boost Attendance Rate:</span>
                    <strong style={{ color: "#0284c7" }}>+{simAdjustments.attendanceBoost}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="2"
                    value={simAdjustments.attendanceBoost}
                    onChange={(e) => setSimAdjustments({ ...simAdjustments, attendanceBoost: parseInt(e.target.value) })}
                    style={{ width: "100%", accentColor: "#0284c7" }}
                  />
                </div>

                {/* Grade Gain */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem" }}>
                    <span>Improve Assessment Average:</span>
                    <strong style={{ color: "#0284c7" }}>+{simAdjustments.gradeGain} pts</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={simAdjustments.gradeGain}
                    onChange={(e) => setSimAdjustments({ ...simAdjustments, gradeGain: parseInt(e.target.value) })}
                    style={{ width: "100%", accentColor: "#0284c7" }}
                  />
                </div>

                {/* Participation Boost */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem" }}>
                    <span>Active In-Class Engagement:</span>
                    <strong style={{ color: "#0284c7" }}>+{simAdjustments.participationBoost} pts</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="5"
                    value={simAdjustments.participationBoost}
                    onChange={(e) => setSimAdjustments({ ...simAdjustments, participationBoost: parseInt(e.target.value) })}
                    style={{ width: "100%", accentColor: "#0284c7" }}
                  />
                </div>

              </div>

              {/* Projected Result Gauge */}
              <div style={{
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                border: "1px solid #bae6fd",
                borderRadius: "12px",
                padding: "1.75rem",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Projected Risk Score
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.25rem", margin: "1rem 0" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase" }}>Current</div>
                    <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#475569" }}>
                      {risk.compositeScore}
                    </div>
                  </div>

                  <div style={{ fontSize: "1.5rem", color: "#0284c7", fontWeight: "800" }}>
                    ➔
                  </div>

                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#0369a1", textTransform: "uppercase", fontWeight: "700" }}>Projected</div>
                    <div style={{ fontSize: "2.5rem", fontWeight: "900", color: projection.simulatedTier === "Low Risk" ? "#059669" : "#0284c7" }}>
                      {projection.simulatedScore}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: "inline-block",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "9999px",
                  fontSize: "0.82rem",
                  fontWeight: "800",
                  background: projection.simulatedTier === "Low Risk" ? "#ecfdf5" : "#fffbeb",
                  color: projection.simulatedTier === "Low Risk" ? "#059669" : "#d97706",
                  border: `1px solid ${projection.simulatedTier === "Low Risk" ? "#6ee7b7" : "#fcd34d"}`
                }}>
                  {projection.simulatedTier}
                </div>

                <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#334155", lineHeight: 1.4 }}>
                  {projection.simulatedScore < risk.compositeScore ? (
                    <span>🎉 <strong>Great potential!</strong> You can reduce your risk score by <strong>{risk.compositeScore - projection.simulatedScore} points</strong> by completing these actions.</span>
                  ) : (
                    <span>Adjust sliders to see your projected improvements.</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* MESSAGE ADVISOR MODAL */}
      {/* ============================================================ */}
      {showAdvisorModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div className="glass-panel" style={{
            background: "#ffffff",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "480px",
            padding: "1.75rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.35rem" }}>
              Message Academic Advisor
            </h3>
            <p style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: "1rem" }}>
              Reach out to {student.interventionPlan?.assignedTo || "your advisor"} for academic mentoring or support.
            </p>

            {messageSent ? (
              <div style={{ padding: "1.5rem", textAlign: "center", background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: "8px", color: "#065f46" }}>
                <CheckCircle2 size={32} color="#059669" style={{ margin: "0 auto 0.5rem" }} />
                <div style={{ fontWeight: "800", fontSize: "0.95rem" }}>Message Sent Successfully!</div>
                <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>Your advisor will be notified during institutional hours.</div>
              </div>
            ) : (
              <form onSubmit={handleSendAdvisorMessage}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem" }}>
                    Your Inquiry or Meeting Request
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={advisorMessage}
                    onChange={(e) => setAdvisorMessage(e.target.value)}
                    placeholder="Describe what you need guidance on (e.g. course material, extension request, exam pacing)..."
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.84rem",
                      outline: "none",
                      resize: "none"
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem" }}>
                  <button
                    type="button"
                    onClick={() => setShowAdvisorModal(false)}
                    className="btn-secondary"
                    style={{ fontSize: "0.8rem", padding: "0.5rem 0.85rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ fontSize: "0.8rem", padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <Send size={14} />
                    <span>Send to Advisor</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
