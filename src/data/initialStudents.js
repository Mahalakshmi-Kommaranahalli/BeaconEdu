// Realistic synthetic dataset of Engineering Students with comprehensive learning & risk indicators
export const initialStudents = [
  {
    id: "STU-1001",
    name: "Marcus Vance",
    branch: "Computer Science (CSE)",
    grade: "CSE",
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
        { name: "Data Structures & Algorithms", grade: 54, status: "Critical" },
        { name: "Operating Systems", grade: 61, status: "Warning" },
        { name: "Discrete Mathematics", grade: 64, status: "Warning" },
        { name: "Computer Organization", grade: 72, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 6,
      submissionTimeliness: 52,
      lmsWeeklyHours: 1.8,
      videoCompletionRate: 40
    },
    participation: {
      score: 35,
      classEngagement: "Low",
      peerCollaboration: "Withdrawn",
      questionsAsked: 1
    },
    teacherNotes: [
      {
        id: "TN-1",
        date: "2026-10-24",
        teacher: "Prof. Evelyn Reed (Data Structures)",
        sentiment: "Concern",
        tag: "Lab & Attendance",
        text: "Marcus missed the binary tree balancing lab. Appears overwhelmed by recursion concepts."
      },
      {
        id: "TN-2",
        date: "2026-10-18",
        teacher: "Prof. Tyler Brooks (Operating Systems)",
        sentiment: "Concern",
        tag: "Engagement",
        text: "Arrived late to multithreading lab twice. Semaphore assignment was 4 days overdue."
      }
    ],
    interventionPlan: {
      status: "In Progress",
      assignedTo: "Prof. David Kim",
      action: "1-on-1 Data Structures Tutoring & Algorithm Walkthrough",
      notes: "Weekly Tuesday review on linked lists, recursion, and stack implementations."
    }
  },
  {
    id: "STU-1002",
    name: "Sophia Chen",
    branch: "Information Science (ISE)",
    grade: "ISE",
    section: "Section B",
    homeroom: "Section B",
    avatarColor: "#f59e0b",
    attendance: {
      overallRate: 83,
      consecutiveAbsences: 1,
      unexcusedCount: 3,
      trend: [92, 89, 85, 82, 80, 83]
    },
    academics: {
      gpa: 2.8,
      currentAverage: 67,
      trend: [86, 80, 75, 71, 65, 67],
      recentDrop: -19,
      failedAssessments: 1,
      subjects: [
        { name: "Database Management (DBMS)", grade: 62, status: "Warning" },
        { name: "Web Architecture", grade: 68, status: "Warning" },
        { name: "Cloud Computing", grade: 74, status: "Satisfactory" },
        { name: "Software Engineering", grade: 76, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 4,
      submissionTimeliness: 65,
      lmsWeeklyHours: 3.2,
      videoCompletionRate: 60
    },
    participation: {
      score: 55,
      classEngagement: "Moderate",
      peerCollaboration: "Cooperative",
      questionsAsked: 3
    },
    teacherNotes: [
      {
        id: "TN-3",
        date: "2026-10-22",
        teacher: "Prof. Alan Turing (DBMS)",
        sentiment: "Concern",
        tag: "SQL Normalization",
        text: "Struggling with BCNF normalization questions on the mid-term test."
      }
    ],
    interventionPlan: {
      status: "Approved",
      assignedTo: "Counselor Diaz",
      action: "Database Query Lab Mentorship",
      notes: "Assigned peer tutor for SQL join queries and relational algebra."
    }
  },
  {
    id: "STU-1003",
    name: "Devon Miller",
    branch: "Electronics & Communication (ECE)",
    grade: "ECE",
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
      trend: [72, 65, 61, 58, 52, 55],
      recentDrop: -17,
      failedAssessments: 4,
      subjects: [
        { name: "Digital Signal Processing", grade: 48, status: "Critical" },
        { name: "Microcontrollers & Embedded C", grade: 53, status: "Critical" },
        { name: "VLSI Circuit Design", grade: 60, status: "Warning" },
        { name: "Signals & Systems", grade: 64, status: "Warning" }
      ]
    },
    learningProgress: {
      missingAssignments: 8,
      submissionTimeliness: 44,
      lmsWeeklyHours: 1.2,
      videoCompletionRate: 25
    },
    participation: {
      score: 25,
      classEngagement: "Low",
      peerCollaboration: "Isolated",
      questionsAsked: 0
    },
    teacherNotes: [
      {
        id: "TN-4",
        date: "2026-10-25",
        teacher: "Prof. Sarah Vance (DSP)",
        sentiment: "Concern",
        tag: "Severe Attendance & Lab Failure",
        text: "Devon missed FFT algorithm lab sessions. Capstone design milestone has not been submitted."
      }
    ],
    interventionPlan: {
      status: "In Progress",
      assignedTo: "Prof. Shannon",
      action: "ECE Lab Recovery & Academic Hearing",
      notes: "Mandatory daily lab check-in and DSP simulation makeup package."
    }
  },
  {
    id: "STU-1004",
    name: "Amara Patel",
    branch: "AI & Machine Learning (AIML)",
    grade: "AIML",
    section: "Section D",
    homeroom: "Section D",
    avatarColor: "#10b981",
    attendance: {
      overallRate: 96,
      consecutiveAbsences: 0,
      unexcusedCount: 0,
      trend: [98, 97, 95, 96, 96, 96]
    },
    academics: {
      gpa: 3.9,
      currentAverage: 94,
      trend: [92, 93, 94, 95, 94, 94],
      recentDrop: 2,
      failedAssessments: 0,
      subjects: [
        { name: "Machine Learning Math", grade: 96, status: "Satisfactory" },
        { name: "Neural Networks & Deep Learning", grade: 94, status: "Satisfactory" },
        { name: "Computer Vision", grade: 92, status: "Satisfactory" },
        { name: "Python for Data Science", grade: 97, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 0,
      submissionTimeliness: 98,
      lmsWeeklyHours: 7.5,
      videoCompletionRate: 98
    },
    participation: {
      score: 95,
      classEngagement: "High",
      peerCollaboration: "Leader",
      questionsAsked: 8
    },
    teacherNotes: [
      {
        id: "TN-5",
        date: "2026-10-20",
        teacher: "Prof. Arthur Harrison (AIML)",
        sentiment: "Positive",
        tag: "Excellence",
        text: "Outstanding implementation of CNN backpropagation from scratch."
      }
    ],
    interventionPlan: {
      status: "Resolved",
      assignedTo: "Prof. Harrison",
      action: "Peer Tutoring & AI Research Group",
      notes: "Selected as Section D peer mentor."
    }
  },
  {
    id: "STU-1005",
    name: "Liam Gallagher",
    branch: "Computer Science (CSE)",
    grade: "CSE",
    section: "Section A",
    homeroom: "Section A",
    avatarColor: "#f59e0b",
    attendance: {
      overallRate: 79,
      consecutiveAbsences: 2,
      unexcusedCount: 4,
      trend: [90, 85, 81, 78, 76, 79]
    },
    academics: {
      gpa: 2.6,
      currentAverage: 69,
      trend: [79, 76, 73, 70, 67, 69],
      recentDrop: -10,
      failedAssessments: 1,
      subjects: [
        { name: "Compiler Design", grade: 63, status: "Warning" },
        { name: "Automata & Computation", grade: 67, status: "Warning" },
        { name: "Java Programming", grade: 75, status: "Satisfactory" },
        { name: "Computer Networks", grade: 71, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 3,
      submissionTimeliness: 70,
      lmsWeeklyHours: 2.8,
      videoCompletionRate: 55
    },
    participation: {
      score: 50,
      classEngagement: "Moderate",
      peerCollaboration: "Cooperative",
      questionsAsked: 2
    },
    teacherNotes: [
      {
        id: "TN-6",
        date: "2026-10-15",
        teacher: "Prof. Reed (CSE)",
        sentiment: "Neutral",
        tag: "Lexical Analysis",
        text: "Understands syntax analysis but struggles with LL(1) parsing tables."
      }
    ],
    interventionPlan: {
      status: "None",
      assignedTo: null,
      action: "Monitoring Parser Exercises",
      notes: "Follow up after midterm compiler exam."
    }
  },
  {
    id: "STU-1006",
    name: "Zoe Washington",
    branch: "Information Science (ISE)",
    grade: "ISE",
    section: "Section B",
    homeroom: "Section B",
    avatarColor: "#10b981",
    attendance: {
      overallRate: 91,
      consecutiveAbsences: 0,
      unexcusedCount: 1,
      trend: [82, 85, 87, 89, 90, 91]
    },
    academics: {
      gpa: 3.1,
      currentAverage: 76,
      trend: [64, 68, 71, 73, 75, 76],
      recentDrop: 12,
      failedAssessments: 0,
      subjects: [
        { name: "Big Data Analytics", grade: 74, status: "Satisfactory" },
        { name: "Information Security", grade: 78, status: "Satisfactory" },
        { name: "Distributed Systems", grade: 75, status: "Satisfactory" },
        { name: "Python Scripting", grade: 81, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 1,
      submissionTimeliness: 88,
      lmsWeeklyHours: 4.5,
      videoCompletionRate: 85
    },
    participation: {
      score: 75,
      classEngagement: "High",
      peerCollaboration: "Active",
      questionsAsked: 5
    },
    teacherNotes: [
      {
        id: "TN-7",
        date: "2026-10-26",
        teacher: "Prof. Brooks (ISE)",
        sentiment: "Positive",
        tag: "Recovery Trend",
        text: "Zoe has shown remarkable progress in Hadoop cluster setup labs."
      }
    ],
    interventionPlan: {
      status: "Resolved",
      assignedTo: "Counselor Diaz",
      action: "Spark & Hadoop Lab Support",
      notes: "Successfully completed recovery plan."
    }
  },
  {
    id: "STU-1007",
    name: "Mateo Rodriguez",
    branch: "Electronics & Communication (ECE)",
    grade: "ECE",
    section: "Section D",
    homeroom: "Section D",
    avatarColor: "#ef4444",
    attendance: {
      overallRate: 72,
      consecutiveAbsences: 3,
      unexcusedCount: 5,
      trend: [86, 81, 77, 74, 69, 72]
    },
    academics: {
      gpa: 2.2,
      currentAverage: 62,
      trend: [76, 71, 68, 64, 60, 62],
      recentDrop: -14,
      failedAssessments: 2,
      subjects: [
        { name: "Electromagnetic Fields", grade: 52, status: "Critical" },
        { name: "Communication Theory", grade: 61, status: "Warning" },
        { name: "Embedded Systems", grade: 66, status: "Warning" },
        { name: "Engineering Maths III", grade: 70, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 5,
      submissionTimeliness: 55,
      lmsWeeklyHours: 2.1,
      videoCompletionRate: 42
    },
    participation: {
      score: 40,
      classEngagement: "Low",
      peerCollaboration: "Reluctant",
      questionsAsked: 1
    },
    teacherNotes: [
      {
        id: "TN-8",
        date: "2026-10-21",
        teacher: "Prof. Shannon (ECE)",
        sentiment: "Concern",
        tag: "Maxwell Equations",
        text: "Struggling with vector calculus applications in wave propagation."
      }
    ],
    interventionPlan: {
      status: "In Progress",
      assignedTo: "Prof. Vance",
      action: "EM Wave Tutoring Group",
      notes: "Weekly Thursday vector calculus workshop."
    }
  },
  {
    id: "STU-1008",
    name: "Chloe Nguyen",
    branch: "AI & Machine Learning (AIML)",
    grade: "AIML",
    section: "Section A",
    homeroom: "Section A",
    avatarColor: "#10b981",
    attendance: {
      overallRate: 94,
      consecutiveAbsences: 0,
      unexcusedCount: 1,
      trend: [92, 93, 94, 94, 95, 94]
    },
    academics: {
      gpa: 3.7,
      currentAverage: 90,
      trend: [88, 89, 90, 91, 90, 90],
      recentDrop: 2,
      failedAssessments: 0,
      subjects: [
        { name: "Natural Language Processing", grade: 92, status: "Satisfactory" },
        { name: "Reinforcement Learning", grade: 88, status: "Satisfactory" },
        { name: "Deep Learning Architectures", grade: 91, status: "Satisfactory" },
        { name: "Probability & Statistics", grade: 89, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 0,
      submissionTimeliness: 95,
      lmsWeeklyHours: 6.2,
      videoCompletionRate: 92
    },
    participation: {
      score: 85,
      classEngagement: "High",
      peerCollaboration: "Active",
      questionsAsked: 6
    },
    teacherNotes: [
      {
        id: "TN-9",
        date: "2026-10-19",
        teacher: "Prof. Kim (AIML)",
        sentiment: "Positive",
        tag: "Transformer Models",
        text: "Excellent project presentation on self-attention mechanisms."
      }
    ],
    interventionPlan: {
      status: "None",
      assignedTo: null,
      action: "AI Research Track",
      notes: "Exemplary performance across all modules."
    }
  },
  {
    id: "STU-1009",
    name: "Isaiah Jackson",
    branch: "Mechanical Engineering (ME)",
    grade: "ME",
    section: "Section C",
    homeroom: "Section C",
    avatarColor: "#f59e0b",
    attendance: {
      overallRate: 82,
      consecutiveAbsences: 1,
      unexcusedCount: 3,
      trend: [93, 89, 85, 82, 80, 82]
    },
    academics: {
      gpa: 2.7,
      currentAverage: 71,
      trend: [82, 79, 76, 73, 70, 71],
      recentDrop: -11,
      failedAssessments: 1,
      subjects: [
        { name: "Thermodynamics", grade: 64, status: "Warning" },
        { name: "Fluid Mechanics", grade: 68, status: "Warning" },
        { name: "Strength of Materials", grade: 76, status: "Satisfactory" },
        { name: "CAD/CAM Modeling", grade: 78, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 2,
      submissionTimeliness: 72,
      lmsWeeklyHours: 3.1,
      videoCompletionRate: 64
    },
    participation: {
      score: 60,
      classEngagement: "Moderate",
      peerCollaboration: "Cooperative",
      questionsAsked: 2
    },
    teacherNotes: [
      {
        id: "TN-10",
        date: "2026-10-23",
        teacher: "Prof. Miller (ME)",
        sentiment: "Concern",
        tag: "Carnot Cycles",
        text: "Needs clarification on entropy calculations and heat engine efficiency."
      }
    ],
    interventionPlan: {
      status: "Approved",
      assignedTo: "Prof. Miller",
      action: "Thermodynamics Problem Solving Clinic",
      notes: "Bi-weekly numerical practice sessions."
    }
  },
  {
    id: "STU-1010",
    name: "Hannah Becker",
    branch: "Electrical & Electronics (EEE)",
    grade: "EEE",
    section: "Section B",
    homeroom: "Section B",
    avatarColor: "#10b981",
    attendance: {
      overallRate: 95,
      consecutiveAbsences: 0,
      unexcusedCount: 0,
      trend: [94, 95, 96, 95, 95, 95]
    },
    academics: {
      gpa: 3.8,
      currentAverage: 92,
      trend: [90, 91, 91, 92, 92, 92],
      recentDrop: 2,
      failedAssessments: 0,
      subjects: [
        { name: "Power Systems", grade: 94, status: "Satisfactory" },
        { name: "Control Systems Engineering", grade: 90, status: "Satisfactory" },
        { name: "Electrical Machines II", grade: 93, status: "Satisfactory" },
        { name: "Power Electronics", grade: 91, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 0,
      submissionTimeliness: 96,
      lmsWeeklyHours: 5.8,
      videoCompletionRate: 94
    },
    participation: {
      score: 90,
      classEngagement: "High",
      peerCollaboration: "Leader",
      questionsAsked: 7
    },
    teacherNotes: [
      {
        id: "TN-11",
        date: "2026-10-17",
        teacher: "Prof. Turing (EEE)",
        sentiment: "Positive",
        tag: "Grid Stability",
        text: "Excellent simulations on synchronous generator transient stability."
      }
    ],
    interventionPlan: {
      status: "None",
      assignedTo: null,
      action: "Smart Grid Design Project",
      notes: "Top 5% student in EEE cohort."
    }
  },
  {
    id: "STU-1011",
    name: "Jordan Lee",
    branch: "Computer Science (CSE)",
    grade: "CSE",
    section: "Section D",
    homeroom: "Section D",
    avatarColor: "#ef4444",
    attendance: {
      overallRate: 70,
      consecutiveAbsences: 3,
      unexcusedCount: 6,
      trend: [88, 80, 75, 71, 66, 70]
    },
    academics: {
      gpa: 2.0,
      currentAverage: 58,
      trend: [76, 70, 65, 60, 56, 58],
      recentDrop: -18,
      failedAssessments: 3,
      subjects: [
        { name: "Computer Organization", grade: 52, status: "Critical" },
        { name: "Algorithms & Complexity", grade: 56, status: "Critical" },
        { name: "Digital Logic Design", grade: 62, status: "Warning" },
        { name: "Unix Shell Scripting", grade: 65, status: "Warning" }
      ]
    },
    learningProgress: {
      missingAssignments: 7,
      submissionTimeliness: 48,
      lmsWeeklyHours: 1.5,
      videoCompletionRate: 35
    },
    participation: {
      score: 30,
      classEngagement: "Low",
      peerCollaboration: "Withdrawn",
      questionsAsked: 1
    },
    teacherNotes: [
      {
        id: "TN-12",
        date: "2026-10-27",
        teacher: "Prof. Harrison (CSE)",
        sentiment: "Concern",
        tag: "Pipelining Architecture",
        text: "Missed MIPS assembly simulator assignments and architecture lab quizzes."
      }
    ],
    interventionPlan: {
      status: "Approved",
      assignedTo: "Prof. Kim",
      action: "Computer Architecture Lab Mentorship",
      notes: "Assigned daily coding exercise roadmap."
    }
  },
  {
    id: "STU-1012",
    name: "Elena Rostova",
    branch: "Information Science (ISE)",
    grade: "ISE",
    section: "Section A",
    homeroom: "Section A",
    avatarColor: "#f59e0b",
    attendance: {
      overallRate: 85,
      consecutiveAbsences: 1,
      unexcusedCount: 2,
      trend: [96, 92, 88, 85, 83, 85]
    },
    academics: {
      gpa: 2.9,
      currentAverage: 73,
      trend: [84, 81, 77, 74, 71, 73],
      recentDrop: -11,
      failedAssessments: 1,
      subjects: [
        { name: "Data Warehousing", grade: 68, status: "Warning" },
        { name: "Full-Stack Development", grade: 72, status: "Satisfactory" },
        { name: "Mobile App Development", grade: 77, status: "Satisfactory" },
        { name: "Software Testing", grade: 79, status: "Satisfactory" }
      ]
    },
    learningProgress: {
      missingAssignments: 2,
      submissionTimeliness: 78,
      lmsWeeklyHours: 3.8,
      videoCompletionRate: 70
    },
    participation: {
      score: 65,
      classEngagement: "Moderate",
      peerCollaboration: "Active",
      questionsAsked: 3
    },
    teacherNotes: [
      {
        id: "TN-13",
        date: "2026-10-22",
        teacher: "Prof. Reed (ISE)",
        sentiment: "Neutral",
        tag: "ETL Pipelines",
        text: "Struggling with dimensional modeling concepts in Data Warehousing."
      }
    ],
    interventionPlan: {
      status: "None",
      assignedTo: null,
      action: "ETL Architecture Practice",
      notes: "Check progress at next lab cycle."
    }
  }
];
