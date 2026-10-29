// Helper utility to normalize students into clean Sections (Section A, B, C, D)
// and provide metadata for the orderwise Section Flow.

export const SECTIONS = ["Section A", "Section B", "Section C", "Section D"];

export const SECTION_METADATA = {
  "Section A": {
    name: "Section A",
    alias: "Foundation Cohort (Rooms 101-105)",
    mentor: "Ms. Evelyn Reed & Mr. David Kim",
    gradeSpan: "Grade 9 & 10",
    color: "#0284c7",
    bg: "#e0f2fe",
    order: 1
  },
  "Section B": {
    name: "Section B",
    alias: "Core Academic Cohort (Rooms 201-204)",
    mentor: "Mr. Tyler Brooks & Dr. Alan Turing",
    gradeSpan: "Grade 10 & 11",
    color: "#0369a1",
    bg: "#bae6fd",
    order: 2
  },
  "Section C": {
    name: "Section C",
    alias: "Senior Graduation Cohort (Rooms 301-305)",
    mentor: "Ms. Sarah Vance & Coach Miller",
    gradeSpan: "Grade 11 & 12",
    color: "#0284c7",
    bg: "#e0f2fe",
    order: 3
  },
  "Section D": {
    name: "Section D",
    alias: "Interdisciplinary Cohort (Rooms 110-115)",
    mentor: "Mr. Arthur Harrison & Counselor Diaz",
    gradeSpan: "Grade 9 & 12",
    color: "#075985",
    bg: "#7dd3fc",
    order: 4
  }
};

/**
 * Normalizes any student object to ensure strict Section A/B/C/D
 * with zero remaining "Room" text.
 */
export function normalizeStudentSection(student, index = 0) {
  if (!student) return student;

  let assigned = "Section A";
  const rawSec = (student.section || "").trim();
  const rawHome = (student.homeroom || "").trim();

  // If already clean Section A/B/C/D
  if (SECTIONS.includes(rawSec)) {
    assigned = rawSec;
  } else if (SECTIONS.includes(rawHome)) {
    assigned = rawHome;
  } else {
    // Map from room number or index
    const combined = `${rawSec} ${rawHome} ${student.id} ${student.name}`.toLowerCase();
    if (combined.includes("105") || combined.includes("101") || combined.includes("a")) {
      assigned = "Section A";
    } else if (combined.includes("204") || combined.includes("201") || combined.includes("b")) {
      assigned = "Section B";
    } else if (combined.includes("301") || combined.includes("305") || combined.includes("c")) {
      assigned = "Section C";
    } else if (combined.includes("112") || combined.includes("110") || combined.includes("d")) {
      assigned = "Section D";
    } else {
      assigned = SECTIONS[index % SECTIONS.length];
    }
  }

  return {
    ...student,
    section: assigned,
    homeroom: assigned // Replace homeroom entirely so no legacy code can display Room
  };
}
