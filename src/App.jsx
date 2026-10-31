import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import DashboardStats from "./components/DashboardStats";
import EarlyWarningFeed from "./components/EarlyWarningFeed";
import CohortRiskChart from "./components/CohortRiskChart";
import StudentTable from "./components/StudentTable";
import StudentDetailModal from "./components/StudentDetailModal";
import InterventionHub from "./components/InterventionHub";
import AlgorithmConfigModal from "./components/AlgorithmConfigModal";
import PrivacyGovernanceModal from "./components/PrivacyGovernanceModal";
import NewStudentModal from "./components/NewStudentModal";
import LoginPage from "./components/LoginPage";
import AcademicCalendar from "./components/AcademicCalendar";
import { initialStudents } from "./data/initialStudents";
import { defaultWeights, calculateStudentRisk } from "./utils/riskEngine";
import { normalizeStudentSection } from "./utils/sectionUtils";

export default function App() {
  // User authentication session state (persisted so refresh preserves user view)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("beaconedu_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Default to null so user lands on the single unified Login Page
    return null;
  });

  // Theme state - defaults to official light (White & Sky Blue)
  const [theme, setTheme] = useState(() => localStorage.getItem("beaconedu_theme") || "light");

  // Privacy / FERPA masking state
  const [anonymize, setAnonymize] = useState(false);

  // Active view tab: "dashboard" | "interventions"
  const [activeTab, setActiveTab] = useState("dashboard");

  // Indicator weights
  const [weights, setWeights] = useState(() => {
    const saved = localStorage.getItem("beaconedu_weights");
    return saved ? JSON.parse(saved) : defaultWeights;
  });

  // Students cohort dataset (1,000+ students across Engineering Branches and Sections)
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("beaconedu_students_v1000");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 1000) {
          return parsed.map((s, idx) => normalizeStudentSection(s, idx));
        }
      } catch (e) {}
    }
    return initialStudents.map((s, idx) => normalizeStudentSection(s, idx));
  });

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showNewStudentModal, setShowNewStudentModal] = useState(false);

  // Active metric filter
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  // Persist theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("beaconedu_theme", theme);
  }, [theme]);

  // Persist weights
  useEffect(() => {
    localStorage.setItem("beaconedu_weights", JSON.stringify(weights));
  }, [weights]);

  // Persist students safely with quota exception handling
  useEffect(() => {
    try {
      localStorage.setItem("beaconedu_students_v1000", JSON.stringify(students));
    } catch (e) {
      console.warn("Storage quota limit reached for 1000+ students cohort; keeping state in memory:", e);
    }
  }, [students]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("beaconedu_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("beaconedu_user");
  };

  // Find current student record if student role is active
  const currentStudent = useMemo(() => {
    if (currentUser?.role !== "Student") return null;
    const searchId = currentUser.id || currentUser.studentId;
    const searchName = (currentUser.name || "").toLowerCase().trim();
    return (
      students.find(
        (s) =>
          (searchId && s.id === searchId) ||
          (searchName && s.name.toLowerCase() === searchName)
      ) || students[0]
    );
  }, [currentUser, students]);

  // If a student is logged in, restrict all displayed data strictly to their record
  const displayedStudents = useMemo(() => {
    if (currentUser?.role === "Student" && currentStudent) {
      return [currentStudent];
    }
    return students;
  }, [currentUser, currentStudent, students]);

  // Calculate risks for displayed students (single student if student role, cohort if educator)
  const risks = useMemo(() => {
    const map = {};
    displayedStudents.forEach((s) => {
      map[s.id] = calculateStudentRisk(s, weights);
    });
    return map;
  }, [displayedStudents, weights]);

  // Count high risk students
  const highRiskCount = useMemo(() => {
    return Object.values(risks).filter((r) => r.riskTier === "High Risk").length;
  }, [risks]);

  // Update a single student record
  const handleUpdateStudent = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    // If open in modal, keep updated
    if (selectedStudent && selectedStudent.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }
  };

  // Add new student
  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [newStudent, ...prev]);
    setSelectedStudent(newStudent);
  };

  // Reset cohort back to initial demo data
  const handleResetCohort = () => {
    setStudents(initialStudents);
    setWeights(defaultWeights);
    localStorage.removeItem("beaconedu_students");
    localStorage.removeItem("beaconedu_weights");
  };

  // If user is not signed in, show the single unified Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} students={students} />;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        anonymize={anonymize}
        setAnonymize={setAnonymize}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenConfig={() => setShowConfigModal(true)}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenNewStudent={() => setShowNewStudentModal(true)}
        highRiskCount={highRiskCount}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="container" style={{ flex: 1, paddingBottom: "3rem" }}>
        
        {/* Banner with advisory principle */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
          margin: "0.85rem 0",
          padding: "0.65rem 1.15rem",
          borderRadius: "8px",
          background: currentUser.role === "Student" ? "#f0fdf4" : "#f0f9ff",
          border: `1px solid ${currentUser.role === "Student" ? "#86efac" : "#bae6fd"}`,
          boxShadow: "0 1px 3px rgba(2, 132, 199, 0.05)",
          fontSize: "0.78rem",
          color: "#334155"
        }}>
          <div>
            {currentUser.role === "Student" ? (
              <span>
                🎓 <strong style={{ color: "#0f172a" }}>Student Academic Portal:</strong> Welcome, <strong>{currentUser.name}</strong> ({currentStudent?.id} • {currentStudent?.branch} - {currentStudent?.section}). Displaying all risk signals, course grades, and intervention records related strictly to your profile.
              </span>
            ) : (
              <span>
                💡 <strong style={{ color: "#0f172a" }}>Educator Advisory Guarantee:</strong> Welcome, <strong>{currentUser.name}</strong> ({currentUser.role}). BeaconEdu detects early signals so you can intervene before failure occurs.
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            {currentUser.role === "Student" && currentStudent && (
              <button
                onClick={() => setSelectedStudent(currentStudent)}
                className="btn-primary"
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.75rem" }}
              >
                🔍 Open My Full Deep-Dive & What-If Simulator
              </button>
            )}
            <span>🔒 Confidential FERPA Storage</span>
            <span>⚖️ 100% Explainable Signals</span>
          </div>
        </div>

        {/* TAB 1: DASHBOARD (Cohort for Educator, Self for Student) */}
        {activeTab === "dashboard" && (
          <div>
            {/* Top Metrics Cards */}
            <DashboardStats
              students={displayedStudents}
              risks={risks}
              selectedFilter={selectedFilter}
              onSelectFilter={(filterKey) => setSelectedFilter(selectedFilter === filterKey ? "ALL" : filterKey)}
            />

            {/* Early Warning Signal Alerts */}
            <EarlyWarningFeed
              students={displayedStudents}
              risks={risks}
              anonymize={anonymize}
              onSelectStudent={setSelectedStudent}
            />

            {/* Visual Risk Distribution Chart & Multi-Indicator Benchmark */}
            <CohortRiskChart
              students={displayedStudents}
              risks={risks}
            />

            {/* Student Table Roster */}
            <StudentTable
              students={displayedStudents}
              risks={risks}
              anonymize={anonymize}
              onSelectStudent={setSelectedStudent}
              selectedFilter={selectedFilter}
              onClearFilter={() => setSelectedFilter("ALL")}
            />
          </div>
        )}

        {/* TAB 2: ACADEMIC & INTERVENTION CALENDAR */}
        {activeTab === "calendar" && (
          <AcademicCalendar
            students={displayedStudents}
            risks={risks}
            anonymize={anonymize}
            onSelectStudent={setSelectedStudent}
            currentUser={currentUser}
          />
        )}

        {/* TAB 3: INTERVENTION MANAGEMENT HUB */}
        {activeTab === "interventions" && (
          <InterventionHub
            students={displayedStudents}
            risks={risks}
            anonymize={anonymize}
            onSelectStudent={setSelectedStudent}
            onUpdateStudent={handleUpdateStudent}
            currentUser={currentUser}
          />
        )}

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
        padding: "1.25rem 2rem",
        textAlign: "center",
        fontSize: "0.75rem",
        color: "var(--text-muted)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <strong>BeaconEdu Early Student Risk & Intervention Platform</strong> · Logged in as {currentUser.name} ({currentUser.title})
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <button onClick={() => setShowPrivacyModal(true)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.75rem" }}>
              Privacy & FERPA Policy
            </button>
            <button onClick={() => setShowConfigModal(true)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.75rem" }}>
              Algorithm Weights
            </button>
            <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#0284c7", cursor: "pointer", fontSize: "0.75rem", fontWeight: "600" }}>
              Switch / Sign Out
            </button>
            <span>v1.0.0 Stable</span>
          </div>
        </div>
      </footer>

      {/* 360-Degree Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          risk={risks[selectedStudent.id]}
          weights={weights}
          anonymize={anonymize}
          onClose={() => setSelectedStudent(null)}
          onUpdateStudent={handleUpdateStudent}
          currentUser={currentUser}
        />
      )}

      {/* Algorithm Weights Config Modal */}
      {showConfigModal && (
        <AlgorithmConfigModal
          weights={weights}
          onSaveWeights={setWeights}
          onClose={() => setShowConfigModal(false)}
        />
      )}

      {/* Privacy & Governance Policy Modal */}
      {showPrivacyModal && (
        <PrivacyGovernanceModal
          students={students}
          risks={risks}
          anonymize={anonymize}
          setAnonymize={setAnonymize}
          onResetCohort={handleResetCohort}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}

      {/* New Student Modal */}
      {showNewStudentModal && (
        <NewStudentModal
          onAddStudent={handleAddStudent}
          onClose={() => setShowNewStudentModal(false)}
        />
      )}

    </div>
  );
}
