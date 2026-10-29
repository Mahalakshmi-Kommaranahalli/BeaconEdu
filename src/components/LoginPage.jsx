import React, { useState } from "react";
import { 
  Compass, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Users,
  GraduationCap,
  Building2
} from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState("Educator"); // "Educator", "Counselor", "Administrator"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg("");
  };

  // Helper to format a clean user display name from their entered email
  const formatNameFromEmail = (rawEmail) => {
    if (!rawEmail) return "Staff Member";
    const namePart = rawEmail.split("@")[0] || "";
    // Replace dots, underscores, dashes with space and capitalize each word
    const cleaned = namePart.replace(/[._-]+/g, " ").trim();
    if (!cleaned) return "Staff Member";
    return cleaned
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both your institutional email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const formattedName = formatNameFromEmail(email);
      let title = "Classroom Educator";
      if (role === "Counselor") {
        title = "Student Success & Guidance Counselor";
      } else if (role === "Administrator") {
        title = "Academic Administrator";
      }

      const user = {
        name: formattedName,
        email: email.trim(),
        role,
        title,
        avatarInitials: formattedName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        district: "Institutional Academic System"
      };

      onLogin(user);
      setLoading(false);
    }, 400);
  };

  const handleSsoLogin = (provider) => {
    setErrorMsg("");
    setLoading(true);
    setTimeout(() => {
      const defaultEmail = role === "Counselor" 
        ? "counselor.support@institution.edu" 
        : role === "Administrator" 
        ? "admin.services@institution.edu" 
        : "educator.portal@institution.edu";
        
      const formattedName = role === "Counselor" 
        ? "Guidance Counselor" 
        : role === "Administrator" 
        ? "Administrator" 
        : "Educator";

      onLogin({
        name: formattedName,
        email: defaultEmail,
        role,
        title: `${provider} Authenticated Staff`,
        avatarInitials: formattedName.slice(0, 2).toUpperCase(),
        district: "Institutional Academic System"
      });
      setLoading(false);
    }, 400);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#ffffff",
      overflow: "hidden"
    }}>
      
      {/* ============================================================ */}
      {/* LEFT SIDE: EDUCATIONAL RISK & INTERVENTION ANIMATED SHOWCASE */}
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

        {/* Ambient Glowing Orbs */}
        <div style={{
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)",
          filter: "blur(40px)"
        }} className="pulse-indicator" />

        <div style={{
          position: "absolute",
          bottom: "5%",
          left: "-8%",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%)",
          filter: "blur(50px)"
        }} className="pulse-indicator" />

        {/* Top Header on Left */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)"
            }}>
              <Compass size={28} color="#0284c7" />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: "800", letterSpacing: "-0.02em", color: "#ffffff" }}>
                BeaconEdu
              </div>
              <div style={{ fontSize: "0.78rem", color: "#bae6fd", letterSpacing: "0.03em", textTransform: "uppercase", fontWeight: "600" }}>
                Early Warning & Intervention Portal
              </div>
            </div>
          </div>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            background: "rgba(255, 255, 255, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(10px)",
            padding: "0.3rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.74rem",
            color: "#e0f2fe",
            fontWeight: "600"
          }}>
            <ShieldCheck size={14} color="#7dd3fc" /> Official District Multi-Signal Decision Support
          </div>

          <h2 style={{
            fontSize: "2.1rem",
            fontWeight: "800",
            lineHeight: 1.25,
            marginTop: "1.25rem",
            maxWidth: "520px",
            letterSpacing: "-0.02em",
            color: "#ffffff"
          }}>
            Supporting Students at Risk Before Academic Disengagement Occurs
          </h2>
          <p style={{
            fontSize: "0.92rem",
            color: "#e0f2fe",
            marginTop: "0.6rem",
            maxWidth: "480px",
            lineHeight: 1.55,
            opacity: 0.95
          }}>
            Synthesizes attendance dips, assignment pacing, formative assessment trends, and qualitative educator notes into actionable, explainable intervention workflows.
          </p>
        </div>

        {/* Center: Dynamic Animated Floating Metric & Risk Cards */}
        <div style={{ position: "relative", zIndex: 2, margin: "2rem 0" }}>
          
          {/* Floating Card 1: Early Warning Pulse */}
          <div className="float-card-1" style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(14px)",
            color: "#0f172a",
            borderRadius: "14px",
            padding: "1rem 1.25rem",
            maxWidth: "380px",
            boxShadow: "0 16px 36px rgba(0, 0, 0, 0.22)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            marginBottom: "1rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <span style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#dc2626",
                  boxShadow: "0 0 10px #dc2626"
                }} className="pulse-indicator" />
                <span style={{ fontSize: "0.76rem", fontWeight: "700", color: "#dc2626", textTransform: "uppercase" }}>
                  Early Alert Detected
                </span>
              </div>
              <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "600" }}>Live Signal</span>
            </div>
            <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "#0f172a" }}>
              Student Risk Synthesis Alert
            </div>
            <div style={{ fontSize: "0.76rem", color: "#475569", marginTop: "2px" }}>
              Attendance dropped below threshold · Consecutive missed submissions identified in formative coursework.
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "0.6rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid #e2e8f0",
              fontSize: "0.72rem"
            }}>
              <span style={{ color: "#0284c7", fontWeight: "700" }}>Strategy: 1-on-1 Mentorship Recommended</span>
              <span style={{ color: "#b91c1c", fontWeight: "700" }}>Score: 82%</span>
            </div>
          </div>

          {/* Floating Card 2: Trajectory & Recovery Wave */}
          <div className="float-card-2" style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(14px)",
            color: "#0f172a",
            borderRadius: "14px",
            padding: "1rem 1.25rem",
            maxWidth: "420px",
            marginLeft: "2.5rem",
            boxShadow: "0 18px 40px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            marginBottom: "1rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <TrendingUp size={16} color="#059669" />
                <span style={{ fontSize: "0.76rem", fontWeight: "700", color: "#059669", textTransform: "uppercase" }}>
                  Student Recovery Trajectory
                </span>
              </div>
              <span style={{
                background: "#ecfdf5",
                color: "#047857",
                fontSize: "0.68rem",
                fontWeight: "700",
                padding: "0.15rem 0.5rem",
                borderRadius: "9999px"
              }}>
                +22% Gain
              </span>
            </div>

            {/* Micro SVG Wave Progression */}
            <div style={{ marginTop: "0.6rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <svg width="180" height="42" viewBox="0 0 180 42">
                <path
                  d="M 5 36 Q 40 34, 70 28 T 130 14 T 175 6"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="5" cy="36" r="4" fill="#dc2626" />
                <circle cx="70" cy="28" r="4" fill="#d97706" />
                <circle cx="175" cy="6" r="5" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              </svg>
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#059669", lineHeight: 1 }}>
                  94.2%
                </div>
                <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "2px" }}>
                  Timely Intervention Recovery Rate
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card 3: Human-in-the-Loop Safeguard */}
          <div className="float-card-3" style={{
            background: "rgba(12, 38, 70, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(12px)",
            borderRadius: "10px",
            padding: "0.65rem 1rem",
            maxWidth: "360px",
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            color: "#ffffff"
          }}>
            <ShieldCheck size={20} color="#38bdf8" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "0.75rem", color: "#e0f2fe", lineHeight: 1.35 }}>
              <strong>Human-in-the-Loop Mandate:</strong> Advisory only. All decisions require educator review. Zero automated punitive grading.
            </span>
          </div>

        </div>

        {/* Bottom Left: Trust Badges */}
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
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#ffffff" }}>12,800+</div>
            <div style={{ fontSize: "0.7rem", color: "#bae6fd" }}>Learners Protected Early</div>
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#ffffff" }}>100%</div>
            <div style={{ fontSize: "0.7rem", color: "#bae6fd" }}>Explainable Multi-Factor AI</div>
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#ffffff" }}>FERPA</div>
            <div style={{ fontSize: "0.7rem", color: "#bae6fd" }}>Compliant Client Storage</div>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* RIGHT SIDE: OFFICIAL INSTITUTIONAL LOGIN PORTAL */}
      {/* ============================================================ */}
      <div style={{
        flex: "1",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "3.5rem 4rem",
        overflowY: "auto"
      }}>
        
        {/* Top District Seal Header */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Building2 size={20} color="#0284c7" />
              <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#0f172a", letterSpacing: "0.02em" }}>
                Academic Portal Authentication
              </span>
            </div>
            <span style={{
              background: "#e0f2fe",
              color: "#0369a1",
              border: "1px solid #bae6fd",
              padding: "0.2rem 0.55rem",
              borderRadius: "4px",
              fontSize: "0.7rem",
              fontWeight: "700"
            }}>
              SECURE SSO
            </span>
          </div>

          <div style={{ marginBottom: "1.75rem" }}>
            <h1 style={{ fontSize: "1.85rem", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.02em" }}>
              Educator Portal Sign In
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.35rem" }}>
              Please enter your institutional credentials to access student risk analytics and intervention workflows.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.76rem", fontWeight: "700", color: "#475569", marginBottom: "0.45rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Select Institutional Role
            </label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.5rem",
              background: "#f8fafc",
              padding: "0.35rem",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              {[
                { id: "Educator", label: "Educator", icon: GraduationCap },
                { id: "Counselor", label: "Counselor", icon: Users },
                { id: "Administrator", label: "Administrator", icon: ShieldCheck }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRoleChange(item.id)}
                    style={{
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.55rem 0.6rem",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                      background: isSelected ? "#0284c7" : "transparent",
                      color: isSelected ? "#ffffff" : "#64748b",
                      boxShadow: isSelected ? "0 2px 6px rgba(2, 132, 199, 0.25)" : "none",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
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
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem" }}>
                Institutional Email Address
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
                <Mail size={16} color="#64748b" style={{ marginRight: "0.6rem" }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your institutional email address"
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    fontSize: "0.85rem",
                    color: "#0f172a"
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: "700", color: "#334155" }}>
                  Account Password
                </label>
                <a href="#reset" onClick={(e) => { e.preventDefault(); alert("A password reset link will be sent to your institutional email."); }} style={{ fontSize: "0.72rem", color: "#0284c7", fontWeight: "600", textDecoration: "none" }}>
                  Forgot Password?
                </a>
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
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    fontSize: "0.85rem",
                    color: "#0f172a"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: "pointer", accentColor: "#0284c7" }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: "0.78rem", color: "#475569", cursor: "pointer", userSelect: "none" }}>
                Remember this certified workstation for 30 days
              </label>
            </div>

            {/* Submit Button */}
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
                <span>Authenticating Institutional Identity...</span>
              ) : (
                <>
                  <span>Sign In to Academic Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </form>

          {/* Institutional Single Sign-On */}
          <div style={{
            display: "flex",
            alignItems: "center",
            margin: "1.75rem 0 1.25rem",
            color: "#94a3b8",
            fontSize: "0.74rem"
          }}>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <span style={{ padding: "0 0.85rem", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: "600" }}>
              Institutional Single Sign-On
            </span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          {/* SSO Options */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
            
            <button
              type="button"
              onClick={() => handleSsoLogin("Google Workspace")}
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "0.6rem 0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontWeight: "600",
                color: "#334155",
                transition: "all 0.15s ease",
                boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0284c7"; e.currentTarget.style.background = "#f0f9ff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.background = "#ffffff"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google Edu SSO</span>
            </button>

            <button
              type="button"
              onClick={() => handleSsoLogin("Microsoft 365")}
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "0.6rem 0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontWeight: "600",
                color: "#334155",
                transition: "all 0.15s ease",
                boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0284c7"; e.currentTarget.style.background = "#f0f9ff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.background = "#ffffff"; }}
            >
              <svg width="16" height="16" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              <span>Microsoft 365</span>
            </button>

          </div>

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
            <Lock size={12} color="#059669" />
            <span>256-bit Encrypted SSL Session</span>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span>FERPA Compliant</span>
            <span>COPPA Safe</span>
            <span>Audit Logged</span>
          </div>
        </div>

      </div>

    </div>
  );
}
