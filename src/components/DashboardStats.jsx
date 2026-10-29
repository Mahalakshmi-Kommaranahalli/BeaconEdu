import React from "react";
import { 
  Users, 
  AlertTriangle, 
  TrendingDown, 
  ClipboardCheck, 
  Sparkles, 
  CalendarCheck2 
} from "lucide-react";

export default function DashboardStats({ students, risks, selectedFilter, onSelectFilter }) {
  const total = students.length;

  let highCount = 0;
  let modCount = 0;
  let lowCount = 0;
  let activeInterventions = 0;
  let recoveredCount = 0;
  let totalAttendance = 0;

  students.forEach((s) => {
    const r = risks[s.id];
    if (r) {
      if (r.riskTier === "High Risk") highCount++;
      else if (r.riskTier === "Moderate Risk") modCount++;
      else lowCount++;
    }

    if (s.interventionPlan && s.interventionPlan.status === "In Progress") {
      activeInterventions++;
    } else if (s.interventionPlan && s.interventionPlan.status === "Resolved") {
      recoveredCount++;
    }

    totalAttendance += s.attendance.overallRate;
  });

  const avgAttendance = total > 0 ? Math.round(totalAttendance / total) : 0;

  const stats = [
    {
      id: "all",
      label: "Cohort Population",
      value: total,
      subtext: "Active learners enrolled",
      icon: Users,
      color: "#0284c7",
      bg: "#f0f9ff",
      border: "#bae6fd",
      filterKey: "ALL"
    },
    {
      id: "high",
      label: "Urgent Priority",
      value: highCount,
      subtext: "Multi-factor risk >= 68%",
      icon: AlertTriangle,
      color: "#dc2626",
      bg: "#fef2f2",
      border: "#fca5a5",
      badge: "Action Needed",
      filterKey: "High Risk"
    },
    {
      id: "moderate",
      label: "Early Watchlist",
      value: modCount,
      subtext: "Emerging risk signals 38-67%",
      icon: TrendingDown,
      color: "#d97706",
      bg: "#fffbeb",
      border: "#fcd34d",
      badge: "Monitor",
      filterKey: "Moderate Risk"
    },
    {
      id: "interventions",
      label: "Active Interventions",
      value: activeInterventions,
      subtext: "Human-approved support plans",
      icon: ClipboardCheck,
      color: "#0284c7",
      bg: "#e0f2fe",
      border: "#7dd3fc",
      filterKey: "INTERVENTIONS"
    },
    {
      id: "recovered",
      label: "Student Recoveries",
      value: recoveredCount,
      subtext: "Successfully back on track",
      icon: Sparkles,
      color: "#059669",
      bg: "#ecfdf5",
      border: "#6ee7b7",
      badge: "Success",
      filterKey: "RECOVERED"
    },
    {
      id: "attendance",
      label: "Cohort Attendance",
      value: `${avgAttendance}%`,
      subtext: avgAttendance >= 85 ? "Healthy overall baseline" : "Below district target (85%)",
      icon: CalendarCheck2,
      color: avgAttendance >= 85 ? "#059669" : "#d97706",
      bg: avgAttendance >= 85 ? "#ecfdf5" : "#fffbeb",
      border: avgAttendance >= 85 ? "#6ee7b7" : "#fcd34d",
      filterKey: "ATTENDANCE_FLAG"
    }
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
      gap: "1rem",
      margin: "1.5rem 0"
    }}>
      {stats.map((s) => {
        const Icon = s.icon;
        const isSelected = selectedFilter === s.filterKey;

        return (
          <div
            key={s.id}
            onClick={() => onSelectFilter(s.filterKey)}
            className="glass-card"
            style={{
              cursor: "pointer",
              border: isSelected ? `2px solid ${s.color}` : "1px solid var(--border-subtle)",
              background: isSelected ? s.bg : "var(--bg-surface)",
              boxShadow: isSelected ? `0 0 16px ${s.border}` : "var(--shadow-sm)",
              padding: "1rem 1.15rem",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: s.bg,
                border: `1px solid ${s.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: s.color
              }}>
                <Icon size={20} />
              </div>
              {s.badge && (
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "9999px",
                  background: s.bg,
                  color: s.color,
                  border: `1px solid ${s.border}`
                }}>
                  {s.badge}
                </span>
              )}
            </div>

            <div style={{ marginTop: "0.85rem" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-main)", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-main)", marginTop: "0.35rem" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                {s.subtext}
              </div>
            </div>

            {/* Subtle bottom indicator line */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: s.color,
              opacity: isSelected ? 1 : 0.4
            }} />
          </div>
        );
      })}
    </div>
  );
}
