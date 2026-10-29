import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ChevronRight,
  TrendingDown,
  TrendingUp
} from "lucide-react";

export default function StudentTable({
  students,
  risks,
  anonymize,
  onSelectStudent,
  selectedFilter,
  onClearFilter
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("riskScore"); // "riskScore", "attendance", "academics", "missing"
  const [sortOrder, setSortOrder] = useState("desc");

  // Filtering logic
  const filtered = students.filter((student) => {
    const risk = risks[student.id];

    // Quick metric card filter support
    if (selectedFilter === "High Risk" && risk?.riskTier !== "High Risk") return false;
    if (selectedFilter === "Moderate Risk" && risk?.riskTier !== "Moderate Risk") return false;
    if (selectedFilter === "INTERVENTIONS" && student.interventionPlan?.status !== "In Progress") return false;
    if (selectedFilter === "RECOVERED" && student.interventionPlan?.status !== "Resolved") return false;
    if (selectedFilter === "ATTENDANCE_FLAG" && student.attendance.overallRate >= 85) return false;

    // Search query
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = student.name.toLowerCase().includes(searchLower);
    const idMatch = student.id.toLowerCase().includes(searchLower);
    const homeroomMatch = student.homeroom.toLowerCase().includes(searchLower);
    if (searchTerm && !nameMatch && !idMatch && !homeroomMatch) return false;

    // Grade filter
    if (gradeFilter !== "ALL" && student.grade !== gradeFilter) return false;

    // Tier filter dropdown
    if (tierFilter !== "ALL" && risk?.riskTier !== tierFilter) return false;

    return true;
  });

  // Sorting logic
  const sorted = [...filtered].sort((a, b) => {
    const riskA = risks[a.id]?.compositeScore || 0;
    const riskB = risks[b.id]?.compositeScore || 0;

    let comp = 0;
    if (sortBy === "riskScore") {
      comp = riskA - riskB;
    } else if (sortBy === "attendance") {
      comp = a.attendance.overallRate - b.attendance.overallRate;
    } else if (sortBy === "academics") {
      comp = a.academics.currentAverage - b.academics.currentAverage;
    } else if (sortBy === "missing") {
      comp = a.learningProgress.missingAssignments - b.learningProgress.missingAssignments;
    }

    return sortOrder === "desc" ? -comp : comp;
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", margin: "1rem 0" }}>
      
      {/* Header and Filter Toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
            Student Indicator Roster & Early Detection
          </h2>
          <p style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
            Showing {sorted.length} of {students.length} students · Real-time multi-signal synthesis
          </p>
        </div>

        {/* Filter controls */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem" }}>
          
          {/* Search Input */}
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-subtle)",
            padding: "0.35rem 0.75rem",
            width: "220px"
          }}>
            <Search size={14} color="var(--text-muted)" style={{ marginRight: "0.4rem" }} />
            <input
              type="text"
              placeholder={anonymize ? "Search by ID or homeroom..." : "Search name, ID, homeroom..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "0.8rem",
                color: "var(--text-main)",
                width: "100%"
              }}
            />
          </div>

          {/* Grade Filter */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            style={{
              background: "var(--bg-surface)",
              color: "var(--text-main)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              padding: "0.4rem 0.75rem",
              fontSize: "0.8rem",
              cursor: "pointer"
            }}
          >
            <option value="ALL">All Grades</option>
            <option value="9th Grade">9th Grade</option>
            <option value="10th Grade">10th Grade</option>
            <option value="11th Grade">11th Grade</option>
            <option value="12th Grade">12th Grade</option>
          </select>

          {/* Risk Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            style={{
              background: "var(--bg-surface)",
              color: "var(--text-main)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              padding: "0.4rem 0.75rem",
              fontSize: "0.8rem",
              cursor: "pointer"
            }}
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="High Risk">High Risk Only</option>
            <option value="Moderate Risk">Moderate Risk Only</option>
            <option value="Low Risk">Low Risk / On Track</option>
          </select>

          {/* Clear Active Filter Pill */}
          {selectedFilter && selectedFilter !== "ALL" && (
            <button
              onClick={onClearFilter}
              style={{
                background: "#e0f2fe",
                color: "#0369a1",
                border: "1px solid #bae6fd",
                borderRadius: "9999px",
                padding: "0.25rem 0.65rem",
                fontSize: "0.72rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem"
              }}
            >
              Filter: {selectedFilter} ×
            </button>
          )}

        </div>

      </div>

      {/* Roster Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{
              borderBottom: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em"
            }}>
              <th style={{ padding: "0.75rem 0.85rem" }}>Student</th>
              <th
                onClick={() => toggleSort("riskScore")}
                style={{ padding: "0.75rem 0.85rem", cursor: "pointer", userSelect: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span>Risk Score</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th
                onClick={() => toggleSort("attendance")}
                style={{ padding: "0.75rem 0.85rem", cursor: "pointer", userSelect: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span>Attendance</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th
                onClick={() => toggleSort("academics")}
                style={{ padding: "0.75rem 0.85rem", cursor: "pointer", userSelect: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span>Course Average</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th
                onClick={() => toggleSort("missing")}
                style={{ padding: "0.75rem 0.85rem", cursor: "pointer", userSelect: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span>Missing Work</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: "0.75rem 0.85rem" }}>Primary Risk Drivers</th>
              <th style={{ padding: "0.75rem 0.85rem" }}>Intervention Status</th>
              <th style={{ padding: "0.75rem 0.85rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  No students match the current filters.
                </td>
              </tr>
            ) : (
              sorted.map((student) => {
                const risk = risks[student.id];
                const displayName = anonymize ? `Student #${student.id.replace("STU-", "")}` : student.name;
                const avatarInitials = anonymize
                  ? `#${student.id.replace("STU-", "")}`
                  : student.name.split(" ").map((n) => n[0]).join("");

                return (
                  <tr
                    key={student.id}
                    onClick={() => onSelectStudent(student)}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      transition: "background 0.15s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Student Info */}
                    <td style={{ padding: "0.85rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          background: anonymize ? "#475569" : student.avatarColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          fontWeight: "700",
                          fontSize: "0.75rem",
                          flexShrink: 0
                        }}>
                          {avatarInitials}
                        </div>
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "0.88rem", color: "var(--text-main)" }}>
                            {displayName}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            {student.grade} · {student.homeroom.split(" - ")[0]}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Risk Tier & Composite Score */}
                    <td style={{ padding: "0.85rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className={`badge ${risk?.badgeClass}`}>
                          {risk?.riskTier}
                        </span>
                        <span style={{ fontSize: "0.82rem", fontWeight: "700", color: risk?.tierColor }}>
                          {risk?.compositeScore}%
                        </span>
                      </div>
                    </td>

                    {/* Attendance */}
                    <td style={{ padding: "0.85rem" }}>
                      <div>
                        <div style={{
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          color: student.attendance.overallRate < 75 ? "#ef4444" : student.attendance.overallRate < 85 ? "#f59e0b" : "var(--text-main)"
                        }}>
                          {student.attendance.overallRate}%
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          {student.attendance.consecutiveAbsences > 0 ? (
                            <span style={{ color: student.attendance.consecutiveAbsences >= 3 ? "#ef4444" : "#f59e0b" }}>
                              {student.attendance.consecutiveAbsences} consecutive absences
                            </span>
                          ) : (
                            "No current absences"
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Academics Average */}
                    <td style={{ padding: "0.85rem" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{
                            fontSize: "0.85rem",
                            fontWeight: "700",
                            color: student.academics.currentAverage < 60 ? "#ef4444" : student.academics.currentAverage < 70 ? "#f59e0b" : "var(--text-main)"
                          }}>
                            {student.academics.currentAverage}%
                          </span>
                          {student.academics.recentDrop < 0 ? (
                            <span style={{ fontSize: "0.7rem", color: "#f87171", display: "inline-flex", alignItems: "center" }}>
                              <TrendingDown size={11} /> {student.academics.recentDrop}%
                            </span>
                          ) : (
                            <span style={{ fontSize: "0.7rem", color: "#34d399", display: "inline-flex", alignItems: "center" }}>
                              <TrendingUp size={11} /> +{student.academics.recentDrop}%
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          GPA: {student.academics.gpa.toFixed(2)}
                        </div>
                      </div>
                    </td>

                    {/* Missing Assignments */}
                    <td style={{ padding: "0.85rem" }}>
                      <div>
                        <span style={{
                          fontSize: "0.84rem",
                          fontWeight: "700",
                          color: student.learningProgress.missingAssignments >= 4 ? "#ef4444" : student.learningProgress.missingAssignments > 0 ? "#f59e0b" : "#34d399"
                        }}>
                          {student.learningProgress.missingAssignments} missing
                        </span>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          {student.learningProgress.submissionTimeliness}% on-time rate
                        </div>
                      </div>
                    </td>

                    {/* Risk Drivers tags */}
                    <td style={{ padding: "0.85rem" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", maxWidth: "230px" }}>
                        {risk?.drivers && risk.drivers.length > 0 ? (
                          risk.drivers.slice(0, 2).map((d, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: "0.68rem",
                                padding: "0.15rem 0.45rem",
                                borderRadius: "4px",
                                background: d.severity === "critical" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
                                color: d.severity === "critical" ? "#f87171" : "#fbbf24",
                                border: `1px solid ${d.severity === "critical" ? "rgba(239, 68, 68, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                                whiteSpace: "nowrap"
                              }}
                            >
                              {d.factor}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: "0.72rem", color: "#34d399", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                            <CheckCircle2 size={12} /> Steady progress
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Intervention Status */}
                    <td style={{ padding: "0.85rem" }}>
                      {student.interventionPlan?.status === "In Progress" && (
                        <span style={{
                          fontSize: "0.72rem",
                          fontWeight: "600",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "9999px",
                          background: "rgba(6, 182, 212, 0.12)",
                          color: "#06b6d4",
                          border: "1px solid rgba(6, 182, 212, 0.3)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem"
                        }}>
                          <Clock size={11} /> In Progress
                        </span>
                      )}
                      {student.interventionPlan?.status === "Approved" && (
                        <span style={{
                          fontSize: "0.72rem",
                          fontWeight: "600",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "9999px",
                          background: "#e0f2fe",
                          color: "#0284c7",
                          border: "1px solid #bae6fd",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem"
                        }}>
                          Approved
                        </span>
                      )}
                      {student.interventionPlan?.status === "Recommended" && (
                        <span style={{
                          fontSize: "0.72rem",
                          fontWeight: "600",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "9999px",
                          background: "rgba(245, 158, 11, 0.12)",
                          color: "#f59e0b",
                          border: "1px solid rgba(245, 158, 11, 0.3)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem"
                        }}>
                          <AlertCircle size={11} /> Needs Review
                        </span>
                      )}
                      {student.interventionPlan?.status === "Resolved" && (
                        <span style={{
                          fontSize: "0.72rem",
                          fontWeight: "600",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "9999px",
                          background: "rgba(16, 185, 129, 0.12)",
                          color: "#10b981",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem"
                        }}>
                          <Sparkles size={11} /> Recovered
                        </span>
                      )}
                      {(!student.interventionPlan || student.interventionPlan?.status === "None") && (
                        <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>
                          Standard Pacing
                        </span>
                      )}
                    </td>

                    {/* Action button */}
                    <td style={{ padding: "0.85rem", textAlign: "right" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student);
                        }}
                        className="btn-secondary"
                        style={{ fontSize: "0.74rem", padding: "0.35rem 0.65rem" }}
                      >
                        <span>Review</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
