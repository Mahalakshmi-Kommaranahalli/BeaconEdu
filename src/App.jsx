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
import { initialStudents } from "./data/initialStudents";
import { defaultWeights, calculateStudentRisk } from "./utils/riskEngine";

export default function App() {
  // User authentication session state (defaults to null so Login screen shows first)
  const [currentUser, setCurrentUser] = useState(null);

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

  // Students cohort dataset
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("beaconedu_students");
    return saved ? JSON.parse(saved) : initialStudents;
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

  // Persist students
  useEffect(() => {
    localStorage.setItem("beaconedu_students", JSON.stringify(students));
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

  // Calculate risks for all students
  const risks = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      map[s.id] = calculateStudentRisk(s, weights);
    });
    return map;
  }, [students, weights]);

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

  // If user is not signed in, show the split Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
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
          background: "#f0f9ff",
          border: "1px solid #bae6fd",
          boxShadow: "0 1px 3px rgba(2, 132, 199, 0.05)",
          fontSize: "0.78rem",
          color: "#334155"
        }}>
          <div>
            💡 <strong style={{ color: "#0f172a" }}>Educator Advisory Guarantee:</strong> Welcome, {currentUser.name} ({currentUser.role}). BeaconEdu detects early signals so you can intervene before failure occurs.
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span>🔒 Local FERPA Storage</span>
            <span>⚖️ 100% Explainable Signals</span>
            <span>🤝 Human-in-the-Loop</span>
          </div>
        </div>

        {/* TAB 1: COHORT DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            {/* Top Metrics Cards */}
            <DashboardStats
              students={students}
              risks={risks}
              selectedFilter={selectedFilter}
              onSelectFilter={(filterKey) => setSelectedFilter(selectedFilter === filterKey ? "ALL" : filterKey)}
            />

            {/* Early Warning Signal Alerts */}
            <EarlyWarningFeed
              students={students}
              risks={risks}
              anonymize={anonymize}
              onSelectStudent={setSelectedStudent}
            />

            {/* Visual Risk Distribution Chart & Multi-Indicator Benchmark */}
            <CohortRiskChart
              students={students}
              risks={risks}
            />

            {/* Student Table Roster */}
            <StudentTable
              students={students}
              risks={risks}
              anonymize={anonymize}
              onSelectStudent={setSelectedStudent}
              selectedFilter={selectedFilter}
              onClearFilter={() => setSelectedFilter("ALL")}
            />
          </div>
        )}

        {/* TAB 2: INTERVENTION MANAGEMENT HUB */}
        {activeTab === "interventions" && (
          <InterventionHub
            students={students}
            risks={risks}
            anonymize={anonymize}
            onSelectStudent={setSelectedStudent}
            onUpdateStudent={handleUpdateStudent}
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
