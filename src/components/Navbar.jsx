import React from "react";
import { 
  Compass, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sliders, 
  Sun, 
  Moon, 
  UserPlus, 
  LogOut, 
  UserCheck,
  Calendar
} from "lucide-react";

export default function Navbar({
  activeTab,
  setActiveTab,
  anonymize,
  setAnonymize,
  theme,
  toggleTheme,
  onOpenConfig,
  onOpenPrivacy,
  onOpenNewStudent,
  highRiskCount,
  currentUser,
  onLogout
}) {
  return (
    <header className="glass-panel" style={{
      margin: "1rem 2rem 0",
      padding: "0.85rem 1.5rem",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      boxShadow: "0 2px 8px rgba(2, 132, 199, 0.06)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        
        {/* Brand */}
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
            <Compass size={24} color="#ffffff" />
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
                {currentUser?.role === "Student" ? "🎓 Student Academic Portal" : "Official Academic Support System"}
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
              {currentUser?.role === "Student"
                ? "Confidential Student Performance & Intervention Profile"
                : "Early Risk Identification & Human-in-the-Loop Intervention"}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          background: "#f0f9ff",
          padding: "0.3rem",
          borderRadius: "8px",
          border: "1px solid #bae6fd"
        }}>
          <button
            onClick={() => setActiveTab("dashboard")}
            style={{
              padding: "0.45rem 0.95rem",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.84rem",
              fontWeight: "600",
              cursor: "pointer",
              background: activeTab === "dashboard" ? "#0284c7" : "transparent",
              color: activeTab === "dashboard" ? "#ffffff" : "#475569",
              boxShadow: activeTab === "dashboard" ? "0 2px 6px rgba(2, 132, 199, 0.25)" : "none",
              transition: "all 0.18s"
            }}
          >
            {currentUser?.role === "Student" ? "My Dashboard" : "Cohort Dashboard"}
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            style={{
              padding: "0.45rem 0.95rem",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.84rem",
              fontWeight: "600",
              cursor: "pointer",
              background: activeTab === "calendar" ? "#0284c7" : "transparent",
              color: activeTab === "calendar" ? "#ffffff" : "#475569",
              boxShadow: activeTab === "calendar" ? "0 2px 6px rgba(2, 132, 199, 0.25)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              transition: "all 0.18s"
            }}
          >
            <Calendar size={15} />
            {currentUser?.role === "Student" ? "My Calendar" : "Intervention Calendar"}
          </button>
          <button
            onClick={() => setActiveTab("interventions")}
            style={{
              padding: "0.45rem 0.95rem",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.84rem",
              fontWeight: "600",
              cursor: "pointer",
              background: activeTab === "interventions" ? "#0284c7" : "transparent",
              color: activeTab === "interventions" ? "#ffffff" : "#475569",
              boxShadow: activeTab === "interventions" ? "0 2px 6px rgba(2, 132, 199, 0.25)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              transition: "all 0.18s"
            }}
          >
            {currentUser?.role === "Student" ? "My Interventions" : "Intervention Hub"}
            {highRiskCount > 0 && (
              <span style={{
                background: "#dc2626",
                color: "#ffffff",
                fontSize: "0.68rem",
                padding: "0.05rem 0.45rem",
                borderRadius: "9999px",
                fontWeight: "700"
              }}>
                {highRiskCount}
              </span>
            )}
          </button>
        </nav>

        {/* Quick Tools & Ethics Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          
          {/* Educator-Only Admin Controls */}
          {currentUser?.role !== "Student" && (
            <>
              {/* Privacy Anonymizer Toggle */}
              <button
                onClick={() => setAnonymize(!anonymize)}
                title={anonymize ? "FERPA Privacy Mode Active: Student names and IDs masked" : "Click to mask student names for FERPA privacy & unbiased evaluation"}
                className="btn-secondary"
                style={{
                  fontSize: "0.78rem",
                  padding: "0.45rem 0.75rem",
                  borderColor: anonymize ? "#059669" : "#cbd5e1",
                  background: anonymize ? "#ecfdf5" : "#ffffff",
                  color: anonymize ? "#047857" : "#334155"
                }}
              >
                {anonymize ? <EyeOff size={15} /> : <Eye size={15} />}
                <span>{anonymize ? "FERPA Masked" : "Mask PII"}</span>
              </button>

              {/* Model Weights Config */}
              <button
                onClick={onOpenConfig}
                title="Configure indicator weights & transparent scoring thresholds"
                className="btn-secondary"
                style={{ fontSize: "0.78rem", padding: "0.45rem 0.75rem" }}
              >
                <Sliders size={15} color="#0284c7" />
                <span>Algorithm Weights</span>
              </button>

              {/* Privacy & Governance Policy */}
              <button
                onClick={onOpenPrivacy}
                title="Student Data Governance & Ethical AI Constraints"
                className="btn-secondary"
                style={{ fontSize: "0.78rem", padding: "0.45rem 0.75rem" }}
              >
                <ShieldCheck size={15} color="#0284c7" />
                <span>Privacy & Ethics</span>
              </button>

              {/* Add Student */}
              <button
                onClick={onOpenNewStudent}
                className="btn-primary"
                style={{ fontSize: "0.78rem", padding: "0.45rem 0.85rem" }}
              >
                <UserPlus size={15} />
                <span>Add Student</span>
              </button>
            </>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="btn-ghost"
            title="Toggle Light / Dark mode"
            style={{ width: "36px", height: "36px" }}
          >
            {theme === "dark" ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#0284c7" />}
          </button>

          {/* User Profile Badge & Logout */}
          {currentUser && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              paddingLeft: "0.6rem",
              borderLeft: "1px solid #e2e8f0"
            }}>
              <div style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "#0284c7",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "0.76rem"
              }}>
                {currentUser.avatarInitials || "ED"}
              </div>
              <div style={{ display: "none", lgDisplay: "block" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#0f172a", lineHeight: 1.1 }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: "0.68rem", color: "#0284c7", fontWeight: "600" }}>
                  {currentUser.role}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Sign out of institutional session"
                className="btn-ghost"
                style={{ width: "34px", height: "34px", color: "#64748b" }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
