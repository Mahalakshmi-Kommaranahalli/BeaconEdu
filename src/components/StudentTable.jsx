import React, { useState } from "react";
import { 
  Search, 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Filter,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import { SECTIONS, SECTION_METADATA } from "../utils/sectionUtils";

export default function StudentTable({
  students,
  risks,
  anonymize,
  onSelectStudent,
  selectedFilter,
  onClearFilter
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [activeSection, setActiveSection] = useState("ALL"); // "ALL" | "Section A" | "Section B" | "Section C" | "Section D"
  const [tierFilter, setTierFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("riskScore"); // "riskScore", "section", "attendance", "academics", "missing"
  const [sortOrder, setSortOrder] = useState("desc");

  // Quick risk counts
  const highRiskCount = students.filter((s) => risks[s.id]?.riskTier === "High Risk").length;
  const modRiskCount = students.filter((s) => risks[s.id]?.riskTier === "Moderate Risk").length;
  const lowRiskCount = students.filter((s) => risks[s.id]?.riskTier === "Low Risk").length;

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
    const sectionMatch = (student.section || "Section A").toLowerCase().includes(searchLower);
    const branchMatch = (student.branch || student.grade || "").toLowerCase().includes(searchLower);
    if (searchTerm && !nameMatch && !idMatch && !sectionMatch && !branchMatch) return false;

    // Engineering Branch filter
    if (branchFilter !== "ALL") {
      const b = student.branch || student.grade || "";
      if (b !== branchFilter && !b.includes(branchFilter)) return false;
    }

    // Active Section filter
    if (activeSection !== "ALL" && (student.section || "Section A") !== activeSection) return false;

    // Tier filter dropdown / buttons
    if (tierFilter !== "ALL" && risk?.riskTier !== tierFilter) return false;

    return true;
  });

  // Sorting logic (Orderwise)
  const sorted = [...filtered].sort((a, b) => {
    const riskA = risks[a.id]?.compositeScore || 0;
    const riskB = risks[b.id]?.compositeScore || 0;

    let comp = 0;
    if (sortBy === "riskScore") {
      comp = riskA - riskB;
    } else if (sortBy === "section") {
      const secA = a.section || "Section A";
      const secB = b.section || "Section A";
      comp = secA.localeCompare(secB);
      if (comp === 0) comp = riskB - riskA; // Within section, order by risk
      return sortOrder === "asc" ? comp : -comp;
    } else if (sortBy === "attendance") {
      comp = a.attendance.overallRate - b.attendance.overallRate;
    } else if (sortBy === "academics") {
      comp = a.academics.currentAverage - b.academics.currentAverage;
    } else if (sortBy === "missing") {
      comp = a.learningProgress.missingAssignments - b.learningProgress.missingAssignments;
    }

    return sortOrder === "desc" ? -comp : comp;
  });

  const setOrderwiseSort = (field, defaultOrder = "desc") => {
    setSortBy(field);
    setSortOrder(defaultOrder);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder(field === "section" || field === "academics" || field === "attendance" ? "asc" : "desc");
    }
  };

  // Section sequential flow helpers
  const currentSectionIndex = SECTIONS.indexOf(activeSection);
  const goToNextSection = () => {
    if (currentSectionIndex === -1) {
      setActiveSection(SECTIONS[0]);
    } else {
      const nextIdx = (currentSectionIndex + 1) % SECTIONS.length;
      setActiveSection(SECTIONS[nextIdx]);
    }
  };

  const goToPrevSection = () => {
    if (currentSectionIndex === -1) {
      setActiveSection(SECTIONS[SECTIONS.length - 1]);
    } else {
      const prevIdx = (currentSectionIndex - 1 + SECTIONS.length) % SECTIONS.length;
      setActiveSection(SECTIONS[prevIdx]);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", margin: "1rem 0", background: "#ffffff", border: "1px solid #e2e8f0" }}>
      
      {/* 1. ORDERWISE SECTION FLOW NAVIGATOR (Tabs) */}
      <div style={{
        background: "#f8fafc",
        padding: "0.85rem 1rem",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        marginBottom: "1.25rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Layers size={16} color="#0284c7" />
            <span style={{ fontSize: "0.82rem", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Orderwise Section Navigator & Cohort Flow
            </span>
          </div>
          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
            Select a Section to review sequentially or inspect all sections together
          </span>
        </div>

        {/* Section Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          {/* All Sections Button */}
          <button
            onClick={() => setActiveSection("ALL")}
            style={{
              padding: "0.45rem 0.9rem",
              borderRadius: "8px",
              border: activeSection === "ALL" ? "2px solid #0284c7" : "1px solid #cbd5e1",
              background: activeSection === "ALL" ? "#0284c7" : "#ffffff",
              color: activeSection === "ALL" ? "#ffffff" : "#334155",
              fontSize: "0.8rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: activeSection === "ALL" ? "0 2px 6px rgba(2, 132, 199, 0.25)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            All Sections ({students.length})
          </button>

          {/* Section A, B, C, D */}
          {SECTIONS.map((secName, idx) => {
            const secStudents = students.filter((s) => (s.section || "Section A") === secName);
            const secHighRisk = secStudents.filter((s) => risks[s.id]?.riskTier === "High Risk").length;
            const isSelected = activeSection === secName;

            return (
              <button
                key={secName}
                onClick={() => setActiveSection(secName)}
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: "8px",
                  border: isSelected ? "2px solid #0284c7" : "1px solid #cbd5e1",
                  background: isSelected ? "#0284c7" : "#ffffff",
                  color: isSelected ? "#ffffff" : "#334155",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 2px 6px rgba(2, 132, 199, 0.25)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  transition: "all 0.15s"
                }}
              >
                <span>Flow #{idx + 1}: {secName}</span>
                <span style={{
                  fontSize: "0.68rem",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "9999px",
                  background: isSelected ? "rgba(255,255,255,0.25)" : "#e2e8f0",
                  color: isSelected ? "#ffffff" : "#475569"
                }}>
                  {secStudents.length} students
                </span>
                {secHighRisk > 0 && (
                  <span style={{
                    fontSize: "0.65rem",
                    padding: "0.1rem 0.35rem",
                    borderRadius: "9999px",
                    background: isSelected ? "#fee2e2" : "#fecaca",
                    color: "#b91c1c",
                    fontWeight: "800"
                  }}>
                    {secHighRisk} High
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section Step Flow Banner (When single section is selected) */}
        {activeSection !== "ALL" && (
          <div style={{
            marginTop: "0.75rem",
            padding: "0.75rem 1rem",
            background: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #bae6fd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{
                  background: "#e0f2fe",
                  color: "#0369a1",
                  fontWeight: "800",
                  fontSize: "0.7rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "9999px"
                }}>
                  Step {currentSectionIndex + 1} of 4
                </span>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                  {activeSection} — {SECTION_METADATA[activeSection]?.alias}
                </h3>
              </div>
              <p style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "2px" }}>
                Mentor Team: <strong>{SECTION_METADATA[activeSection]?.mentor}</strong> · {SECTION_METADATA[activeSection]?.gradeSpan}
              </p>
            </div>

            {/* Previous & Next Flow Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                onClick={goToPrevSection}
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.76rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  color: "#334155",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem"
                }}
              >
                <ChevronLeft size={14} /> Previous Section
              </button>
              <button
                onClick={goToNextSection}
                style={{
                  background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.35rem 0.85rem",
                  fontSize: "0.76rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  boxShadow: "0 2px 6px rgba(2, 132, 199, 0.25)"
                }}
              >
                Next Section Flow <ChevronRight size={14} />
              </button>
              <button
                onClick={() => setActiveSection("ALL")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  fontSize: "0.74rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginLeft: "0.25rem"
                }}
              >
                Show All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. ORDERWISE RISK LEVEL PRIORITY HIERARCHY BAR */}
      <div style={{
        background: "#f0f9ff",
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        border: "1px solid #bae6fd",
        marginBottom: "1.25rem",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.75rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ShieldAlert size={16} color="#0284c7" />
          <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Orderwise Risk Level Hierarchy:
          </span>
        </div>

        {/* 3 Strict Priority Tiers */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          
          {/* Priority 1: High Risk */}
          <button
            onClick={() => {
              setTierFilter(tierFilter === "High Risk" ? "ALL" : "High Risk");
              setOrderwiseSort("riskScore", "desc");
            }}
            style={{
              background: tierFilter === "High Risk" ? "#dc2626" : "#fee2e2",
              color: tierFilter === "High Risk" ? "#ffffff" : "#991b1b",
              border: "1px solid #fca5a5",
              borderRadius: "6px",
              padding: "0.3rem 0.65rem",
              fontSize: "0.76rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <span>Priority 1: High Risk (80-100%)</span>
            <span style={{
              background: tierFilter === "High Risk" ? "rgba(255,255,255,0.25)" : "#fecaca",
              padding: "0.05rem 0.35rem",
              borderRadius: "9999px",
              fontWeight: "800"
            }}>
              {highRiskCount}
            </span>
          </button>

          {/* Priority 2: Moderate Risk */}
          <button
            onClick={() => {
              setTierFilter(tierFilter === "Moderate Risk" ? "ALL" : "Moderate Risk");
              setOrderwiseSort("riskScore", "desc");
            }}
            style={{
              background: tierFilter === "Moderate Risk" ? "#d97706" : "#fef3c7",
              color: tierFilter === "Moderate Risk" ? "#ffffff" : "#92400e",
              border: "1px solid #fcd34d",
              borderRadius: "6px",
              padding: "0.3rem 0.65rem",
              fontSize: "0.76rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <span>Priority 2: Moderate Risk (40-79%)</span>
            <span style={{
              background: tierFilter === "Moderate Risk" ? "rgba(255,255,255,0.25)" : "#fde68a",
              padding: "0.05rem 0.35rem",
              borderRadius: "9999px",
              fontWeight: "800"
            }}>
              {modRiskCount}
            </span>
          </button>

          {/* Priority 3: Low Risk */}
          <button
            onClick={() => {
              setTierFilter(tierFilter === "Low Risk" ? "ALL" : "Low Risk");
              setOrderwiseSort("riskScore", "asc");
            }}
            style={{
              background: tierFilter === "Low Risk" ? "#059669" : "#d1fae5",
              color: tierFilter === "Low Risk" ? "#ffffff" : "#065f46",
              border: "1px solid #6ee7b7",
              borderRadius: "6px",
              padding: "0.3rem 0.65rem",
              fontSize: "0.76rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <span>Priority 3: Low Risk / On Track (0-39%)</span>
            <span style={{
              background: tierFilter === "Low Risk" ? "rgba(255,255,255,0.25)" : "#a7f3d0",
              padding: "0.05rem 0.35rem",
              borderRadius: "9999px",
              fontWeight: "800"
            }}>
              {lowRiskCount}
            </span>
          </button>

          {tierFilter !== "ALL" && (
            <button
              onClick={() => setTierFilter("ALL")}
              style={{
                background: "transparent",
                border: "none",
                color: "#0369a1",
                fontSize: "0.72rem",
                fontWeight: "700",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Reset Priority Filter
            </button>
          )}

        </div>
      </div>

      {/* 3. ORDERWISE SORT CONTROLS & FILTER BAR */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1rem",
        paddingBottom: "0.75rem",
        borderBottom: "1px solid #e2e8f0"
      }}>
        
        {/* Orderwise Sort Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.74rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
            Order Roster By:
          </span>

          <button
            onClick={() => setOrderwiseSort("riskScore", "desc")}
            style={{
              padding: "0.3rem 0.65rem",
              borderRadius: "6px",
              border: sortBy === "riskScore" ? "1px solid #0284c7" : "1px solid #cbd5e1",
              background: sortBy === "riskScore" ? "#e0f2fe" : "#ffffff",
              color: sortBy === "riskScore" ? "#0369a1" : "#475569",
              fontSize: "0.75rem",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            ⚡ Risk Severity (High → Low)
          </button>

          <button
            onClick={() => setOrderwiseSort("section", "asc")}
            style={{
              padding: "0.3rem 0.65rem",
              borderRadius: "6px",
              border: sortBy === "section" ? "1px solid #0284c7" : "1px solid #cbd5e1",
              background: sortBy === "section" ? "#e0f2fe" : "#ffffff",
              color: sortBy === "section" ? "#0369a1" : "#475569",
              fontSize: "0.75rem",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            🔤 Section Flow (A → D)
          </button>

          <button
            onClick={() => setOrderwiseSort("attendance", "asc")}
            style={{
              padding: "0.3rem 0.65rem",
              borderRadius: "6px",
              border: sortBy === "attendance" ? "1px solid #0284c7" : "1px solid #cbd5e1",
              background: sortBy === "attendance" ? "#e0f2fe" : "#ffffff",
              color: sortBy === "attendance" ? "#0369a1" : "#475569",
              fontSize: "0.75rem",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            📉 Attendance (Critical First)
          </button>

          <button
            onClick={() => setOrderwiseSort("missing", "desc")}
            style={{
              padding: "0.3rem 0.65rem",
              borderRadius: "6px",
              border: sortBy === "missing" ? "1px solid #0284c7" : "1px solid #cbd5e1",
              background: sortBy === "missing" ? "#e0f2fe" : "#ffffff",
              color: sortBy === "missing" ? "#0369a1" : "#475569",
              fontSize: "0.75rem",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            ⚠️ Missing Work (Most First)
          </button>

          <button
            onClick={() => setOrderwiseSort("academics", "asc")}
            style={{
              padding: "0.3rem 0.65rem",
              borderRadius: "6px",
              border: sortBy === "academics" ? "1px solid #0284c7" : "1px solid #cbd5e1",
              background: sortBy === "academics" ? "#e0f2fe" : "#ffffff",
              color: sortBy === "academics" ? "#0369a1" : "#475569",
              fontSize: "0.75rem",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            📚 Course Average (Lowest First)
          </button>
        </div>

        {/* Search & Grade Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          
          {/* Search Input */}
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            background: "#ffffff",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            padding: "0.3rem 0.65rem",
            width: "220px"
          }}>
            <Search size={14} color="#64748b" style={{ marginRight: "0.4rem" }} />
            <input
              type="text"
              placeholder={anonymize ? "Search by ID, branch, section..." : "Search name, ID, branch, section..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "0.78rem",
                color: "#1e293b",
                width: "100%"
              }}
            />
          </div>

          {/* Engineering Branch Selector */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            style={{
              background: "#ffffff",
              color: "#1e293b",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              padding: "0.35rem 0.65rem",
              fontSize: "0.78rem",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            <option value="ALL">All Engineering Branches</option>
            <option value="CSE">CSE — Computer Science</option>
            <option value="ISE">ISE — Information Science</option>
            <option value="ECE">ECE — Electronics & Comm</option>
            <option value="AIML">AIML — AI & Machine Learning</option>
            <option value="ME">ME — Mechanical Engg</option>
            <option value="EEE">EEE — Electrical & Electronics</option>
          </select>

          {/* Active Filter Pill */}
          {selectedFilter && selectedFilter !== "ALL" && (
            <button
              onClick={onClearFilter}
              style={{
                background: "#e0f2fe",
                color: "#0369a1",
                border: "1px solid #bae6fd",
                borderRadius: "9999px",
                padding: "0.2rem 0.6rem",
                fontSize: "0.72rem",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              Filter: {selectedFilter} ×
            </button>
          )}

        </div>

      </div>

      {/* 4. ROSTER TABLE WITH ORDER RANK COLUMN */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{
              borderBottom: "2px solid #e2e8f0",
              color: "#64748b",
              fontSize: "0.74rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              background: "#f8fafc"
            }}>
              <th style={{ padding: "0.75rem 0.85rem", width: "45px" }}>Rank</th>
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
                <td colSpan={9} style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
                  <AlertCircle size={28} style={{ margin: "0 auto 0.5rem", color: "#94a3b8" }} />
                  <div style={{ fontWeight: "700" }}>No students match the selected order or criteria.</div>
                  <div style={{ fontSize: "0.78rem" }}>Try clearing search or switching Section filters.</div>
                </td>
              </tr>
            ) : (
              sorted.map((student, index) => {
                const risk = risks[student.id];
                const displayName = anonymize ? student.id : student.name;
                const avatarInitials = anonymize 
                  ? "ID" 
                  : student.name.split(" ").map(n => n[0]).join("");

                // Priority Badge Color based on Risk Tier
                const rankColor = risk?.riskTier === "High Risk" 
                  ? "#dc2626" 
                  : risk?.riskTier === "Moderate Risk" 
                    ? "#d97706" 
                    : "#059669";

                const rankBg = risk?.riskTier === "High Risk" 
                  ? "#fee2e2" 
                  : risk?.riskTier === "Moderate Risk" 
                    ? "#fef3c7" 
                    : "#d1fae5";

                return (
                  <tr
                    key={student.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      transition: "background 0.15s ease",
                      cursor: "pointer"
                    }}
                    onClick={() => onSelectStudent(student)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Rank / Order Number */}
                    <td style={{ padding: "0.85rem 0.5rem 0.85rem 0.85rem" }}>
                      <span style={{
                        display: "inline-block",
                        width: "28px",
                        height: "28px",
                        lineHeight: "26px",
                        borderRadius: "6px",
                        background: rankBg,
                        color: rankColor,
                        fontWeight: "800",
                        fontSize: "0.74rem",
                        textAlign: "center",
                        border: `1px solid ${rankColor}33`
                      }}>
                        #{index + 1}
                      </span>
                    </td>

                    {/* Student Info */}
                    <td style={{ padding: "0.85rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{
                          width: "36px",
                          height: "36px",
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
                          <div style={{ fontWeight: "700", fontSize: "0.88rem", color: "#0f172a" }}>
                            {displayName}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <span style={{
                              fontWeight: "700",
                              color: "#0369a1",
                              background: "#e0f2fe",
                              padding: "0.1rem 0.4rem",
                              borderRadius: "4px",
                              fontSize: "0.7rem"
                            }}>
                              {student.branch || student.grade}
                            </span>
                            <span>·</span>
                            <span style={{
                              fontWeight: "700",
                              color: "#0284c7"
                            }}>
                              {student.section || "Section A"}
                            </span>
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
                        <span style={{ fontSize: "0.85rem", fontWeight: "800", color: risk?.tierColor }}>
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
                          color: student.attendance.overallRate < 75 ? "#dc2626" : student.attendance.overallRate < 85 ? "#d97706" : "#0f172a"
                        }}>
                          {student.attendance.overallRate}%
                        </div>
                        {student.attendance.consecutiveAbsences > 0 && (
                          <div style={{ fontSize: "0.68rem", color: "#dc2626", fontWeight: "600" }}>
                            {student.attendance.consecutiveAbsences} consecutive absences
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Course Average */}
                    <td style={{ padding: "0.85rem" }}>
                      <div>
                        <div style={{
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          color: student.academics.currentAverage < 65 ? "#dc2626" : student.academics.currentAverage < 75 ? "#d97706" : "#0f172a",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem"
                        }}
                        >
                          {student.academics.currentAverage}%
                          {student.academics.recentDrop < 0 && (
                            <span style={{ fontSize: "0.68rem", color: "#dc2626", display: "inline-flex", alignItems: "center" }}>
                              <TrendingDown size={11} /> {student.academics.recentDrop}%
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "#64748b" }}>
                          GPA: {Number(student.academics.gpa || 0).toFixed(2)}
                        </div>
                      </div>
                    </td>

                    {/* Missing Assignments */}
                    <td style={{ padding: "0.85rem" }}>
                      <div>
                        <div style={{
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          color: student.learningProgress.missingAssignments >= 4 ? "#dc2626" : student.learningProgress.missingAssignments >= 2 ? "#d97706" : "#0f172a"
                        }}>
                          {student.learningProgress.missingAssignments} missing
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "#64748b" }}>
                          {student.learningProgress.submissionTimeliness}% on-time rate
                        </div>
                      </div>
                    </td>

                    {/* Primary Risk Drivers */}
                    <td style={{ padding: "0.85rem" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", maxWidth: "230px" }}>
                        {risk?.drivers.slice(0, 2).map((d, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "0.68rem",
                              padding: "0.15rem 0.45rem",
                              borderRadius: "4px",
                              background: d.severity === "critical" ? "#fee2e2" : "#fef3c7",
                              color: d.severity === "critical" ? "#b91c1c" : "#b45309",
                              fontWeight: "600"
                            }}
                          >
                            {d.factor}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Intervention Status */}
                    <td style={{ padding: "0.85rem" }}>
                      {student.interventionPlan?.status === "In Progress" && (
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          background: "#e0f2fe",
                          color: "#0369a1",
                          fontSize: "0.72rem",
                          fontWeight: "700",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "9999px"
                        }}>
                          <Clock size={12} /> In Progress
                        </span>
                      )}
                      {student.interventionPlan?.status === "Approved" && (
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          background: "#e0f2fe",
                          color: "#0284c7",
                          fontSize: "0.72rem",
                          fontWeight: "700",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "9999px"
                        }}>
                          Approved
                        </span>
                      )}
                      {student.interventionPlan?.status === "Resolved" && (
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          background: "#dcfce7",
                          color: "#15803d",
                          fontSize: "0.72rem",
                          fontWeight: "700",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "9999px"
                        }}>
                          <CheckCircle2 size={12} /> Recovered
                        </span>
                      )}
                      {(!student.interventionPlan || student.interventionPlan?.status === "None" || student.interventionPlan?.status === "Recommended") && (
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          background: "#fef3c7",
                          color: "#b45309",
                          fontSize: "0.72rem",
                          fontWeight: "700",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "9999px"
                        }}>
                          <AlertCircle size={12} /> Needs Review
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "0.85rem", textAlign: "right" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student);
                        }}
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          padding: "0.3rem 0.65rem",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          color: "#0f172a",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem"
                        }}
                      >
                        Review <ChevronRight size={13} />
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
