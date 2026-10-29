import React, { useState } from "react";
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
  CalendarCheck
} from "lucide-react";

export default function AcademicCalendar({
  students,
  risks,
  anonymize,
  onSelectStudent
}) {
  // Calendar current view date (defaults to October 2026)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 29)); // Oct 29, 2026
  const [selectedDate, setSelectedDate] = useState("2026-10-29");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [filterSection, setFilterSection] = useState("ALL");

  // Initial realistic synthetic scheduled events
  const [events, setEvents] = useState([
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
      notes: "Senior graduation milestone recovery and Algebra remediation."
    },
    {
      id: "EVT-2",
      studentId: "STU-1001",
      studentName: "Marcus Vance",
      section: "Section A",
      date: "2026-10-29",
      time: "02:00 PM",
      type: "Attendance Conference & Lab Catchup",
      riskTier: "High Risk",
      status: "Scheduled",
      notes: "4 consecutive absences follow-up with Chemistry teacher."
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
      notes: "7 missing assignments review; low-distraction study schedule."
    },
    {
      id: "EVT-4",
      studentId: "STU-1005",
      studentName: "Sophia Chen",
      section: "Section D",
      date: "2026-10-31",
      time: "11:00 AM",
      type: "Targeted Chemistry Lab Catch-up",
      riskTier: "Moderate Risk",
      status: "Scheduled",
      notes: "Review missing lab experiments before semester mid-point."
    },
    {
      id: "EVT-5",
      studentId: "STU-1002",
      studentName: "Mateo Rodriguez",
      section: "Section A",
      date: "2026-11-02",
      time: "01:30 PM",
      type: "Peer Study Group Placement",
      riskTier: "High Risk",
      status: "Scheduled",
      notes: "Connecting Mateo with high-achieving peer mentor in Biology."
    },
    {
      id: "EVT-6",
      studentId: "STU-1007",
      studentName: "Liam Gallagher",
      section: "Section B",
      date: "2026-11-03",
      time: "03:15 PM",
      type: "Attendance Monitoring Check-in",
      riskTier: "Moderate Risk",
      status: "Scheduled",
      notes: "Bi-weekly check on unexcused absences and morning bus transport."
    },
    {
      id: "EVT-7",
      studentId: "STU-1006",
      studentName: "Elena Rostova",
      section: "Section B",
      date: "2026-11-05",
      time: "10:00 AM",
      type: "Academic Counseling & Quiz Prep",
      riskTier: "Moderate Risk",
      status: "Scheduled",
      notes: "Midterm study roadmap and anxiety-reduction strategies."
    },
    {
      id: "EVT-8",
      studentId: "STU-1008",
      studentName: "Zoe Washington",
      section: "Section B",
      date: "2026-11-06",
      time: "02:45 PM",
      type: "Quarterly Risk Synthesis & Recovery Review",
      riskTier: "Low Risk",
      status: "Completed",
      notes: "Celebrated recovery and sustained attendance improvements."
    }
  ]);

  // Form state for scheduling new intervention
  const [newStudentId, setNewStudentId] = useState(students[0]?.id || "");
  const [newDate, setNewDate] = useState("2026-10-29");
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newType, setNewType] = useState("1-on-1 Academic Tutoring");
  const [newNotes, setNewNotes] = useState("");

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

  // Filter events by section if active
  const filteredEvents = events.filter((evt) => {
    if (filterSection !== "ALL" && evt.section !== filterSection) return false;
    return true;
  });

  // Events for currently selected date
  const selectedDateEvents = filteredEvents.filter((evt) => evt.date === selectedDate);

  // Events ordered by date (Orderwise Agenda)
  const orderwiseEvents = [...filteredEvents].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  // Handle scheduling new intervention
  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    const student = students.find((s) => s.id === newStudentId);
    if (!student) return;

    const risk = risks[student.id];
    const newEvent = {
      id: `EVT-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      section: student.section || "Section A",
      date: newDate,
      time: newTime,
      type: newType,
      riskTier: risk?.riskTier || "Moderate Risk",
      status: "Scheduled",
      notes: newNotes.trim() || "Proactive intervention session"
    };

    setEvents((prev) => [newEvent, ...prev]);
    setSelectedDate(newDate);
    setShowScheduleModal(false);
    setNewNotes("");
  };

  const toggleEventStatus = (id) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === id
          ? { ...evt, status: evt.status === "Completed" ? "Scheduled" : "Completed" }
          : evt
      )
    );
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "1rem auto 3rem", padding: "0 1rem" }}>
      
      {/* Top Header & Section Filter */}
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
              background: "#e0f2fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0284c7"
            }}>
              <CalendarIcon size={20} />
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a" }}>
              Intervention & Risk Review Calendar
            </h2>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "3px" }}>
            Schedule and track student support sessions, risk reviews, and check-ins orderwise across sections.
          </p>
        </div>

        {/* Section Filter & Add Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
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

          <button
            onClick={() => setShowScheduleModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              fontSize: "0.82rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(2, 132, 199, 0.28)"
            }}
          >
            <Plus size={16} /> Schedule Intervention
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Orderwise Agenda on Right */}
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

          {/* Day of Week Headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.4rem",
            textAlign: "center",
            fontWeight: "700",
            fontSize: "0.74rem",
            color: "#64748b",
            marginBottom: "0.5rem"
          }}>
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.4rem"
          }}>
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} style={{
                minHeight: "78px",
                background: "#f8fafc",
                borderRadius: "8px",
                opacity: 0.4
              }} />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const dayEvents = filteredEvents.filter((e) => e.date === dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === "2026-10-29";

              const hasHighRisk = dayEvents.some((e) => e.riskTier === "High Risk");
              const hasModRisk = dayEvents.some((e) => e.riskTier === "Moderate Risk");

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    minHeight: "82px",
                    padding: "0.45rem",
                    borderRadius: "8px",
                    background: isSelected 
                      ? "#f0f9ff" 
                      : isToday 
                        ? "#f8fafc" 
                        : "#ffffff",
                    border: isSelected 
                      ? "2px solid #0284c7" 
                      : isToday 
                        ? "1px solid #0284c7" 
                        : "1px solid #e2e8f0",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected ? "0 4px 12px rgba(2, 132, 199, 0.15)" : "none"
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = "#93c5fd";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && !isToday) e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      fontSize: "0.82rem",
                      fontWeight: isToday || isSelected ? "800" : "600",
                      color: isSelected ? "#0284c7" : isToday ? "#0f172a" : "#475569"
                    }}>
                      {dayNum}
                    </span>
                    {isToday && (
                      <span style={{
                        fontSize: "0.6rem",
                        background: "#0284c7",
                        color: "#ffffff",
                        padding: "0.05rem 0.35rem",
                        borderRadius: "9999px",
                        fontWeight: "700"
                      }}>
                        Today
                      </span>
                    )}
                  </div>

                  {/* Day Event Dots / Mini badges */}
                  <div style={{ marginTop: "0.3rem", display: "flex", flexDirection: "column", gap: "2px" }}>
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: "700",
                          padding: "0.1rem 0.3rem",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          background: ev.riskTier === "High Risk" 
                            ? "#fee2e2" 
                            : ev.riskTier === "Moderate Risk" 
                              ? "#fef3c7" 
                              : "#e0f2fe",
                          color: ev.riskTier === "High Risk" 
                            ? "#b91c1c" 
                            : ev.riskTier === "Moderate Risk" 
                              ? "#b45309" 
                              : "#0369a1"
                        }}
                      >
                        {anonymize ? ev.studentId : ev.studentName.split(" ")[0]}: {ev.time}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div style={{ fontSize: "0.62rem", color: "#64748b", fontWeight: "700" }}>
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.2rem",
            alignItems: "center",
            marginTop: "1.25rem",
            paddingTop: "0.85rem",
            borderTop: "1px solid #f1f5f9",
            fontSize: "0.74rem",
            color: "#64748b"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
              High Risk Intervention (Priority 1)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
              Moderate Risk Check-in (Priority 2)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0284c7" }} />
              On Track / Recovery Review
            </div>
          </div>

        </div>

        {/* RIGHT: Orderwise Agenda & Selected Date Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Selected Date Session Details */}
          <div className="glass-panel" style={{
            padding: "1.25rem",
            background: "#ffffff",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              paddingBottom: "0.6rem",
              borderBottom: "1px solid #f1f5f9"
            }}>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
                  Schedule for {selectedDate}
                </h4>
                <p style={{ fontSize: "0.74rem", color: "#64748b" }}>
                  {selectedDateEvents.length} intervention session{selectedDateEvents.length === 1 ? "" : "s"} scheduled
                </p>
              </div>
              <button
                onClick={() => {
                  setNewDate(selectedDate);
                  setShowScheduleModal(true);
                }}
                style={{
                  background: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  color: "#0284c7",
                  fontSize: "0.74rem",
                  fontWeight: "700",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem"
                }}
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div style={{
                padding: "2rem 1rem",
                textAlign: "center",
                color: "#94a3b8",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px dashed #cbd5e1"
              }}>
                <CalendarCheck size={28} style={{ margin: "0 auto 0.5rem", color: "#94a3b8" }} />
                <p style={{ fontSize: "0.82rem", fontWeight: "600", color: "#64748b" }}>No sessions scheduled for this date</p>
                <p style={{ fontSize: "0.74rem" }}>Click "Add" above to schedule a student support check-in.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {selectedDateEvents.map((evt) => {
                  const student = students.find((s) => s.id === evt.studentId);
                  const isDone = evt.status === "Completed";

                  return (
                    <div
                      key={evt.id}
                      style={{
                        padding: "0.85rem",
                        borderRadius: "8px",
                        background: isDone ? "#f8fafc" : "#ffffff",
                        border: isDone ? "1px solid #e2e8f0" : "1px solid #cbd5e1",
                        opacity: isDone ? 0.75 : 1,
                        transition: "all 0.15s"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                            <span style={{ fontWeight: "700", fontSize: "0.86rem", color: "#0f172a" }}>
                              {anonymize ? evt.studentId : evt.studentName}
                            </span>
                            <span style={{
                              fontSize: "0.68rem",
                              padding: "0.1rem 0.4rem",
                              borderRadius: "4px",
                              fontWeight: "700",
                              background: "#e0f2fe",
                              color: "#0369a1"
                            }}>
                              {evt.section}
                            </span>
                            <span style={{
                              fontSize: "0.68rem",
                              padding: "0.1rem 0.4rem",
                              borderRadius: "4px",
                              fontWeight: "700",
                              background: evt.riskTier === "High Risk" ? "#fee2e2" : "#fef3c7",
                              color: evt.riskTier === "High Risk" ? "#b91c1c" : "#b45309"
                            }}>
                              {evt.riskTier}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.78rem", fontWeight: "600", color: "#0284c7", marginTop: "2px" }}>
                            {evt.type}
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{
                            fontSize: "0.72rem",
                            color: "#64748b",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontWeight: "600"
                          }}>
                            <Clock size={12} /> {evt.time}
                          </span>
                          <button
                            onClick={() => toggleEventStatus(evt.id)}
                            title={isDone ? "Mark as Scheduled" : "Mark as Completed"}
                            style={{
                              background: isDone ? "#dcfce7" : "#f1f5f9",
                              border: "none",
                              borderRadius: "6px",
                              padding: "0.25rem 0.5rem",
                              cursor: "pointer",
                              color: isDone ? "#15803d" : "#64748b",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontSize: "0.7rem",
                              fontWeight: "700"
                            }}
                          >
                            <CheckCircle2 size={13} /> {isDone ? "Done" : "Mark Done"}
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: "0.74rem", color: "#64748b", margin: "0.3rem 0 0.5rem" }}>
                        {evt.notes}
                      </p>

                      {student && (
                        <button
                          onClick={() => onSelectStudent(student)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#0284c7",
                            fontSize: "0.72rem",
                            fontWeight: "700",
                            cursor: "pointer",
                            padding: 0
                          }}
                        >
                          View Student Profile →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chronological (Orderwise) Upcoming Agenda */}
          <div className="glass-panel" style={{
            padding: "1.25rem",
            background: "#ffffff",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.85rem",
              paddingBottom: "0.6rem",
              borderBottom: "1px solid #f1f5f9"
            }}>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
                  Orderwise Upcoming Interventions
                </h4>
                <p style={{ fontSize: "0.74rem", color: "#64748b" }}>
                  Chronological schedule across all sections
                </p>
              </div>
              <span style={{
                background: "#e0f2fe",
                color: "#0369a1",
                fontSize: "0.68rem",
                fontWeight: "700",
                padding: "0.15rem 0.5rem",
                borderRadius: "9999px"
              }}>
                {orderwiseEvents.length} Total
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "320px", overflowY: "auto" }}>
              {orderwiseEvents.map((evt, idx) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedDate(evt.date)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.65rem 0.75rem",
                    borderRadius: "6px",
                    background: selectedDate === evt.date ? "#f0f9ff" : "#f8fafc",
                    border: selectedDate === evt.date ? "1px solid #bae6fd" : "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: "800",
                      color: "#94a3b8",
                      width: "20px"
                    }}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "0.82rem", color: "#0f172a" }}>
                        {anonymize ? evt.studentId : evt.studentName} · {evt.section}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                        {evt.type}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "#0284c7" }}>
                      {evt.date}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>
                      {evt.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Schedule Modal */}
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
            maxWidth: "500px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "1.25rem",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>
                  Schedule Student Intervention Session
                </h3>
                <p style={{ fontSize: "0.76rem", color: "#64748b" }}>
                  Set an advisory session date, check-in milestone, or tutoring block
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Student selector */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#334155", marginBottom: "0.3rem" }}>
                  Select Student
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
                      {anonymize ? st.id : st.name} ({st.grade} · {st.section || "Section A"}) — Risk: {risks[st.id]?.compositeScore || 0}%
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
                    onChange={(e) => setNewDate(e.target.value)}
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
                    Session Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
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
              </div>

              {/* Intervention Type */}
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
                  rows={3}
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
                  onClick={() => setShowScheduleModal(false)}
                  style={{
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.55rem 1rem",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.55rem 1.25rem",
                    fontSize: "0.82rem",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
