// Realistic synthetic dataset of students with comprehensive multidimensional learning indicators
export const initialStudents = [
  {
    id: "STU-1001",
    name: "Marcus Vance",
    grade: "10th Grade",
    section: "Section A",
    homeroom: "Section A",
    avatarColor: "#ef4444",
    attendance: {
      overallRate: 68,
      consecutiveAbsences: 4,
      unexcusedCount: 7,
      trend: [88, 82, 75, 71, 65, 68]
    },
    academics: {
      gpa: 2.1,
      currentAverage: 59,
      trend: [78, 72, 68, 62, 57, 59],
      recentDrop: -19,
      failedAssessments: 3,
      subjects: [
        { name: "Algebra II", grade: 54, status: "Critical" },
        { name: "Chemistry", grade: 61, status: "Warning" },
        { name: "World History", grade: 64, status: "Warning" },
        { name: "English Lit", grade: 72, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 6,
      submissionTimeliness: 52, // % on time
      lmsWeeklyHours: 1.8,
      videoCompletionRate: 40
    },
    participation: {
      score: 35, // 0-100
      classEngagement: "Low",
      peerCollaboration: "Withdrawn",
      questionsAsked: 1
    },
    teacherNotes: [
      {
        id: "TN-1",
        date: "2026-10-24",
        teacher: "Ms. Evelyn Reed (Algebra II)",
        sentiment: "Concern",
        tag: "Academic & Attendance",
        text: "Marcus missed the last two quiz prep sessions. When present, he seems disengaged and avoids asking for help with quadratic factoring."
      },
      {
        id: "TN-2",
        date: "2026-10-18",
        teacher: "Mr. Tyler Brooks (Chemistry)",
        sentiment: "Concern",
        tag: "Engagement",
        text: "Marcus arrived 20 minutes late to lab twice this week. Lab report was turned in 4 days overdue without explanatory note."
      }
    ],
    interventionPlan: {
      status: "In Progress", // "None", "Recommended", "Approved", "In Progress", "Resolved"
      title: "Algebra Foundation & Attendance Support Check-in",
      strategy: "Peer Tutoring + Counselor Contact",
      assignedTo: "Ms. Reed & Counselor Ortiz",
      createdDate: "2026-10-20",
      targetGoal: "Raise attendance to >82% and complete 4 pending algebra modules",
      notes: "Met with Marcus. Transportation issue identified on Tuesdays/Thursdays. Bus schedule adjusted."
    }
  },
  {
    id: "STU-1002",
    name: "Sophia Chen",
    grade: "11th Grade",
    section: "Section B",
    homeroom: "Section B",
    avatarColor: "#f59e0b",
    attendance: {
      overallRate: 83,
      consecutiveAbsences: 1,
      unexcusedCount: 2,
      trend: [94, 91, 88, 85, 80, 83]
    },
    academics: {
      gpa: 2.8,
      currentAverage: 67,
      trend: [86, 82, 79, 73, 65, 67],
      recentDrop: -19,
      failedAssessments: 2,
      subjects: [
        { name: "AP Physics 1", grade: 58, status: "Critical" },
        { name: "Pre-Calculus", grade: 64, status: "Warning" },
        { name: "US History", grade: 76, status: "Satisfactory" },
        { name: "American Lit", grade: 81, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 4,
      submissionTimeliness: 65,
      lmsWeeklyHours: 3.4,
      videoCompletionRate: 60
    },
    participation: {
      score: 58,
      classEngagement: "Moderate",
      peerCollaboration: "Active",
      questionsAsked: 4
    },
    teacherNotes: [
      {
        id: "TN-3",
        date: "2026-10-25",
        teacher: "Dr. Alistair Finch (AP Physics)",
        sentiment: "Concern",
        tag: "Concept Difficulty",
        text: "Sophia demonstrates good conceptual curiosity, but struggled significantly on kinematic vectors test. Expressed feeling overwhelmed by homework volume."
      }
    ],
    interventionPlan: {
      status: "Recommended",
      title: "Physics Recitation & Time Management Pacing",
      strategy: "Targeted Micro-Assessments & Study Hall Allocation",
      assignedTo: "Dr. Finch",
      createdDate: "2026-10-26",
      targetGoal: "Retake Kinematics mastery quiz after two 1-on-1 tutoring sessions",
      notes: "Pending educator review during weekly department consultation."
    }
  },
  {
    id: "STU-1003",
    name: "Devon Miller",
    grade: "12th Grade",
    section: "Section C",
    homeroom: "Section C",
    avatarColor: "#ef4444",
    attendance: {
      overallRate: 62,
      consecutiveAbsences: 5,
      unexcusedCount: 9,
      trend: [84, 76, 70, 64, 58, 62]
    },
    academics: {
      gpa: 1.9,
      currentAverage: 55,
      trend: [72, 68, 62, 59, 53, 55],
      recentDrop: -17,
      failedAssessments: 4,
      subjects: [
        { name: "Calculus AB", grade: 48, status: "Critical" },
        { name: "Gov & Economics", grade: 58, status: "Critical" },
        { name: "Senior English", grade: 63, status: "Warning" },
        { name: "Environmental Sci", grade: 70, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 8,
      submissionTimeliness: 44,
      lmsWeeklyHours: 1.2,
      videoCompletionRate: 35
    },
    participation: {
      score: 28,
      classEngagement: "Low",
      peerCollaboration: "Isolated",
      questionsAsked: 0
    },
    teacherNotes: [
      {
        id: "TN-4",
        date: "2026-10-22",
        teacher: "Mr. Samuel O'Connor (Gov & Econ)",
        sentiment: "Urgent",
        tag: "Attendance & Graduation Risk",
        text: "Devon has missed 4 consecutive Friday class sessions. Senior graduation project milestone #2 has not been submitted."
      }
    ],
    interventionPlan: {
      status: "Approved",
      title: "Senior Graduation Safety Net & Parent Conference",
      strategy: "Academic Recovery Contract + Attendance Coordinator Support",
      assignedTo: "Dean Vance & Dr. Albright",
      createdDate: "2026-10-23",
      targetGoal: "Submit Milestone #2 by next Monday; establish daily attendance check-in",
      notes: "Parent contact completed on 10/24. Meeting scheduled for Friday."
    }
  },
  {
    id: "STU-1004",
    name: "Amara Patel",
    grade: "9th Grade",
    section: "Section D",
    homeroom: "Section D",
    avatarColor: "#10b981",
    attendance: {
      overallRate: 97,
      consecutiveAbsences: 0,
      unexcusedCount: 0,
      trend: [98, 96, 98, 95, 99, 97]
    },
    academics: {
      gpa: 3.85,
      currentAverage: 92,
      trend: [90, 91, 93, 91, 94, 92],
      recentDrop: 2,
      failedAssessments: 0,
      subjects: [
        { name: "Biology Honors", grade: 94, status: "Exemplary" },
        { name: "Geometry Honors", grade: 90, status: "Exemplary" },
        { name: "World Geography", grade: 95, status: "Exemplary" },
        { name: "English 9", grade: 89, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 0,
      submissionTimeliness: 98,
      lmsWeeklyHours: 6.5,
      videoCompletionRate: 95
    },
    participation: {
      score: 92,
      classEngagement: "High",
      peerCollaboration: "Leader",
      questionsAsked: 8
    },
    teacherNotes: [
      {
        id: "TN-5",
        date: "2026-10-15",
        teacher: "Ms. Ramirez (Geometry)",
        sentiment: "Positive",
        tag: "Peer Leadership",
        text: "Amara frequently assists peers during problem-solving workshops. Consistently proactive and thorough."
      }
    ],
    interventionPlan: {
      status: "None",
      title: "",
      strategy: "",
      assignedTo: "",
      createdDate: "",
      targetGoal: "",
      notes: ""
    }
  },
  {
    id: "STU-1005",
    name: "Liam Gallagher",
    grade: "10th Grade",
    section: "Section A",
    homeroom: "Section A",
    avatarColor: "#f59e0b",
    attendance: {
      overallRate: 79,
      consecutiveAbsences: 2,
      unexcusedCount: 4,
      trend: [89, 85, 82, 78, 75, 79]
    },
    academics: {
      gpa: 2.6,
      currentAverage: 69,
      trend: [79, 75, 71, 66, 68, 69],
      recentDrop: -10,
      failedAssessments: 2,
      subjects: [
        { name: "Geometry", grade: 62, status: "Warning" },
        { name: "Chemistry", grade: 68, status: "Warning" },
        { name: "Modern History", grade: 74, status: "Satisfactory" },
        { name: "English 10", grade: 72, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 3,
      submissionTimeliness: 70,
      lmsWeeklyHours: 2.8,
      videoCompletionRate: 65
    },
    participation: {
      score: 61,
      classEngagement: "Moderate",
      peerCollaboration: "Participates",
      questionsAsked: 2
    },
    teacherNotes: [
      {
        id: "TN-6",
        date: "2026-10-21",
        teacher: "Mr. Tyler Brooks (Chemistry)",
        sentiment: "Neutral",
        tag: "Inconsistency",
        text: "Shows solid understanding on in-class spot quizzes, but often forgets to turn in assigned homework worksheets."
      }
    ],
    interventionPlan: {
      status: "Recommended",
      title: "Digital Assignment Organizer & Submission Reminder",
      strategy: "LMS automated notification sync + weekly advisor check-in",
      assignedTo: "Mr. Harrison",
      createdDate: "2026-10-24",
      targetGoal: "Maintain zero missing homework submissions for 3 consecutive weeks",
      notes: "Drafted recommendation for educator review."
    }
  },
  {
    id: "STU-1006",
    name: "Zoe Washington",
    grade: "11th Grade",
    section: "Section B",
    homeroom: "Section B",
    avatarColor: "#10b981",
    attendance: {
      overallRate: 91,
      consecutiveAbsences: 0,
      unexcusedCount: 1,
      trend: [78, 82, 85, 88, 90, 91] // recovering!
    },
    academics: {
      gpa: 3.1,
      currentAverage: 76,
      trend: [64, 66, 69, 72, 74, 76], // positive trajectory!
      recentDrop: 12,
      failedAssessments: 1,
      subjects: [
        { name: "Algebra II", grade: 74, status: "Satisfactory" },
        { name: "Biology", grade: 78, status: "Satisfactory" },
        { name: "US History", grade: 80, status: "Satisfactory" },
        { name: "Art Studio", grade: 92, status: "Exemplary" }
      ]
    },
    learningProgress: {
      missingAssignments: 1,
      submissionTimeliness: 85,
      lmsWeeklyHours: 4.2,
      videoCompletionRate: 80
    },
    participation: {
      score: 75,
      classEngagement: "Active",
      peerCollaboration: "Strong",
      questionsAsked: 5
    },
    teacherNotes: [
      {
        id: "TN-7",
        date: "2026-10-26",
        teacher: "Mrs. Lawson",
        sentiment: "Positive",
        tag: "Intervention Success",
        text: "Zoe has responded wonderfully to our 3-week study group intervention. Her test scores increased from 64% to 76% and her attendance has stabilized."
      }
    ],
    interventionPlan: {
      status: "Resolved",
      title: "Math Fundamentals Mentorship",
      strategy: "Peer Study Partner + Weekly Progress Tracker",
      assignedTo: "Mrs. Lawson & Amara Patel",
      createdDate: "2026-09-28",
      targetGoal: "Raise grade above 70% and reduce tardiness",
      notes: "Successfully achieved goals! Student graduated from active intervention to periodic monitoring."
    }
  },
  {
    id: "STU-1007",
    name: "Mateo Rodriguez",
    grade: "9th Grade",
    section: "Section D",
    homeroom: "Section D",
    avatarColor: "#ef4444",
    attendance: {
      overallRate: 72,
      consecutiveAbsences: 3,
      unexcusedCount: 5,
      trend: [86, 80, 75, 71, 68, 72]
    },
    academics: {
      gpa: 2.2,
      currentAverage: 62,
      trend: [76, 73, 67, 60, 59, 62],
      recentDrop: -14,
      failedAssessments: 3,
      subjects: [
        { name: "English 9", grade: 56, status: "Critical" },
        { name: "Algebra I", grade: 63, status: "Warning" },
        { name: "Earth Science", grade: 66, status: "Warning" },
        { name: "Spanish I", grade: 78, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 5,
      submissionTimeliness: 55,
      lmsWeeklyHours: 2.0,
      videoCompletionRate: 48
    },
    participation: {
      score: 42,
      classEngagement: "Passive",
      peerCollaboration: "Hesitant",
      questionsAsked: 1
    },
    teacherNotes: [
      {
        id: "TN-8",
        date: "2026-10-23",
        teacher: "Mr. Christopher Dunn (English 9)",
        sentiment: "Concern",
        tag: "Reading Comprehension & ESL",
        text: "Mateo struggles with lengthy analytical writing prompts. When asked questions verbally, he understands the story, but written assignments remain incomplete."
      }
    ],
    interventionPlan: {
      status: "In Progress",
      title: "Scaffolded Writing & ELL Resource Specialist Support",
      strategy: "Graphic Organizers + Speech-to-Text accommodation",
      assignedTo: "Mr. Dunn & ELL Specialist Hernandez",
      createdDate: "2026-10-21",
      targetGoal: "Complete essay drafting using structured outline templates",
      notes: "Introduced graphic organizers. First draft submitted successfully yesterday."
    }
  },
  {
    id: "STU-1008",
    name: "Chloe Nguyen",
    grade: "10th Grade",
    section: "Section A",
    homeroom: "Section A",
    avatarColor: "#0284c7",
    attendance: {
      overallRate: 95,
      consecutiveAbsences: 0,
      unexcusedCount: 0,
      trend: [96, 94, 95, 96, 94, 95]
    },
    academics: {
      gpa: 3.7,
      currentAverage: 88,
      trend: [86, 88, 87, 89, 87, 88],
      recentDrop: 1,
      failedAssessments: 0,
      subjects: [
        { name: "Algebra II", grade: 89, status: "Satisfactory" },
        { name: "Chemistry", grade: 85, status: "Satisfactory" },
        { name: "World History", grade: 91, status: "Exemplary" },
        { name: "English Lit", grade: 87, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 0,
      submissionTimeliness: 94,
      lmsWeeklyHours: 5.1,
      videoCompletionRate: 90
    },
    participation: {
      score: 86,
      classEngagement: "High",
      peerCollaboration: "Collaborative",
      questionsAsked: 6
    },
    teacherNotes: [
      {
        id: "TN-9",
        date: "2026-10-14",
        teacher: "Ms. Evelyn Reed",
        sentiment: "Positive",
        tag: "Consistent Work",
        text: "Always on time and well-prepared. Model student in small group discussions."
      }
    ],
    interventionPlan: {
      status: "None",
      title: "",
      strategy: "",
      assignedTo: "",
      createdDate: "",
      targetGoal: "",
      notes: ""
    }
  },
  {
    id: "STU-1009",
    name: "Isaiah Jackson",
    grade: "12th Grade",
    section: "Section C",
    homeroom: "Section C",
    avatarColor: "#f59e0b",
    attendance: {
      overallRate: 82,
      consecutiveAbsences: 1,
      unexcusedCount: 3,
      trend: [88, 86, 84, 80, 81, 82]
    },
    academics: {
      gpa: 2.7,
      currentAverage: 71,
      trend: [82, 79, 75, 70, 69, 71],
      recentDrop: -11,
      failedAssessments: 1,
      subjects: [
        { name: "Economics", grade: 65, status: "Warning" },
        { name: "Statistics", grade: 70, status: "Satisfactory" },
        { name: "Senior English", grade: 74, status: "Satisfactory" },
        { name: "Graphic Design", grade: 88, status: "Exemplary" }
      ]
    },
    learningProgress: {
      missingAssignments: 2,
      submissionTimeliness: 72,
      lmsWeeklyHours: 3.1,
      videoCompletionRate: 68
    },
    participation: {
      score: 64,
      classEngagement: "Moderate",
      peerCollaboration: "Good in visual arts",
      questionsAsked: 3
    },
    teacherNotes: [
      {
        id: "TN-10",
        date: "2026-10-19",
        teacher: "Mr. Samuel O'Connor",
        sentiment: "Neutral",
        tag: "Senior Fatigue",
        text: "Isaiah appears fatigued during 1st period Economics. Working after-school job may be affecting sleep schedule."
      }
    ],
    interventionPlan: {
      status: "Recommended",
      title: "Schedule Consultation & Homework Pacing Adjustment",
      strategy: "Counseling meeting to explore asynchronous module completion",
      assignedTo: "Counselor Ortiz",
      createdDate: "2026-10-25",
      targetGoal: "Review work/study balance and adjust morning arrival expectations",
      notes: "Awaiting counselor slot confirmation."
    }
  },
  {
    id: "STU-1010",
    name: "Hannah Becker",
    grade: "11th Grade",
    section: "Section B",
    homeroom: "Section B",
    avatarColor: "#10b981",
    attendance: {
      overallRate: 98,
      consecutiveAbsences: 0,
      unexcusedCount: 0,
      trend: [99, 98, 97, 98, 99, 98]
    },
    academics: {
      gpa: 3.9,
      currentAverage: 95,
      trend: [94, 94, 96, 95, 96, 95],
      recentDrop: 1,
      failedAssessments: 0,
      subjects: [
        { name: "AP Chemistry", grade: 94, status: "Exemplary" },
        { name: "Pre-Calculus", grade: 96, status: "Exemplary" },
        { name: "AP US History", grade: 93, status: "Exemplary" },
        { name: "Spanish III", grade: 97, status: "Exemplary" }
      ]
    },
    learningProgress: {
      missingAssignments: 0,
      submissionTimeliness: 99,
      lmsWeeklyHours: 7.2,
      videoCompletionRate: 98
    },
    participation: {
      score: 95,
      classEngagement: "Exceptional",
      peerCollaboration: "Leader",
      questionsAsked: 9
    },
    teacherNotes: [
      {
        id: "TN-11",
        date: "2026-10-12",
        teacher: "Dr. Alistair Finch",
        sentiment: "Positive",
        tag: "High Mastery",
        text: "Outstanding laboratory analytical report. Nominated for regional Science Olympiad."
      }
    ],
    interventionPlan: {
      status: "None",
      title: "",
      strategy: "",
      assignedTo: "",
      createdDate: "",
      targetGoal: "",
      notes: ""
    }
  },
  {
    id: "STU-1011",
    name: "Jordan Lee",
    grade: "9th Grade",
    section: "Section D",
    homeroom: "Section D",
    avatarColor: "#ef4444",
    attendance: {
      overallRate: 70,
      consecutiveAbsences: 3,
      unexcusedCount: 6,
      trend: [85, 80, 74, 69, 65, 70]
    },
    academics: {
      gpa: 2.0,
      currentAverage: 58,
      trend: [74, 70, 66, 61, 56, 58],
      recentDrop: -16,
      failedAssessments: 3,
      subjects: [
        { name: "Algebra I", grade: 52, status: "Critical" },
        { name: "English 9", grade: 59, status: "Critical" },
        { name: "Biology", grade: 63, status: "Warning" },
        { name: "Physical Education", grade: 88, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 7,
      submissionTimeliness: 48,
      lmsWeeklyHours: 1.5,
      videoCompletionRate: 38
    },
    participation: {
      score: 30,
      classEngagement: "Passive",
      peerCollaboration: "Disengaged",
      questionsAsked: 0
    },
    teacherNotes: [
      {
        id: "TN-12",
        date: "2026-10-25",
        teacher: "Ms. Ramirez",
        sentiment: "Urgent",
        tag: "Disengagement",
        text: "Jordan puts head on desk during morning lectures. Frequently forgets binder and Chromebook charger."
      }
    ],
    interventionPlan: {
      status: "Approved",
      title: "Freshman Transition & Executive Function Coaching",
      strategy: "Weekly organizational check-in + Student Success Coach",
      assignedTo: "Ms. Ramirez & Coach Davis",
      createdDate: "2026-10-24",
      targetGoal: "Establish daily digital binder routines and retrieve missing coursework",
      notes: "Educator team approved intervention. First meeting set for tomorrow afternoon."
    }
  },
  {
    id: "STU-1012",
    name: "Elena Rostova",
    grade: "10th Grade",
    section: "Section A",
    homeroom: "Section A",
    avatarColor: "#f59e0b",
    attendance: {
      overallRate: 85,
      consecutiveAbsences: 1,
      unexcusedCount: 2,
      trend: [92, 90, 88, 84, 82, 85]
    },
    academics: {
      gpa: 2.9,
      currentAverage: 73,
      trend: [84, 81, 78, 72, 70, 73],
      recentDrop: -11,
      failedAssessments: 1,
      subjects: [
        { name: "Chemistry", grade: 66, status: "Warning" },
        { name: "Geometry", grade: 72, status: "Satisfactory" },
        { name: "World Lit", grade: 77, status: "Satisfactory" },
        { name: "French II", grade: 86, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 2,
      submissionTimeliness: 78,
      lmsWeeklyHours: 3.5,
      videoCompletionRate: 72
    },
    participation: {
      score: 68,
      classEngagement: "Moderate",
      peerCollaboration: "Cooperative",
      questionsAsked: 3
    },
    teacherNotes: [
      {
        id: "TN-13",
        date: "2026-10-20",
        teacher: "Mr. Tyler Brooks",
        sentiment: "Neutral",
        tag: "Chemistry Math Barrier",
        text: "Elena understands theoretical concepts well, but stoichiometrical mathematics calculations cause anxiety."
      }
    ],
    interventionPlan: {
      status: "Recommended",
      title: "Stoichiometry & Math In Science Workshop",
      strategy: "After-school science math clinic",
      assignedTo: "Mr. Brooks",
      createdDate: "2026-10-22",
      targetGoal: "Achieve 75%+ on stoichiometry reassessment module",
      notes: "Awaiting student schedule confirmation."
    }
  }
];
