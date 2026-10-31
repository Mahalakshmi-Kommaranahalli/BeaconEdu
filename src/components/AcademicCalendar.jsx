import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  X,
  Sparkles, 
  BookOpen, 
  CalendarCheck,
  AlertTriangle,
  Send,
  Edit2,
  Trash2,
  ShieldCheck,
  Bell,
  HelpCircle
} from "lucide-react";

// Conflict Checker: Returns existing event if date & time are identical
export function findMeetingConflict(eventsList, targetDate, targetTime, ignoreEventId = null) {
  if (!targetDate || !targetTime) return null;
  const tDate = targetDate.trim();
  const tTime = targetTime.trim().toUpperCase();

  return eventsList.find((evt) => {
    if (ignoreEventId && evt.id === ignoreEventId) return false;
    if (evt.status === "Cancelled") return false;
    const evtDate = (evt.date || "").trim();
    const evtTime = (evt.time || "").trim().toUpperCase();
    return evtDate === tDate && evtTime === tTime;
  }) || null;
}

export default function AcademicCalendar({
  students,
  risks,
  anonymize,
  onSelectStudent,
  currentUser
}) {
  const isStudent = currentUser?.role === "Student";
  const currentStudent = isStudent ? (students[0] || null) : null;

  // Calendar current view date
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 29)); // Oct 29, 2026
  const [selectedDate, setSelectedDate] = useState("2026-10-29");
  const [filterSection, setFilterSection] = useState("ALL");

  // Modals state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // For rescheduling
  const [acceptingRequest, setAcceptingRequest] = useState(null); // For accepting emergency request

  // Validation / Conflict Error states
  const [conflictError, setConflictError] = useState("");
  const [editConflictError, setEditConflictError] = useState("");
  const [acceptConflictError, setAcceptConflictError] = useState("");

  // Persistent Calendar Events
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("beaconedu_calendar_events_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "EVT-1",
        studentId: "STU-1003",
        studentName: "Devon Miller",
        section: "Section C",
        date: "2026-10-29",
        time: "09:30 AM",
        type: "Math Intervention & Graduation Review",
        riskTier: "High Risk",
        status: "Scheduled",
        facultyName: "Dr. Sarah Jenkins",
        notes: "Senior graduation milestone recovery and Algebra remediation."
      },
      {
        id: "EVT-2",
        studentId: "STU-1001",
        studentName: "Mohit Dhillon",
        section: "Section A",
        date: "2026-10-29",
        time: "02:00 PM",
        type: "Attendance Conference & Lab Catchup",
        riskTier: "High Risk",
        status: "Scheduled",
        facultyName: "Dr. Sarah Jenkins",
        notes: "Attendance follow-up and pending DSA lab assignments."
      },
      {
        id: "EVT-3",
        studentId: "STU-1004",
        studentName: "Jordan Lee",
        section: "Section A",
        date: "2026-10-30",
        time: "10:15 AM",
        type: "Executive Function & Homework Support",
        riskTier: "High Risk",
        status: "Scheduled",
        facultyName: "Dr. Sarah Jenkins",
        notes: "Missing assignments review and low-distraction study schedule."
      },
      {
        id: "EVT-4",
        studentId: "STU-1005",
        studentName: "Sneha Patil",
        section: "Section B",
        date: "2026-10-31",
        time: "11:00 AM",
        type: "Targeted Electronics Lab Catch-up",
        riskTier: "Moderate Risk",
        status: "Scheduled",
        facultyName: "Dr. Sarah Jenkins",
        notes: "Review missing lab experiments before semester mid-point."
      },
      {
        id: "EVT-5",
        studentId: "STU-1002",
        studentName: "Archana Yadav",
        section: "Section A",
        date: "2026-11-02",
        time: "01:30 PM",
        type: "Peer Study Group Placement",
        riskTier: "Moderate Risk",
        status: "Scheduled",
        facultyName: "Dr. Sarah Jenkins",
        notes: "Connecting Archana with high-achieving peer mentor in DBMS."
      },
      {
        id: "EVT-6",
        studentId: "STU-1001",
        studentName: "Mohit Dhillon",
        section: "Section A",
        date: "2026-12-05",
        time: "12:00 PM",
        type: "Comprehensive Midterm Progress & Recovery",
        riskTier: "High Risk",
        status: "Scheduled",
        facultyName: "Dr. Sarah Jenkins",
        notes: "Fixed December review session. Slot reserved."
      }
    ];
  });

  // Persistent Emergency Meeting Requests from Students
  const [emergencyRequests, setEmergencyRequests] = useState(() => {
    const saved = localStorage.getItem("beaconedu_emergency_requests");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "EMG-101",
        studentId: "STU-1001",
        studentName: "Mohit Dhillon",
        section: "Section A",
        category: "Academic Emergency - Lab Recursion Exam",
        urgency: "Immediate",
        preferredDate: "2026-12-05",
        preferredTime: "12:00 PM",
        message: "I urgently need guidance on the DSA recursion assignment before the grading portal closes.",
        status: "Pending",
        createdAt: "2026-10-30"
      }
    ];
  });

  // Persist events
  useEffect(() => {
    localStorage.setItem("beaconedu_calendar_events_v2", JSON.stringify(events));
  }, [events]);

  // Persist emergency requests
  useEffect(() => {
    localStorage.setItem("beaconedu_emergency_requests", JSON.stringify(emergencyRequests));
  }, [emergencyRequests]);

  // Form state for scheduling new intervention (Faculty)
  const [newStudentId, setNewStudentId] = useState(students[0]?.id || "");
  const [newDate, setNewDate] = useState("2026-10-29");
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newType, setNewType] = useState("1-on-1 Academic Tutoring");
  const [newNotes, setNewNotes] = useState("");

  // Form state for Emergency Request (Student)
  const [emgCategory, setEmgCategory] = useState("Academic Emergency - Failed Assessment / Doubt");
  const [emgUrgency, setEmgUrgency] = useState("Immediate");
  const [emgDate, setEmgDate] = useState("2026-11-05");
  const [emgTime, setEmgTime] = useState("11:30 AM");
  const [emgMessage, setEmgMessage] = useState("");
  const [emgSuccessMsg, setEmgSuccessMsg] = useState("");

  // State for Rescheduling Modal (Faculty)
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editType, setEditType] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // State for Accepting Emergency Request Modal (Faculty)
  const [acceptDate, setAcceptDate] = useState("");
  const [acceptTime, setAcceptTime] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const setToday = () => {
    setCurrentDate(new Date(2026, 9, 29));
    setSelectedDate("2026-10-29");
  };

  // Filter events:
  // If user is a student: strictly only show events for this student!
  // If user is faculty: filter by section dropdown if set
  const filteredEvents = events.filter((evt) => {
    if (isStudent && currentStudent) {
      const matchId = evt.studentId === currentStudent.id;
      const matchName = evt.studentName?.toLowerCase() === currentStudent.name?.toLowerCase();
      if (!matchId && !matchName) return false;
    }
    if (!isStudent && filterSection !== "ALL" && evt.section !== filterSection) {
      return false;
    }
    return true;
  });

  // Filter emergency requests:
  const studentEmergencyRequests = emergencyRequests.filter((req) => {
    if (isStudent && currentStudent) {
      return req.studentId === currentStudent.id || req.studentName?.toLowerCase() === currentStudent.name?.toLowerCase();
    }
    return true;
  });

  const pendingEmergencyRequests = emergencyRequests.filter((req) => req.status === "Pending");

  // Events for currently selected date
  const selectedDateEvents = filteredEvents.filter((evt) => evt.date === selectedDate);

  // Orderwise agenda events
  const orderwiseEvents = [...filteredEvents].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  // Faculty: Handle Scheduling New Intervention (with Conflict Prevention)
  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    setConflictError("");

    const targetStudent = students.find((s) => s.id === newStudentId) || students[0];
    if (!targetStudent) return;

    // Check conflict: Has faculty already booked this date & time?
    const conflict = findMeetingConflict(events, newDate, newTime);
    if (conflict) {
      setConflictError(
        `⚠️ Time Slot Conflict: Faculty Dr. Sarah Jenkins is already booked on ${newDate} at ${newTime} with ${conflict.studentName} (${conflict.section} • ${conflict.type}). You cannot book duplicate slots. Please choose another time.`
      );
      return;
    }

    const risk = risks[targetStudent.id];
    const newEvent = {
      id: `EVT-${Date.now()}`,
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      section: targetStudent.section || "Section A",
      date: newDate,
      time: newTime,
      type: newType,
      riskTier: risk?.riskTier || "Moderate Risk",
      status: "Scheduled",
      facultyName: "Dr. Sarah Jenkins",
      notes: newNotes.trim() || "Targeted academic counselling session"
    };

    setEvents((prev) => [newEvent, ...prev]);
    setSelectedDate(newDate);
    setShowScheduleModal(false);
    setNewNotes("");
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  // Faculty: Open Reschedule / Edit Modal
  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setEditDate(evt.date);
    setEditTime(evt.time);
    setEditType(evt.type);
    setEditNotes(evt.notes || "");
    setEditConflictError("");
  };

  // Faculty: Save Rescheduled Meeting (with Conflict Prevention)
  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    setEditConflictError("");

    // Conflict check on new date and time (ignoring current event itself)
    const conflict = findMeetingConflict(events, editDate, editTime, editingEvent.id);
    if (conflict) {
      setEditConflictError(
        `⚠️ Time Slot Conflict: Faculty is already booked on ${editDate} at ${editTime} with ${conflict.studentName} (${conflict.section}). Please choose a different open time slot.`
      );
      return;
    }

    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === editingEvent.id
          ? {
              ...evt,
              date: editDate,
              time: editTime,
              type: editType,
              notes: editNotes,
              status: "Rescheduled"
            }
          : evt
      )
    );

    setSelectedDate(editDate);
    setEditingEvent(null);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  // Faculty: Cancel an Event
  const handleDeleteEvent = (id) => {
    if (window.confirm("Are you sure you want to cancel this scheduled session? This will free up the time slot.")) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Faculty: Toggle Event Completed
  const toggleEventStatus = (id) => {
    if (isStudent) return; // Students cannot change event status!
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === id
          ? { ...evt, status: evt.status === "Completed" ? "Scheduled" : "Completed" }
          : evt
      )
    );
  };

  // Student: Send Emergency Meeting Request
  const handleEmergencySubmit = (e) => {
    e.preventDefault();
    if (!currentStudent) return;

    const newReq = {
      id: `EMG-${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      section: currentStudent.section || "Section A",
      category: emgCategory,
      urgency: emgUrgency,
      preferredDate: emgDate,
      preferredTime: emgTime,
      message: emgMessage.trim(),
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setEmergencyRequests((prev) => [newReq, ...prev]);
    setEmgSuccessMsg("Emergency request submitted successfully to faculty Dr. Sarah Jenkins. Faculty will review and confirm an open time slot.");
    setEmgMessage("");
    setTimeout(() => {
      setEmgSuccessMsg("");
      setShowEmergencyModal(false);
    }, 2200);
  };

  // Faculty: Open Accept Emergency Request Modal
  const openAcceptModal = (req) => {
    setAcceptingRequest(req);
    setAcceptDate(req.preferredDate || "2026-10-30");
    setAcceptTime(req.preferredTime || "12:00 PM");
    setAcceptConflictError("");
  };

  // Faculty: Confirm Accept Emergency Request & Schedule (with Conflict Prevention)
  const handleAcceptEmergency = (e) => {
    e.preventDefault();
    if (!acceptingRequest) return;
    setAcceptConflictError("");

    // Conflict check
    const conflict = findMeetingConflict(events, acceptDate, acceptTime);
    if (conflict) {
      setAcceptConflictError(
        `⚠️ Time Slot Conflict: You are already booked on ${acceptDate} at ${acceptTime} with ${conflict.studentName} (${conflict.section} • ${conflict.type}). Please select another time to schedule this emergency meeting.`
      );
      return;
    }

    // Add new scheduled meeting
    const newEvent = {
      id: `EVT-EMG-${Date.now()}`,
      studentId: acceptingRequest.studentId,
      studentName: acceptingRequest.studentName,
      section: acceptingRequest.section,
      date: acceptDate,
      time: acceptTime,
      type: `🚨 Emergency: ${acceptingRequest.category}`,
      riskTier: "High Risk",
      status: "Scheduled",
      facultyName: "Dr. Sarah Jenkins",
      notes: `Accepted emergency request: "${acceptingRequest.message}"`
    };

    setEvents((prev) => [newEvent, ...prev]);

    // Update request status to Accepted
    setEmergencyRequests((prev) =>
      prev.map((r) =>
        r.id === acceptingRequest.id
          ? { ...r, status: "Accepted", scheduledDate: acceptDate, scheduledTime: acceptTime }
          : r
      )
    );

    setSelectedDate(acceptDate);
    setAcceptingRequest(null);
    confetti({ particleCount: 80, spread: 75, origin: { y: 0.6 } });
  };

  // Faculty: Decline Emergency Request
  const handleDeclineEmergency = (reqId) => {
    if (window.confirm("Decline this emergency request with notification to student?")) {
      setEmergencyRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status: "Declined" } : r))
      );
    }
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "1rem auto 3rem", padding: "0 1rem" }}>
      
      {/* ============================================================ */}
      {/* TOP HEADER & CONTROLS */}
      {/* ============================================================ */}
      <div className="glass-panel" style={{
        padding: "1.25rem 1.75rem",
        marginBottom: "1.5rem",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
        background: "#ffffff",
        border: "1px solid #e2e8f0"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: isStudent ? "#ecfdf5" : "#e0f2fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isStudent ? "#059669" : "#0284c7"
            }}>
              <CalendarIcon size={20} />
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a" }}>
              {isStudent ? "My Academic Counselling & Intervention Schedule" : "Intervention & Risk Review Calendar"}
            </h2>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "3px" }}>
            {isStudent
              ? "Confidential view of your scheduled faculty meetings and emergency support requests. Read-only view."
              : "Faculty scheduling studio with automatic double-booking collision prevention and emergency student response."}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          
          {/* Section filter (Faculty only) */}
          {!isStudent && (
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "0.82rem",
                background: "#ffffff",
                color: "#1e293b",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              <option value="ALL">All Sections (Overview)</option>
              <option value="Section A">Section A Calendar</option>
              <option value="Section B">Section B Calendar</option>
              <option value="Section C">Section C Calendar</option>
              <option value="Section D">Section D Calendar</option>
            </select>
          )}

          {/* Student Action: Send Emergency Request */}
          {isStudent ? (
            <button
              onClick={() => { setShowEmergencyModal(true); setEmgSuccessMsg(""); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "0.55rem 1.15rem",
                fontSize: "0.84rem",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)"
              }}
            >
              <AlertCircle size={16} />
              <span>🚨 Request Emergency Faculty Meeting</span>
            </button>
          ) : (
            /* Faculty Action: Schedule Intervention Session */
            <button
              onClick={() => { setShowScheduleModal(true); setConflictError(""); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "0.55rem 1.15rem",
                fontSize: "0.84rem",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(2, 132, 199, 0.28)"
              }}
            >
              <Plus size={16} />
              <span>Schedule Counselling / Meeting</span>
            </button>
          )}

        </div>
      </div>

      {/* ============================================================ */}
      {/* EMERGENCY REQUESTS INBOX (FACULTY & STUDENT VIEWS) */}
      {/* ============================================================ */}
      {!isStudent && pendingEmergencyRequests.length > 0 && (
        <div style={{
          background: "#fff1f2",
          border: "1px solid #fecdd3",
          borderRadius: "10px",
          padding: "1.25rem",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 6px rgba(225, 29, 72, 0.08)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>🚨</span>
              <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#9f1239" }}>
                Pending Student Emergency Meeting Requests ({pendingEmergencyRequests.length})
              </h3>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#be123c", fontWeight: "700", background: "#ffe4e6", padding: "0.2rem 0.6rem", borderRadius: "9999px" }}>
              Action Required: Conflict Prevention Enforced
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "0.85rem" }}>
            {pendingEmergencyRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #fca5a5",
                  borderRadius: "8px",
                  padding: "0.95rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>{req.studentName}</strong>
                    <span style={{ fontSize: "0.72rem", color: "#64748b", marginLeft: "0.4rem" }}>({req.studentId} • {req.section})</span>
                  </div>
                  <span style={{
                    background: "#fee2e2",
                    color: "#b91c1c",
                    fontSize: "0.68rem",
                    fontWeight: "800",
                    padding: "0.15rem 0.45rem",
                    borderRadius: "4px"
                  }}>
                    {req.urgency}
                  </span>
                </div>

                <div style={{ fontSize: "0.78rem", color: "#0284c7", fontWeight: "700", marginBottom: "0.35rem" }}>
                  {req.category}
                </div>

                <p style={{ fontSize: "0.78rem", color: "#334155", background: "#f8fafc", padding: "0.45rem 0.65rem", borderRadius: "6px", marginBottom: "0.6rem", fontStyle: "italic" }}>
                  "{req.message}"
                </p>

                <div style={{ fontSize: "0.74rem", color: "#64748b", marginBottom: "0.75rem" }}>
                  Requested: <strong>{req.preferredDate} at {req.preferredTime}</strong>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => openAcceptModal(req)}
                    className="btn-primary"
                    style={{ flex: 1, fontSize: "0.75rem", padding: "0.4rem", justifyContent: "center" }}
                  >
                    Accept & Schedule
                  </button>
                  <button
                    onClick={() => handleDeclineEmergency(req.id)}
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "0.4rem 0.75rem",
                      fontSize: "0.74rem",
                      cursor: "pointer",
                      color: "#475569"
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student View: Student's Emergency Requests Status */}
      {isStudent && studentEmergencyRequests.length > 0 && (
        <div style={{
          background: "#f0f9ff",
          border: "1px solid #bae6fd",
          borderRadius: "10px",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem"
        }}>
          <h4 style={{ fontSize: "0.88rem", fontWeight: "800", color: "#0369a1", marginBottom: "0.5rem" }}>
            My Emergency Requests to Faculty ({studentEmergencyRequests.length})
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {studentEmergencyRequests.map((r) => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", padding: "0.55rem 0.85rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem" }}>
                <div>
                  <strong>{r.category}</strong>: "{r.message}"
                  <span style={{ color: "#64748b", marginLeft: "0.5rem" }}>(Requested: {r.preferredDate} at {r.preferredTime})</span>
                </div>
                <span style={{
                  padding: "0.15rem 0.55rem",
                  borderRadius: "9999px",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  background: r.status === "Accepted" ? "#ecfdf5" : r.status === "Pending" ? "#fffbeb" : "#fef2f2",
                  color: r.status === "Accepted" ? "#059669" : r.status === "Pending" ? "#d97706" : "#dc2626",
                  border: `1px solid ${r.status === "Accepted" ? "#6ee7b7" : r.status === "Pending" ? "#fcd34d" : "#fca5a5"}`
                }}>
                  {r.status === "Accepted" ? `Accepted (Scheduled ${r.scheduledDate || r.preferredDate} at ${r.scheduledTime || r.preferredTime})` : r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MAIN GRID: CALENDAR ON LEFT, ORDERWISE AGENDA ON RIGHT */}
      {/* ============================================================ */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "1.5rem" }}>
        
        {/* LEFT: Calendar Grid */}
        <div className="glass-panel" style={{
          padding: "1.5rem",
          background: "#ffffff",
          border: "1px solid #e2e8f0"
        }}>
          
          {/* Calendar Month Controls */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
            paddingBottom: "0.85rem",
            borderBottom: "1px solid #e2e8f0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a" }}>
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={setToday}
                style={{
                  background: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  color: "#0369a1",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  cursor: "pointer"
                }}
              >
                Today (Oct 29)
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <button
                onClick={prevMonth}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  padding: "0.35rem 0.6rem",
                  cursor: "pointer",
                  color: "#475569"
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextMonth}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  padding: "0.35rem 0.6rem",
                  cursor: "pointer",
                  color: "#475569"
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Days of Week Headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            textAlign: "center",
            fontWeight: "700",
            fontSize: "0.75rem",
            color: "#64748b",
            marginBottom: "0.5rem"
          }}>
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          {/* Days Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "5px"
          }}>
            {/* Blank padding cells */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`blank-${idx}`} style={{ height: "72px", background: "#f8fafc", borderRadius: "6px", opacity: 0.5 }} />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === "2026-10-29";
              const dayEvents = filteredEvents.filter((e) => e.date === dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    height: "72px",
                    background: isSelected ? "#e0f2fe" : "#ffffff",
                    border: `1px solid ${isSelected ? "#0284c7" : "#e2e8f0"}`,
                    borderRadius: "6px",
                    padding: "4px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected ? "0 2px 6px rgba(2, 132, 199, 0.2)" : "none"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      fontSize: "0.76rem",
                      fontWeight: isToday || isSelected ? "800" : "600",
                      color: isToday ? "#0284c7" : "#1e293b",
                      width: isToday ? "20px" : "auto",
                      height: isToday ? "20px" : "auto",
                      background: isToday ? "#bae6fd" : "transparent",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span style={{
                        background: "#0284c7",
                        color: "#ffffff",
                        fontSize: "0.6rem",
                        padding: "0 0.35rem",
                        borderRadius: "9999px",
                        fontWeight: "700"
                      }}>
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Tiny Event Pills */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        title={`${evt.time}: ${evt.studentName} (${evt.type})`}
                        style={{
                          fontSize: "0.62rem",
                          background: evt.status === "Completed" ? "#ecfdf5" : "#f0f9ff",
                          color: evt.status === "Completed" ? "#047857" : "#0369a1",
                          borderLeft: `2px solid ${evt.status === "Completed" ? "#10b981" : "#0284c7"}`,
                          padding: "1px 3px",
                          borderRadius: "2px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {evt.time} {evt.studentName.split(" ")[0]}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span style={{ fontSize: "0.58rem", color: "#64748b" }}>+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Busy Times / Conflict Prevention Legend */}
          <div style={{
            marginTop: "1.25rem",
            paddingTop: "0.85rem",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
            fontSize: "0.72rem",
            color: "#64748b"
          }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ width: "8px", height: "8px", background: "#0284c7", borderRadius: "2px" }} />
                Scheduled Meeting
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "2px" }} />
                Completed
              </span>
            </div>
            <span style={{ fontWeight: "600", color: "#0369a1" }}>
              🔒 Double-booking collision lock active
            </span>
          </div>

        </div>

        {/* RIGHT: Selected Date Sessions & Agenda */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* Selected Date Card */}
          <div className="glass-panel" style={{ padding: "1.25rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <Clock size={16} color="#0284c7" />
                <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
                  Sessions for {selectedDate}
                </h4>
              </div>
              <span style={{ fontSize: "0.74rem", background: "#f0f9ff", color: "#0284c7", fontWeight: "700", padding: "0.15rem 0.55rem", borderRadius: "4px" }}>
                {selectedDateEvents.length} Sessions
              </span>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "#64748b", fontSize: "0.8rem", background: "#f8fafc", borderRadius: "8px" }}>
                No counselling sessions booked on this date. Faculty time is free and available for scheduling.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {selectedDateEvents.map((evt) => (
                  <div
                    key={evt.id}
                    style={{
                      background: evt.status === "Completed" ? "#f0fdf4" : "#ffffff",
                      border: `1px solid ${evt.status === "Completed" ? "#bbf7d0" : "#cbd5e1"}`,
                      borderRadius: "8px",
                      padding: "0.75rem 0.85rem",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.3rem" }}>
                      <div>
                        <div style={{ fontSize: "0.84rem", fontWeight: "800", color: "#0f172a" }}>
                          {evt.time} — {evt.studentName}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#0284c7", fontWeight: "600" }}>
                          {evt.type}
                        </div>
                      </div>
                      <span style={{
                        fontSize: "0.68rem",
                        padding: "0.15rem 0.45rem",
                        borderRadius: "4px",
                        fontWeight: "700",
                        background: evt.status === "Completed" ? "#dcfce7" : "#e0f2fe",
                        color: evt.status === "Completed" ? "#15803d" : "#0369a1"
                      }}>
                        {evt.status}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.74rem", color: "#475569", marginBottom: "0.5rem" }}>
                      {evt.notes}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "0.45rem" }}>
                      <span style={{ fontSize: "0.68rem", color: "#64748b" }}>
                        Section: {evt.section}
                      </span>
                      
                      {/* Faculty controls: Reschedule / Complete / Delete */}
                      {!isStudent && (
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button
                            onClick={() => openEditModal(evt)}
                            title="Reschedule this session to another time"
                            style={{
                              background: "#f0f9ff",
                              border: "1px solid #bae6fd",
                              color: "#0369a1",
                              borderRadius: "4px",
                              padding: "0.2rem 0.45rem",
                              fontSize: "0.68rem",
                              fontWeight: "700",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.2rem"
                            }}
                          >
                            <Edit2 size={11} /> Reschedule
                          </button>
                          <button
                            onClick={() => toggleEventStatus(evt.id)}
                            style={{
                              background: evt.status === "Completed" ? "#f1f5f9" : "#ecfdf5",
                              border: `1px solid ${evt.status === "Completed" ? "#cbd5e1" : "#6ee7b7"}`,
                              color: evt.status === "Completed" ? "#475569" : "#059669",
                              borderRadius: "4px",
                              padding: "0.2rem 0.45rem",
                              fontSize: "0.68rem",
                              fontWeight: "700",
                              cursor: "pointer"
                            }}
                          >
                            {evt.status === "Completed" ? "Mark Pending" : "Complete"}
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            title="Cancel meeting"
                            style={{
                              background: "none",
                              border: "none",
                              color: "#94a3b8",
                              cursor: "pointer",
                              padding: "0 0.2rem"
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orderwise Agenda List */}
          <div className="glass-panel" style={{ padding: "1.25rem", background: "#ffffff", border: "1px solid #e2e8f0", flex: 1 }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.75rem" }}>
              Orderwise Agenda (Upcoming & Recent)
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", maxHeight: "320px", overflowY: "auto" }}>
              {orderwiseEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedDate(evt.date)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "6px",
                    border: `1px solid ${evt.date === selectedDate ? "#0284c7" : "#e2e8f0"}`,
                    background: evt.date === selectedDate ? "#f0f9ff" : "#f8fafc",
                    cursor: "pointer",
                    fontSize: "0.78rem"
                  }}
                >
                  <div>
                    <strong style={{ color: "#0f172a" }}>{evt.studentName}</strong>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                      {evt.date} at {evt.time} • {evt.section}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: evt.status === "Completed" ? "#059669" : "#0284c7" }}>
                    {evt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* MODAL 1: FACULTY SCHEDULE NEW INTERVENTION (CONFLICT CHECKED) */}
      {/* ============================================================ */}
      {showScheduleModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "520px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            border: "1px solid #e2e8f0",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "1.25rem 1.5rem",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>
                  Schedule Student Counselling Session
                </h3>
                <p style={{ fontSize: "0.76rem", color: "#64748b" }}>
                  Faculty time-lock enabled: Prevents duplicate bookings at the same date and time.
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Conflict Alert Banner */}
            {conflictError && (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                color: "#b91c1c",
                padding: "0.75rem 1rem",
                margin: "1rem 1.25rem 0",
                borderRadius: "8px",
                fontSize: "0.78rem",
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-start"
              }}>
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>{conflictError}</div>
              </div>
            )}

            <form onSubmit={handleScheduleSubmit} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Select Student */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#334155", marginBottom: "0.3rem" }}>
                  Select Enrolled Student
                </label>
                <select
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.82rem"
                  }}
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {anonymize ? st.id : st.name} ({st.branch || st.grade} · {st.section || "Section A"}) — Risk: {risks[st.id]?.compositeScore || 0}%
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#334155", marginBottom: "0.3rem" }}>
                    Session Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => { setNewDate(e.target.value); setConflictError(""); }}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.82rem"
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#334155", marginBottom: "0.3rem" }}>
                    Session Time Slot
                  </label>
                  <select
                    value={newTime}
                    onChange={(e) => { setNewTime(e.target.value); setConflictError(""); }}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.82rem"
                    }}
                  >
                    {[
                      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
                      "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
                      "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
                      "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
                    ].map((timeOption) => {
                      const isOccupied = events.some((evt) => evt.date === newDate && evt.time === timeOption && evt.status !== "Cancelled");
                      return (
                        <option key={timeOption} value={timeOption}>
                          {timeOption} {isOccupied ? "— ⛔ OCCUPIED" : "— ✓ Available"}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Type */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#334155", marginBottom: "0.3rem" }}>
                  Intervention Strategy
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.82rem"
                  }}
                >
                  <option value="1-on-1 Academic Tutoring">1-on-1 Academic Tutoring</option>
                  <option value="Attendance Conference & Home Outreach">Attendance Conference & Home Outreach</option>
                  <option value="Homework Completion Workshop">Homework Completion Workshop</option>
                  <option value="Executive Function Coaching">Executive Function Coaching</option>
                  <option value="Peer Mentorship Study Group">Peer Mentorship Study Group</option>
                  <option value="Section Educator Check-in">Section Educator Check-in</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#334155", marginBottom: "0.3rem" }}>
                  Specific Focus / Objectives
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Notes on what concepts or attendance issues will be addressed..."
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.82rem"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="btn-secondary"
                  style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ fontSize: "0.8rem", padding: "0.5rem 1.25rem" }}
                >
                  Confirm & Lock Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: STUDENT EMERGENCY MEETING REQUEST FORM */}
      {/* ============================================================ */}
      {showEmergencyModal && isStudent && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            border: "1px solid #fecdd3",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "1.25rem",
              background: "#fff1f2",
              borderBottom: "1px solid #fecdd3",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#9f1239" }}>
                  Request Emergency Faculty Support Session
                </h3>
                <p style={{ fontSize: "0.76rem", color: "#be123c" }}>
                  Send an urgent meeting request to faculty Dr. Sarah Jenkins.
                </p>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9f1239" }}
              >
                <X size={20} />
              </button>
            </div>

            {emgSuccessMsg ? (
              <div style={{ padding: "2rem", textAlign: "center", background: "#f0fdf4" }}>
                <CheckCircle2 size={36} color="#16a34a" style={{ margin: "0 auto 0.5rem" }} />
                <div style={{ fontWeight: "800", color: "#166534", fontSize: "0.95rem" }}>Emergency Request Sent!</div>
                <div style={{ fontSize: "0.78rem", color: "#15803d", marginTop: "0.35rem" }}>
                  {emgSuccessMsg}
                </div>
              </div>
            ) : (
              <form onSubmit={handleEmergencySubmit} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Student Info */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#475569", marginBottom: "0.25rem" }}>
                    Student Identity
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${currentStudent.name} (${currentStudent.id} • ${currentStudent.branch} - ${currentStudent.section})`}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      background: "#f8fafc",
                      fontSize: "0.82rem",
                      color: "#334155"
                    }}
                  />
                </div>

                {/* Emergency Category */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#475569", marginBottom: "0.25rem" }}>
                    Nature of Emergency
                  </label>
                  <select
                    value={emgCategory}
                    onChange={(e) => setEmgCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.82rem"
                    }}
                  >
                    <option value="Academic Emergency - Failed Assessment / Doubt">Academic Emergency - Failed Assessment / Doubt</option>
                    <option value="Attendance / Medical Crisis">Attendance / Medical Crisis</option>
                    <option value="Immediate Concept Roadblock before Lab Exam">Immediate Concept Roadblock before Lab Exam</option>
                    <option value="Severe Academic Stress & Guidance Request">Severe Academic Stress & Guidance Request</option>
                    <option value="Coursework Submission Extension Request">Coursework Submission Extension Request</option>
                  </select>
                </div>

                {/* Urgency & Preferred Time */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#475569", marginBottom: "0.25rem" }}>
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={emgDate}
                      onChange={(e) => setEmgDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.82rem"
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#475569", marginBottom: "0.25rem" }}>
                      Preferred Time Slot
                    </label>
                    <select
                      value={emgTime}
                      onChange={(e) => setEmgTime(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.55rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.82rem"
                      }}
                    >
                      {[
                        "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
                        "11:30 AM", "12:00 PM", "01:30 PM", "02:00 PM",
                        "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"
                      ].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#475569", marginBottom: "0.25rem" }}>
                    Explain Your Situation & What You Need Help With
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={emgMessage}
                    onChange={(e) => setEmgMessage(e.target.value)}
                    placeholder="Describe what happened and why you need urgent counselling from faculty..."
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.82rem",
                      resize: "vertical"
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setShowEmergencyModal(false)}
                    className="btn-secondary"
                    style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.5rem 1.25rem",
                      fontSize: "0.82rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem"
                    }}
                  >
                    <Send size={14} /> Send to Faculty
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: FACULTY RESCHEDULE / MODIFY EXISTING SESSION */}
      {/* ============================================================ */}
      {editingEvent && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            border: "1px solid #e2e8f0",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "1.25rem",
              background: "#f0f9ff",
              borderBottom: "1px solid #bae6fd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#0369a1" }}>
                  Modify / Reschedule Counselling Session
                </h3>
                <p style={{ fontSize: "0.74rem", color: "#0284c7" }}>
                  Adjust date or time for {editingEvent.studentName} ({editingEvent.section})
                </p>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#0369a1" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Conflict Alert */}
            {editConflictError && (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                color: "#b91c1c",
                padding: "0.75rem 1rem",
                margin: "1rem 1.25rem 0",
                borderRadius: "8px",
                fontSize: "0.78rem"
              }}>
                {editConflictError}
              </div>
            )}

            <form onSubmit={handleRescheduleSubmit} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: "700", color: "#334155", marginBottom: "0.3rem" }}>
                    Rescheduled Date
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => { setEditDate(e.target.value); setEditConflictError(""); }}
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: "700", color: "#334155", marginBottom: "0.3rem" }}>
                    Rescheduled Time Slot
                  </label>
                  <select
                    value={editTime}
                    onChange={(e) => { setEditTime(e.target.value); setEditConflictError(""); }}
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                  >
                    {[
                      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
                      "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
                      "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
                      "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
                    ].map((t) => {
                      const isOccupied = events.some((evt) => evt.id !== editingEvent.id && evt.date === editDate && evt.time === t && evt.status !== "Cancelled");
                      return (
                        <option key={t} value={t}>
                          {t} {isOccupied ? "— ⛔ OCCUPIED" : "— ✓ Available"}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: "700", color: "#334155", marginBottom: "0.3rem" }}>
                  Intervention Strategy
                </label>
                <input
                  type="text"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: "700", color: "#334155", marginBottom: "0.3rem" }}>
                  Notes / Objectives
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="btn-secondary"
                  style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ fontSize: "0.8rem", padding: "0.5rem 1.25rem" }}
                >
                  Save Rescheduled Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: FACULTY ACCEPT EMERGENCY REQUEST & SCHEDULE */}
      {/* ============================================================ */}
      {acceptingRequest && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            border: "1px solid #cbd5e1",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "1.25rem",
              background: "#ecfdf5",
              borderBottom: "1px solid #a7f3d0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#065f46" }}>
                  Accept & Book Emergency Meeting
                </h3>
                <p style={{ fontSize: "0.74rem", color: "#047857" }}>
                  Student: {acceptingRequest.studentName} ({acceptingRequest.section})
                </p>
              </div>
              <button
                onClick={() => setAcceptingRequest(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#065f46" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Conflict Alert */}
            {acceptConflictError && (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                color: "#b91c1c",
                padding: "0.75rem 1rem",
                margin: "1rem 1.25rem 0",
                borderRadius: "8px",
                fontSize: "0.78rem"
              }}>
                {acceptConflictError}
              </div>
            )}

            <form onSubmit={handleAcceptEmergency} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "6px", fontSize: "0.78rem", border: "1px solid #e2e8f0" }}>
                <div><strong>Category:</strong> {acceptingRequest.category}</div>
                <div style={{ marginTop: "0.25rem" }}><strong>Message:</strong> "{acceptingRequest.message}"</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: "700", color: "#334155", marginBottom: "0.3rem" }}>
                    Confirm Date
                  </label>
                  <input
                    type="date"
                    value={acceptDate}
                    onChange={(e) => { setAcceptDate(e.target.value); setAcceptConflictError(""); }}
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: "700", color: "#334155", marginBottom: "0.3rem" }}>
                    Confirm Time Slot
                  </label>
                  <select
                    value={acceptTime}
                    onChange={(e) => { setAcceptTime(e.target.value); setAcceptConflictError(""); }}
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                  >
                    {[
                      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
                      "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
                      "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
                      "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
                    ].map((t) => {
                      const isOccupied = events.some((evt) => evt.date === acceptDate && evt.time === t && evt.status !== "Cancelled");
                      return (
                        <option key={t} value={t}>
                          {t} {isOccupied ? "— ⛔ OCCUPIED" : "— ✓ Available"}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setAcceptingRequest(null)}
                  className="btn-secondary"
                  style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ fontSize: "0.8rem", padding: "0.5rem 1.25rem", background: "#059669" }}
                >
                  Confirm & Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
