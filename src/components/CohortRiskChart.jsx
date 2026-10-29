import React from "react";
import { BarChart3, Activity, PieChart, ShieldAlert } from "lucide-react";

export default function CohortRiskChart({ students, risks }) {
  const total = students.length;
  if (total === 0) return null;

  let highCount = 0;
  let modCount = 0;
  let lowCount = 0;

  let sumAcademic = 0;
  let sumAttendance = 0;
  let sumTimeliness = 0;
  let sumParticipation = 0;
  let sumLmsHours = 0;

  students.forEach((s) => {
    const r = risks[s.id];
    if (r) {
      if (r.riskTier === "High Risk") highCount++;
      else if (r.riskTier === "Moderate Risk") modCount++;
      else lowCount++;
    }

    sumAcademic += s.academics.currentAverage;
    sumAttendance += s.attendance.overallRate;
    sumTimeliness += s.learningProgress.submissionTimeliness;
    sumParticipation += s.participation.score;
    sumLmsHours += s.learningProgress.lmsWeeklyHours;
  });

  const highPct = Math.round((highCount / total) * 100);
  const modPct = Math.round((modCount / total) * 100);
  const lowPct = Math.round((lowCount / total) * 100);

  const avgAcademic = Math.round(sumAcademic / total);
  const avgAttendance = Math.round(sumAttendance / total);
  const avgTimeliness = Math.round(sumTimeliness / total);
  const avgParticipation = Math.round(sumParticipation / total);
  const avgLmsHours = (sumLmsHours / total).toFixed(1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem", margin: "1rem 0" }}>
      
      {/* Risk Distribution Breakdown */}
      <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <PieChart size={18} color="var(--primary)" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)" }}>
                Cohort Risk Distribution
              </h3>
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {total} Total Active Students
            </span>
          </div>

          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            Real-time multi-indicator classification based on attendance, academic velocity, and engagement signals.
          </p>

          {/* Stacked Percentage Bar */}
          <div style={{
            height: "22px",
            width: "100%",
            borderRadius: "9999px",
            overflow: "hidden",
            display: "flex",
            background: "rgba(255, 255, 255, 0.05)",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)",
            marginBottom: "1rem"
          }}>
            {highCount > 0 && (
              <div
                style={{ width: `${highPct}%`, background: "linear-gradient(90deg, #ef4444, #dc2626)", height: "100%" }}
                title={`High Risk: ${highCount} (${highPct}%)`}
              />
            )}
            {modCount > 0 && (
              <div
                style={{ width: `${modPct}%`, background: "linear-gradient(90deg, #f59e0b, #d97706)", height: "100%" }}
                title={`Moderate Watchlist: ${modCount} (${modPct}%)`}
              />
            )}
            {lowCount > 0 && (
              <div
                style={{ width: `${lowPct}%`, background: "linear-gradient(90deg, #10b981, #059669)", height: "100%" }}
                title={`On Track: ${lowCount} (${lowPct}%)`}
              />
            )}
          </div>

          {/* Legend items with metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            <div style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: "8px",
              padding: "0.6rem 0.75rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
                <span style={{ fontSize: "0.74rem", fontWeight: "600", color: "#f87171" }}>High Risk</span>
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-main)", marginTop: "0.2rem" }}>
                {highCount} <span style={{ fontSize: "0.75rem", fontWeight: "400", color: "var(--text-muted)" }}>({highPct}%)</span>
              </div>
            </div>

            <div style={{
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              borderRadius: "8px",
              padding: "0.6rem 0.75rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }} />
                <span style={{ fontSize: "0.74rem", fontWeight: "600", color: "#fbbf24" }}>Watchlist</span>
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-main)", marginTop: "0.2rem" }}>
                {modCount} <span style={{ fontSize: "0.75rem", fontWeight: "400", color: "var(--text-muted)" }}>({modPct}%)</span>
              </div>
            </div>

            <div style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: "8px",
              padding: "0.6rem 0.75rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                <span style={{ fontSize: "0.74rem", fontWeight: "600", color: "#34d399" }}>On Track</span>
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-main)", marginTop: "0.2rem" }}>
                {lowCount} <span style={{ fontSize: "0.75rem", fontWeight: "400", color: "var(--text-muted)" }}>({lowPct}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: "1rem",
          padding: "0.65rem 0.85rem",
          background: "#f0f9ff",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          border: "1px solid #bae6fd"
        }}>
          <ShieldAlert size={16} color="#0284c7" />
          <span style={{ fontSize: "0.74rem", color: "#334155" }}>
            <strong>Human Decision Mandate:</strong> Algorithm outputs provide early advisory warnings and require educator confirmation before initiating formal interventions.
          </span>
        </div>
      </div>

      {/* Cohort Indicator Health Averages */}
      <div className="glass-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={18} color="#06b6d4" />
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)" }}>
              Cohort Multi-Indicator Health
            </h3>
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Average Benchmarks
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
          
          {/* Attendance */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "0.25rem" }}>
              <span style={{ color: "var(--text-main)", fontWeight: "600" }}>Overall Attendance Rate</span>
              <span style={{ color: avgAttendance >= 85 ? "#34d399" : "#fbbf24", fontWeight: "700" }}>{avgAttendance}%</span>
            </div>
            <div style={{ height: "7px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                width: `${avgAttendance}%`,
                height: "100%",
                background: avgAttendance >= 85 ? "#10b981" : "#f59e0b",
                borderRadius: "4px"
              }} />
            </div>
          </div>

          {/* Academic Average */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "0.25rem" }}>
              <span style={{ color: "var(--text-main)", fontWeight: "600" }}>Academic Course Average</span>
              <span style={{ color: avgAcademic >= 75 ? "#34d399" : "#f87171", fontWeight: "700" }}>{avgAcademic}%</span>
            </div>
            <div style={{ height: "7px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                width: `${avgAcademic}%`,
                height: "100%",
                background: avgAcademic >= 75 ? "#10b981" : "#ef4444",
                borderRadius: "4px"
              }} />
            </div>
          </div>

          {/* Assignment Timeliness */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "0.25rem" }}>
              <span style={{ color: "var(--text-main)", fontWeight: "600" }}>Submission Timeliness Rate</span>
              <span style={{ color: avgTimeliness >= 80 ? "#34d399" : "#fbbf24", fontWeight: "700" }}>{avgTimeliness}%</span>
            </div>
            <div style={{ height: "7px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                width: `${avgTimeliness}%`,
                height: "100%",
                background: avgTimeliness >= 80 ? "#10b981" : "#f59e0b",
                borderRadius: "4px"
              }} />
            </div>
          </div>

          {/* Section Participation */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "0.25rem" }}>
              <span style={{ color: "var(--text-main)", fontWeight: "600" }}>Section Engagement Score</span>
              <span style={{ color: avgParticipation >= 70 ? "#059669" : "#0284c7", fontWeight: "700" }}>{avgParticipation}/100</span>
            </div>
            <div style={{ height: "7px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                width: `${avgParticipation}%`,
                height: "100%",
                background: "#0284c7",
                borderRadius: "4px"
              }} />
            </div>
          </div>

          {/* LMS Weekly Hours */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "0.25rem",
            padding: "0.45rem 0.65rem",
            background: "#f0f9ff",
            border: "1px solid #e0f2fe",
            borderRadius: "6px"
          }}>
            <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>Average LMS Study Platform Activity</span>
            <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#0284c7" }}>{avgLmsHours} hrs/week</span>
          </div>

        </div>
      </div>

    </div>
  );
}
