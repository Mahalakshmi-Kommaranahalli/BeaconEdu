import React from "react";
import { AlertCircle, Clock, ArrowRight, UserX, BookOpen, MessageSquare } from "lucide-react";

export default function EarlyWarningFeed({ students, risks, anonymize, onSelectStudent }) {
  // Collect top 4 urgent signals from students
  const urgentAlerts = [];

  students.forEach((student) => {
    const risk = risks[student.id];
    if (!risk) return;

    // Check attendance alarm
    if (student.attendance.consecutiveAbsences >= 3 || student.attendance.overallRate < 72) {
      urgentAlerts.push({
        id: `${student.id}-att`,
        student,
        icon: UserX,
        color: "#ef4444",
        type: "Attendance Alert",
        summary: `${student.attendance.consecutiveAbsences} consecutive absences · ${student.attendance.overallRate}% overall attendance`,
        urgency: "Immediate",
      });
    }

    // Check missing assignments / homework drop
    if (student.learningProgress.missingAssignments >= 4) {
      urgentAlerts.push({
        id: `${student.id}-assign`,
        student,
        icon: BookOpen,
        color: "#f59e0b",
        type: "Progress Bottleneck",
        summary: `${student.learningProgress.missingAssignments} missing assignments · On-time rate ${student.learningProgress.submissionTimeliness}%`,
        urgency: "High",
      });
    }

    // Check recent steep grade drop
    if (student.academics.recentDrop <= -14) {
      urgentAlerts.push({
        id: `${student.id}-drop`,
        student,
        icon: AlertCircle,
        color: "#ef4444",
        type: "Grade Trajectory Drop",
        summary: `Average dropped ${Math.abs(student.academics.recentDrop)}% over last 3 assessment cycles`,
        urgency: "Immediate",
      });
    }
  });

  const displayAlerts = urgentAlerts.slice(0, 4);

  if (displayAlerts.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: "1rem 1.25rem", margin: "1rem 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#ef4444",
            display: "inline-block",
            boxShadow: "0 0 10px #ef4444"
          }} className="pulse-indicator" />
          <h3 style={{ fontSize: "0.92rem", fontWeight: "700", color: "var(--text-main)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Real-Time Early Warning Signals Detected
          </h3>
        </div>
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <Clock size={12} /> Live stream updated from classroom gradebooks & attendance logs
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
        {displayAlerts.map((alert) => {
          const Icon = alert.icon;
          const studentDisplayName = anonymize ? alert.student.id : alert.student.name;

          return (
            <div
              key={alert.id}
              onClick={() => onSelectStudent(alert.student)}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                padding: "0.65rem 0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = alert.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", overflow: "hidden" }}>
                <div style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "6px",
                  background: `rgba(${alert.color === "#ef4444" ? "239, 68, 68" : "245, 158, 11"}, 0.15)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: alert.color,
                  flexShrink: 0
                }}>
                  <Icon size={16} />
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ fontWeight: "700", fontSize: "0.82rem", color: "var(--text-main)" }}>
                      {studentDisplayName}
                    </span>
                    <span style={{
                      fontSize: "0.65rem",
                      fontWeight: "600",
                      color: alert.color,
                      textTransform: "uppercase"
                    }}>
                      • {alert.type}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                    {alert.summary}
                  </div>
                </div>
              </div>

              <div style={{ color: "var(--text-subtle)", flexShrink: 0 }}>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
