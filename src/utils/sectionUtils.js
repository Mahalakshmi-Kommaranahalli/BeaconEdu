// Helper utility to normalize students into clean Sections (Section A, B, C, D)
// and Engineering Branches (CSE, ISE, ECE, AIML, ME, EEE).

export const SECTIONS = ["Section A", "Section B", "Section C", "Section D"];

export const BRANCHES = ["CSE", "ISE", "ECE", "AIML", "ME", "EEE"];

export const BRANCH_DETAILS = {
  "CSE": {
    code: "CSE",
    fullName: "Computer Science & Engineering",
    shortName: "Computer Science",
    color: "#0284c7",
    bg: "#e0f2fe"
  },
  "ISE": {
    code: "ISE",
    fullName: "Information Science & Engineering",
    shortName: "Information Science",
    color: "#0369a1",
    bg: "#bae6fd"
  },
  "ECE": {
    code: "ECE",
    fullName: "Electronics & Communication Engineering",
    shortName: "Electronics & Comm",
    color: "#0284c7",
    bg: "#e0f2fe"
  },
  "AIML": {
    code: "AIML",
    fullName: "Artificial Intelligence & Machine Learning",
    shortName: "AI & Data Science",
    color: "#075985",
    bg: "#7dd3fc"
  },
  "ME": {
    code: "ME",
    fullName: "Mechanical Engineering",
    shortName: "Mechanical Engg",
    color: "#0284c7",
    bg: "#e0f2fe"
  },
  "EEE": {
    code: "EEE",
    fullName: "Electrical & Electronics Engineering",
    shortName: "Electrical & Electronics",
    color: "#0369a1",
    bg: "#bae6fd"
  }
};

export const SECTION_METADATA = {
  "Section A": {
    name: "Section A",
    alias: "CSE & AIML Engineering Dept",
    mentor: "Prof. Evelyn Reed & Dr. David Kim",
    gradeSpan: "Engineering Dept A",
    color: "#0284c7",
    bg: "#e0f2fe",
    order: 1
  },
  "Section B": {
    name: "Section B",
    alias: "ISE & Systems Engineering Dept",
    mentor: "Prof. Tyler Brooks & Dr. Alan Turing",
    gradeSpan: "Engineering Dept B",
    color: "#0369a1",
    bg: "#bae6fd",
    order: 2
  },
  "Section C": {
    name: "Section C",
    alias: "ECE & Hardware Engineering Dept",
    mentor: "Prof. Sarah Vance & Dr. Shannon",
    gradeSpan: "Engineering Dept C",
    color: "#0284c7",
    bg: "#e0f2fe",
    order: 3
  },
  "Section D": {
    name: "Section D",
    alias: "Core Engineering & Robotics Dept",
    mentor: "Prof. Arthur Harrison & Counselor Diaz",
    gradeSpan: "Engineering Dept D",
    color: "#075985",
    bg: "#7dd3fc",
    order: 4
  }
};

/**
 * Normalizes any student object to ensure strict Section A/B/C/D
 * and Engineering Branch (CSE, ISE, ECE, AIML, ME, EEE).
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

  // Engineering Branch normalization
  let assignedBranch = "CSE";
  const rawBranch = (student.branch || "").trim();
  if (BRANCHES.includes(rawBranch)) {
    assignedBranch = rawBranch;
  } else {
    // Map legacy grade or index to Engineering branch
    const branchCycle = ["CSE", "ISE", "ECE", "AIML", "ME", "EEE"];
    assignedBranch = branchCycle[index % branchCycle.length];
  }

  return {
    ...student,
    section: assigned,
    homeroom: assigned,
    branch: assignedBranch,
    grade: assignedBranch // Mirror branch to grade for backward compatibility
  };
}
