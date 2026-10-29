// Helper utility to normalize students into clean Sections (Section A, B, C, D)
// and Engineering Branches (CSE, ISE, ECE, AIML, ME, EEE)
// and provide metadata for the orderwise Section Flow.

export const SECTIONS = ["Section A", "Section B", "Section C", "Section D"];

export const BRANCHES = [
  { code: "CSE", name: "Computer Science & Engineering" },
  { code: "ISE", name: "Information Science & Engineering" },
  { code: "ECE", name: "Electronics & Communication Engineering" },
  { code: "AIML", name: "Artificial Intelligence & Machine Learning" },
  { code: "ME", name: "Mechanical Engineering" },
  { code: "EEE", name: "Electrical & Electronics Engineering" }
];

export const SECTION_METADATA = {
  "Section A": {
    name: "Section A",
    alias: "Computer Science & AIML Cohort",
    mentor: "Dr. Evelyn Reed (Dept. CSE) & Prof. David Kim",
    branchSpan: "CSE · AIML",
    color: "#0284c7",
    bg: "#e0f2fe",
    order: 1
  },
  "Section B": {
    name: "Section B",
    alias: "Information Science & Core Engg Cohort",
    mentor: "Prof. Tyler Brooks (Dept. ISE) & Dr. Alan Turing",
    branchSpan: "ISE · CSE",
    color: "#0369a1",
    bg: "#bae6fd",
    order: 2
  },
  "Section C": {
    name: "Section C",
    alias: "Electronics & Electrical Cohort",
    mentor: "Dr. Sarah Vance (Dept. ECE) & Prof. Miller",
    branchSpan: "ECE · EEE",
    color: "#0284c7",
    bg: "#e0f2fe",
    order: 3
  },
  "Section D": {
    name: "Section D",
    alias: "Mechanical & Applied Interdisciplinary Cohort",
    mentor: "Prof. Arthur Harrison (Dept. ME) & Counselor Diaz",
    branchSpan: "ME · Interdisciplinary",
    color: "#075985",
    bg: "#7dd3fc",
    order: 4
  }
};

const DEFAULT_BRANCH_MAP = {
  "STU-1001": "CSE",
  "STU-1002": "AIML",
  "STU-1003": "ECE",
  "STU-1004": "ISE",
  "STU-1005": "ME",
  "STU-1006": "CSE",
  "STU-1007": "ECE",
  "STU-1008": "AIML",
  "STU-1009": "EEE",
  "STU-1010": "ISE",
  "STU-1011": "CSE",
  "STU-1012": "ME"
};

/**
 * Normalizes any student object to ensure strict Section A/B/C/D
 * and Engineering Branch (CSE, ISE, ECE, AIML, ME, EEE).
 */
export function normalizeStudentSection(student, index = 0) {
  if (!student) return student;

  // 1. Normalize Section
  let assignedSection = "Section A";
  const rawSec = (student.section || "").trim();
  const rawHome = (student.homeroom || "").trim();

  if (SECTIONS.includes(rawSec)) {
    assignedSection = rawSec;
  } else if (SECTIONS.includes(rawHome)) {
    assignedSection = rawHome;
  } else {
    const roomText = `${rawSec} ${rawHome}`.toLowerCase();
    if (roomText.includes("105") || roomText.includes("101") || roomText.includes("section a")) {
      assignedSection = "Section A";
    } else if (roomText.includes("204") || roomText.includes("201") || roomText.includes("section b")) {
      assignedSection = "Section B";
    } else if (roomText.includes("301") || roomText.includes("305") || roomText.includes("section c")) {
      assignedSection = "Section C";
    } else if (roomText.includes("112") || roomText.includes("110") || roomText.includes("section d")) {
      assignedSection = "Section D";
    } else {
      assignedSection = SECTIONS[index % SECTIONS.length];
    }
  }

  // 2. Normalize Engineering Branch (replace Grade)
  let assignedBranch = "CSE";
  const rawBranch = (student.branch || "").trim();
  const rawGrade = (student.grade || "").trim();

  const validBranches = ["CSE", "ISE", "ECE", "AIML", "ME", "EEE", "Civil"];
  if (validBranches.includes(rawBranch)) {
    assignedBranch = rawBranch;
  } else if (validBranches.includes(rawGrade)) {
    assignedBranch = rawGrade;
  } else if (DEFAULT_BRANCH_MAP[student.id]) {
    assignedBranch = DEFAULT_BRANCH_MAP[student.id];
  } else {
    assignedBranch = validBranches[index % validBranches.length];
  }

  return {
    ...student,
    section: assignedSection,
    homeroom: assignedSection,
    branch: assignedBranch,
    grade: assignedBranch // keep grade synced to branch for backwards compatibility
  };
}
