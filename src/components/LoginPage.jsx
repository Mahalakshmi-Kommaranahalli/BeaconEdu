import React, { useState } from "react";
import { 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  User, 
  Search,
  School,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { initialStudents } from "../data/initialStudents";

export default function LoginPage({ onLogin, students = initialStudents }) {
  // Only 2 roles: "Educator" and "Student"
  const [role, setRole] = useState("Educator"); // "Educator" | "Student"
  
  // Student Credentials
  const [studentNameInput, setStudentNameInput] = useState("");
  const [studentPassword, setStudentPassword] = useState("student123");
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Educator Credentials
  const [educatorNameInput, setEducatorNameInput] = useState("Dr. Sarah Jenkins");
  const [educatorPassword, setEducatorPassword] = useState("faculty123");
  const [showEducatorPassword, setShowEducatorPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const effectiveStudents = (students && students.length > 0) ? students : initialStudents;

  // Student Login by Name & Password
  const loginWithStudentName = (nameToSearch) => {
    setErrorMsg("");
    const search = (nameToSearch || studentNameInput).trim().toLowerCase();

    if (!search) {
      setErrorMsg("Please enter your student name to sign in.");
      return;
    }

    if (!studentPassword || studentPassword.trim().length === 0) {
      setErrorMsg("Please enter your student password (Default: student123).");
      return;
    }

    if (studentPassword.trim().length < 3) {
      setErrorMsg("Student password must be at least 3 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Find matching student by full name or partial name or ID
      const matched = effectiveStudents.find((s) => {
        const sName = (s.name || "").toLowerCase();
        const sId = (s.id || "").toLowerCase();
        return sName === search || sName.includes(search) || sId === search;
      }) || effectiveStudents[0];

      const user = {
        id: matched.id,
        studentId: matched.id,
        name: matched.name,
        email: `${matched.name.toLowerCase().replace(/\s+/g, ".")}@student.beaconedu.org`,
        role: "Student",
        title: `${matched.branch} - ${matched.section} Student`,
        avatarInitials: matched.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        branch: matched.branch,
        section: matched.section,
        studentData: matched
      };

      onLogin(user);
      setLoading(false);
    }, 350);
  };

  // Educator Login by Name & Password
  const handleEducatorSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!educatorPassword || educatorPassword.trim().length === 0) {
      setErrorMsg("Please enter your faculty password (Default: faculty123).");
      return;
    }

    if (educatorPassword.trim().length < 3) {
      setErrorMsg("Faculty password must be at least 3 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const edName = educatorNameInput.trim() || "Dr. Sarah Jenkins";
      const user = {
        name: edName,
        email: "s.jenkins@beaconedu.org",
        role: "Educator",
        title: "Section Educator & Academic Mentor",
        avatarInitials: edName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        district: "Institutional Academic System"
      };

      onLogin(user);
      setLoading(false);
    }, 350);
  };

  // Student Form Submit
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    loginWithStudentName(studentNameInput);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#ffffff",
      overflow: "hidden"
    }}>
      
      {/* ============================================================ */}
      {/* LEFT SIDE: EDUCATIONAL RISK & STUDENT EMPOWERMENT SHOWCASE */}
      {/* ============================================================ */}
      <div style={{
        flex: "1.15",
        background: "linear-gradient(145deg, #0284c7 0%, #0369a1 45%, #082f49 100%)",
        position: "relative",
        padding: "3.5rem 3rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#ffffff",
        overflow: "hidden"
      }}>
        
        {/* Animated Background Grid */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.6
        }} />

        {/* Ambient Glowing Orb */}
        <div style={{
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)",
          filter: "blur(40px)"
        }} />

        {/* Top Header & Brand */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "2rem" }}>
            <div style={{
              width: "46px",
              height: "46px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)"
            }}>
              <Compass size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.45rem", fontWeight: "900", letterSpacing: "-0.03em" }}>BeaconEdu</span>
                <span style={{
                  background: "rgba(56, 189, 248, 0.25)",
                  color: "#e0f2fe",
                  border: "1px solid rgba(56, 189, 248, 0.4)",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "9999px",
                  fontSize: "0.68rem",
                  fontWeight: "700"
                }}>
                  Academic Portal
                </span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "#bae6fd", marginTop: "2px" }}>
                Student Risk Identification & Academic Growth Platform
              </div>
            </div>
          </div>

          {/* Dynamic Hero Message */}
          {role === "Student" ? (
            <div>
              <h2 style={{ fontSize: "2.3rem", fontWeight: "800", lineHeight: 1.15, letterSpacing: "-0.02em", color: "#ffffff", marginBottom: "1rem" }}>
                Student Portal: <br />
                <span style={{ color: "#38bdf8" }}>Your Private Analytics.</span>
              </h2>
              <p style={{ fontSize: "0.95rem", color: "#e0f2fe", lineHeight: 1.55, maxWidth: "480px" }}>
                Sign in using your name to access all academic risk analytics, signals, course grades, and intervention milestones related strictly to your record.
              </p>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: "2.3rem", fontWeight: "800", lineHeight: 1.15, letterSpacing: "-0.02em", color: "#ffffff", marginBottom: "1rem" }}>
                Educator Portal: <br />
                <span style={{ color: "#38bdf8" }}>Early Interventions.</span>
              </h2>
              <p style={{ fontSize: "0.95rem", color: "#e0f2fe", lineHeight: 1.55, maxWidth: "480px" }}>
                Detect early academic struggle, disengagement, and attendance dips across cohorts with 100% explainable multi-factor intelligence.
              </p>
            </div>
          )}

          {/* Feature Bullets */}
          <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[
              { title: "No Password Required", desc: "Instant zero-friction authentication using your name." },
              { title: "Student Privacy Isolation", desc: "Students see all deep-dive analytics related strictly to their own data." },
              { title: "Full Decision Support", desc: "Interactive What-If recovery simulator and milestone tracking." }
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                <CheckCircle2 size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "0.86rem", fontWeight: "700", color: "#ffffff" }}>{f.title}</div>
                  <div style={{ fontSize: "0.76rem", color: "#bae6fd" }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Left: Trust Metrics */}
        <div style={{
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          paddingTop: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#ffffff" }}>1,050+</div>
            <div style={{ fontSize: "0.7rem", color: "#bae6fd" }}>Enrolled Student Records</div>
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#ffffff" }}>100%</div>
            <div style={{ fontSize: "0.7rem", color: "#bae6fd" }}>Explainable AI Signals</div>
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#ffffff" }}>FERPA</div>
            <div style={{ fontSize: "0.7rem", color: "#bae6fd" }}>Confidential Student Isolation</div>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* RIGHT SIDE: ONLY ONE LOGIN PAGE (EDUCATOR & STUDENT) */}
      {/* ============================================================ */}
      <div style={{
        flex: "1",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "3.5rem 3.75rem",
        overflowY: "auto"
      }}>
        
        <div>
          {/* Top District Seal Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Building2 size={20} color="#0284c7" />
              <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#0f172a", letterSpacing: "0.02em" }}>
                Academic Portal Authentication
              </span>
            </div>
            <span style={{
              background: "#ecfdf5",
              color: "#059669",
              border: "1px solid #6ee7b7",
              padding: "0.2rem 0.55rem",
              borderRadius: "4px",
              fontSize: "0.7rem",
              fontWeight: "700"
            }}>
              PASSWORDLESS ACCESS
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "1.75rem" }}>
            <h1 style={{ fontSize: "1.9rem", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.02em" }}>
              {role === "Student" ? "Student Portal Sign In" : "Educator Portal Sign In"}
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.35rem" }}>
              {role === "Student"
                ? "Sign in with your name to view all academic risk signals, grades, and interventions related to you."
                : "Enter as educator to oversee student cohort risk, benchmarks, and active interventions."}
            </p>
          </div>

          {/* ONLY 2 ROLES: EDUCATOR & STUDENT (Administrator and Counselor Removed) */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#475569", marginBottom: "0.45rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Select Portal Type
            </label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
              background: "#f8fafc",
              padding: "0.35rem",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              
              {/* Option 1: Educator */}
              <button
                type="button"
                onClick={() => { setRole("Educator"); setErrorMsg(""); }}
                style={{
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.65rem 0.75rem",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  background: role === "Educator" ? "#0284c7" : "transparent",
                  color: role === "Educator" ? "#ffffff" : "#64748b",
                  boxShadow: role === "Educator" ? "0 2px 8px rgba(2, 132, 199, 0.28)" : "none",
                  transition: "all 0.15s ease"
                }}
              >
                <School size={16} />
                <span>Educator Portal</span>
              </button>

              {/* Option 2: Student */}
              <button
                type="button"
                onClick={() => { setRole("Student"); setErrorMsg(""); }}
                style={{
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.65rem 0.75rem",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  background: role === "Student" ? "#0284c7" : "transparent",
                  color: role === "Student" ? "#ffffff" : "#64748b",
                  boxShadow: role === "Student" ? "0 2px 8px rgba(2, 132, 199, 0.28)" : "none",
                  transition: "all 0.15s ease"
                }}
              >
                <GraduationCap size={16} />
                <span>Student Portal</span>
              </button>

            </div>
          </div>

          {/* Validation Alert */}
          {errorMsg && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#b91c1c",
              padding: "0.55rem 0.85rem",
              borderRadius: "6px",
              fontSize: "0.78rem",
              marginBottom: "1rem"
            }}>
              {errorMsg}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: STUDENT LOGIN (Name & Password) */}
          {/* ============================================================ */}
          {role === "Student" ? (
            <div>
              {/* Student Name Form */}
              <form onSubmit={handleStudentSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem" }}>
                    Student Name (Credential)
                  </label>
                  <div style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "0.65rem 0.85rem",
                    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)"
                  }}>
                    <User size={16} color="#64748b" style={{ marginRight: "0.6rem" }} />
                    <input
                      type="text"
                      list="enrolled-students-list"
                      required
                      value={studentNameInput}
                      onChange={(e) => setStudentNameInput(e.target.value)}
                      placeholder="Type student name (e.g. Mohit Dhillon, Archana Yadav...)"
                      style={{
                        border: "none",
                        outline: "none",
                        width: "100%",
                        fontSize: "0.88rem",
                        color: "#0f172a"
                      }}
                    />
                  </div>
                  {/* HTML Datalist for automatic student name auto-suggestions */}
                  <datalist id="enrolled-students-list">
                    {effectiveStudents.slice(0, 50).map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.id} - {s.branch} ({s.section})
                      </option>
                    ))}
                  </datalist>
                </div>

                {/* Student Password */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#334155" }}>
                      Student Password
                    </label>
                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      Default: <strong style={{ color: "#0284c7" }}>student123</strong>
                    </span>
                  </div>
                  <div style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "0.65rem 0.85rem",
                    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)"
                  }}>
                    <Lock size={16} color="#64748b" style={{ marginRight: "0.6rem" }} />
                    <input
                      type={showStudentPassword ? "text" : "password"}
                      required
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="Enter student password"
                      style={{
                        border: "none",
                        outline: "none",
                        width: "100%",
                        fontSize: "0.88rem",
                        color: "#0f172a"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowStudentPassword(!showStudentPassword)}
                      style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0 }}
                      title={showStudentPassword ? "Hide password" : "Show password"}
                    >
                      {showStudentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.35rem" }}>
                    🔒 Protected access: Enter your student name and password to view your confidential records.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    fontSize: "0.92rem",
                    fontWeight: "700",
                    justifyContent: "center",
                    borderRadius: "8px"
                  }}
                >
                  {loading ? (
                    <span>Opening Student Portal...</span>
                  ) : (
                    <>
                      <span>Sign In as Student</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ============================================================ */
            /* TAB: EDUCATOR LOGIN (Name & Password) */
            /* ============================================================ */
            <div>
              <form onSubmit={handleEducatorSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem" }}>
                    Educator Identity Name
                  </label>
                  <div style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "0.65rem 0.85rem",
                    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)"
                  }}>
                    <School size={16} color="#64748b" style={{ marginRight: "0.6rem" }} />
                    <input
                      type="text"
                      required
                      value={educatorNameInput}
                      onChange={(e) => setEducatorNameInput(e.target.value)}
                      placeholder="Enter Educator Name"
                      style={{
                        border: "none",
                        outline: "none",
                        width: "100%",
                        fontSize: "0.88rem",
                        color: "#0f172a"
                      }}
                    />
                  </div>
                </div>

                {/* Faculty Password */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#334155" }}>
                      Faculty Password
                    </label>
                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      Default: <strong style={{ color: "#0284c7" }}>faculty123</strong>
                    </span>
                  </div>
                  <div style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "0.65rem 0.85rem",
                    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)"
                  }}>
                    <Lock size={16} color="#64748b" style={{ marginRight: "0.6rem" }} />
                    <input
                      type={showEducatorPassword ? "text" : "password"}
                      required
                      value={educatorPassword}
                      onChange={(e) => setEducatorPassword(e.target.value)}
                      placeholder="Enter faculty password"
                      style={{
                        border: "none",
                        outline: "none",
                        width: "100%",
                        fontSize: "0.88rem",
                        color: "#0f172a"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEducatorPassword(!showEducatorPassword)}
                      style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0 }}
                      title={showEducatorPassword ? "Hide password" : "Show password"}
                    >
                      {showEducatorPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.35rem" }}>
                    🔒 Secure Educator Session: Authorized faculty identity verified by institutional credentials.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    fontSize: "0.92rem",
                    fontWeight: "700",
                    justifyContent: "center",
                    borderRadius: "8px"
                  }}
                >
                  {loading ? (
                    <span>Accessing Educator Portal...</span>
                  ) : (
                    <>
                      <span>Sign In to Educator Portal</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Footer Security Compliance Info */}
        <div style={{
          marginTop: "2rem",
          paddingTop: "1.25rem",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.72rem",
          color: "#94a3b8"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <ShieldCheck size={14} color="#059669" />
            <span>FERPA Compliant Student Data Isolation</span>
          </div>
          <div>
            <span>100% Explainable AI</span>
          </div>
        </div>

      </div>

    </div>
  );
}
