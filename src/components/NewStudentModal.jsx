import React, { useState } from "react";
import { X, UserPlus, Sparkles, CheckCircle2 } from "lucide-react";

export default function NewStudentModal({ onAddStudent, onClose }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("10th Grade");
  const [homeroom, setHomeroom] = useState("Room 204 - Mr. Harrison");
  const [attendanceRate, setAttendanceRate] = useState(80);
  const [currentAverage, setCurrentAverage] = useState(65);
  const [recentDrop, setRecentDrop] = useState(-10);
  const [missingAssignments, setMissingAssignments] = useState(3);
  const [submissionTimeliness, setSubmissionTimeliness] = useState(70);
  const [participationScore, setParticipationScore] = useState(55);
  const [teacherNote, setTeacherNote] = useState("");
  const [teacherSentiment, setTeacherSentiment] = useState("Concern");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    const colors = ["#0284c7", "#0ea5e9", "#0369a1", "#059669", "#d97706"];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const newStudent = {
      id: newId,
      name: name.trim(),
      grade,
      homeroom,
      avatarColor,
      attendance: {
        overallRate: Number(attendanceRate),
        consecutiveAbsences: Number(attendanceRate) < 75 ? 2 : 0,
        unexcusedCount: Number(attendanceRate) < 75 ? 3 : 1,
        trend: [
          Math.min(100, Number(attendanceRate) + 8),
          Math.min(100, Number(attendanceRate) + 5),
          Number(attendanceRate),
          Number(attendanceRate) - 2,
          Number(attendanceRate) - 4,
          Number(attendanceRate)
        ]
      },
      academics: {
        gpa: Math.max(1.0, (Number(currentAverage) / 100) * 4).toFixed(2),
        currentAverage: Number(currentAverage),
        trend: [
          Math.min(100, Number(currentAverage) + 12),
          Math.min(100, Number(currentAverage) + 8),
          Number(currentAverage) + 4,
          Number(currentAverage) - 2,
          Number(currentAverage) - 6,
          Number(currentAverage)
        ],
        recentDrop: Number(recentDrop),
        failedAssessments: Number(currentAverage) < 65 ? 2 : 0,
        subjects: [
          { name: "Mathematics", grade: Number(currentAverage) - 5, status: Number(currentAverage) - 5 < 60 ? "Critical" : "Warning" },
          { name: "Science", grade: Number(currentAverage), status: Number(currentAverage) < 65 ? "Warning" : "Satisfactory" },
          { name: "Language Arts", grade: Number(currentAverage) + 5, status: "Satisfactory" },
          { name: "Social Studies", grade: Number(currentAverage) + 8, status: "Satisfactory" }
        ]
      },
      learningProgress: {
        missingAssignments: Number(missingAssignments),
        submissionTimeliness: Number(submissionTimeliness),
        lmsWeeklyHours: 2.5,
        videoCompletionRate: 60
      },
      participation: {
        score: Number(participationScore),
        classEngagement: Number(participationScore) > 70 ? "High" : Number(participationScore) > 45 ? "Moderate" : "Low",
        peerCollaboration: "Standard",
        questionsAsked: 2
      },
      teacherNotes: teacherNote.trim() ? [
        {
          id: `TN-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          teacher: "Educator Intake Observation",
          sentiment: teacherSentiment,
          tag: "Intake Note",
          text: teacherNote.trim()
        }
      ] : [],
      interventionPlan: {
        status: "None",
        title: "",
        strategy: "",
        assignedTo: "",
        createdDate: "",
        targetGoal: "",
        notes: ""
      }
    };

    onAddStudent(newStudent);
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
        maxWidth: "640px",
        maxHeight: "92vh",
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
            <UserPlus size={20} color="var(--primary)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
              Add New Student to Monitoring Cohort
            </h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ width: "32px", height: "32px" }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            
            {/* Name */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Full Student Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            {/* Grade */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Grade Level
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "6px",
                  padding: "0.55rem",
                  fontSize: "0.82rem",
                  color: "var(--text-main)"
                }}
              >
                <option value="9th Grade">9th Grade</option>
                <option value="10th Grade">10th Grade</option>
                <option value="11th Grade">11th Grade</option>
                <option value="12th Grade">12th Grade</option>
              </select>
            </div>

            {/* Homeroom */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Homeroom / Advisory
              </label>
              <input
                type="text"
                value={homeroom}
                onChange={(e) => setHomeroom(e.target.value)}
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

            {/* Attendance Rate */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Overall Attendance Rate: {attendanceRate}%
              </label>
              <input
                type="range"
                min="40"
                max="100"
                value={attendanceRate}
                onChange={(e) => setAttendanceRate(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Course Average */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Academic Average: {currentAverage}%
              </label>
              <input
                type="range"
                min="30"
                max="100"
                value={currentAverage}
                onChange={(e) => setCurrentAverage(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Recent Grade Drop */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                3-Week Trajectory Delta: {recentDrop}%
              </label>
              <input
                type="range"
                min="-30"
                max="15"
                value={recentDrop}
                onChange={(e) => setRecentDrop(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Missing Assignments */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Missing Assignments Count: {missingAssignments}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={missingAssignments}
                onChange={(e) => setMissingAssignments(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Participation Score */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Classroom Engagement: {participationScore}/100
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={participationScore}
                onChange={(e) => setParticipationScore(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

          </div>

          {/* Teacher Observation Note */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)" }}>
                Initial Qualitative Teacher Observation (Optional)
              </label>
              <select
                value={teacherSentiment}
                onChange={(e) => setTeacherSentiment(e.target.value)}
                style={{
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "4px",
                  padding: "0.2rem 0.5rem",
                  fontSize: "0.72rem"
                }}
              >
                <option value="Concern">Concern</option>
                <option value="Urgent">Urgent Alert</option>
                <option value="Neutral">Neutral</option>
                <option value="Positive">Positive</option>
              </select>
            </div>
            <textarea
              placeholder="e.g. Student shows great enthusiasm in group discussions but struggles with independent algebra assessments..."
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              rows={2}
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

          {/* Footer inside form */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ fontSize: "0.8rem" }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ fontSize: "0.8rem" }}>
              <CheckCircle2 size={15} />
              <span>Register Student & Run AI Risk Check</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
