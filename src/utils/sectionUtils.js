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
    const roomText = `${rawSec} ${rawHome}`.toLowerCase();
    if (roomText.includes("105") || roomText.includes("101") || roomText.includes("section a")) {
      assigned = "Section A";
    } else if (roomText.includes("204") || roomText.includes("201") || roomText.includes("section b")) {
      assigned = "Section B";
    } else if (roomText.includes("301") || roomText.includes("305") || roomText.includes("section c")) {
      assigned = "Section C";
    } else if (roomText.includes("112") || roomText.includes("110") || roomText.includes("section d")) {
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
