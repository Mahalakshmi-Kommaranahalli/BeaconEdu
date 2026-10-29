// Default educator-configurable weights (must sum to 1.0)
export const defaultWeights = {
  academics: 0.30,
  attendance: 0.25,
  progress: 0.20,
  participation: 0.15,
  feedback: 0.10,
};

/**
 * Calculates normalized sub-risk scores (0-100 where 100 = highest risk)
 */
export function calculateComponentRisks(student) {
  // 1. Academic Risk
  // Average below 60 -> 100, 70 -> 70, 80 -> 35, 90+ -> 5
  const avg = student.academics.currentAverage;
  let academicBaseRisk = Math.max(0, Math.min(100, (100 - avg) * 1.5));
  // Add penalty for steep negative trend / failed assessments
  const dropPenalty = student.academics.recentDrop < 0 ? Math.min(25, Math.abs(student.academics.recentDrop) * 1.2) : -5;
  const failPenalty = (student.academics.failedAssessments || 0) * 8;
  const academicRisk = Math.max(0, Math.min(100, academicBaseRisk + dropPenalty + failPenalty));

  // 2. Attendance Risk
  // Attendance rate: 95%+ -> 5, 85% -> 40, 75% -> 75, <70% -> 95+
  const attRate = student.attendance.overallRate;
  let attBaseRisk = Math.max(0, Math.min(100, (95 - attRate) * 3.2));
  // Consecutive absences spike risk
  const consecutivePenalty = (student.attendance.consecutiveAbsences || 0) * 7;
  const attendanceRisk = Math.max(0, Math.min(100, attBaseRisk + consecutivePenalty));

  // 3. Learning Progress & Timeliness Risk
  // Missing assignments (each adds ~12 pts), timeliness (below 80% penalizes)
  const missingPenalty = (student.learningProgress.missingAssignments || 0) * 12;
  const timelinessRisk = Math.max(0, (90 - student.learningProgress.submissionTimeliness) * 1.1);
  const progressRisk = Math.max(0, Math.min(100, missingPenalty + timelinessRisk));

  // 4. Participation & Disengagement Risk
  // In-class participation score (0-100) inverted
  const partScore = student.participation.score;
  const participationRisk = Math.max(0, Math.min(100, 100 - partScore));

  // 5. Teacher Qualitative Sentiment Risk
  let sentimentScore = 30; // neutral baseline
  if (student.teacherNotes && student.teacherNotes.length > 0) {
    let concernCount = 0;
    let urgentCount = 0;
    let positiveCount = 0;

    student.teacherNotes.forEach((n) => {
      if (n.sentiment === "Urgent") urgentCount++;
      else if (n.sentiment === "Concern") concernCount++;
      else if (n.sentiment === "Positive") positiveCount++;
    });

    sentimentScore = Math.max(0, Math.min(100, 40 + urgentCount * 30 + concernCount * 18 - positiveCount * 25));
  }
  const feedbackRisk = sentimentScore;

  return {
    academicRisk: Math.round(academicRisk),
    attendanceRisk: Math.round(attendanceRisk),
    progressRisk: Math.round(progressRisk),
    participationRisk: Math.round(participationRisk),
    feedbackRisk: Math.round(feedbackRisk),
  };
}

/**
 * Calculates the overall explainable risk score and diagnostic factors
 */
export function calculateStudentRisk(student, weights = defaultWeights) {
  const components = calculateComponentRisks(student);

  // Weighted sum
  const compositeScore = Math.round(
    components.academicRisk * weights.academics +
    components.attendanceRisk * weights.attendance +
    components.progressRisk * weights.progress +
    components.participationRisk * weights.participation +
    components.feedbackRisk * weights.feedback
  );

  // Classification into tiers
  let riskTier = "Low Risk";
  let tierColor = "#10b981"; // Emerald
  let badgeClass = "badge-low";

  if (compositeScore >= 68) {
    riskTier = "High Risk";
    tierColor = "#ef4444"; // Coral / Red
    badgeClass = "badge-high";
  } else if (compositeScore >= 38) {
    riskTier = "Moderate Risk";
    tierColor = "#f59e0b"; // Amber
    badgeClass = "badge-moderate";
  }

  // Explainability Diagnostics: Identify Primary Drivers
  const drivers = [];
  const protectiveFactors = [];
  const suggestedInterventions = [];

  // Academic breakdown
  if (components.academicRisk >= 60) {
    drivers.push({
      factor: "Academic Vulnerability",
      description: `Current average is ${student.academics.currentAverage}% with ${student.academics.failedAssessments} failing assessment(s) and a ${student.academics.recentDrop}% recent grade drop.`,
      severity: components.academicRisk >= 80 ? "critical" : "warning",
      weightImpact: Math.round(components.academicRisk * weights.academics),
    });
    suggestedInterventions.push("Targeted 1-on-1 subject tutoring", "Modular re-assessment opportunity");
  } else if (student.academics.currentAverage >= 80) {
    protectiveFactors.push(`Solid academic foundation (${student.academics.currentAverage}% average)`);
  }

  // Attendance breakdown
  if (components.attendanceRisk >= 55) {
    drivers.push({
      factor: "Attendance Drop",
      description: `Overall attendance rate is ${student.attendance.overallRate}% with ${student.attendance.consecutiveAbsences} consecutive absences and ${student.attendance.unexcusedCount} unexcused missed days.`,
      severity: components.attendanceRisk >= 75 ? "critical" : "warning",
      weightImpact: Math.round(components.attendanceRisk * weights.attendance),
    });
    suggestedInterventions.push("Attendance coordinator check-in", "Family transportation / morning routine consultation");
  } else if (student.attendance.overallRate >= 92) {
    protectiveFactors.push(`Consistent attendance record (${student.attendance.overallRate}%)`);
  }

  // Progress / Timeliness breakdown
  if (components.progressRisk >= 50) {
    drivers.push({
      factor: "Assignment Backlog & Late Submissions",
      description: `${student.learningProgress.missingAssignments} missing assignment(s) and only ${student.learningProgress.submissionTimeliness}% on-time submission rate.`,
      severity: components.progressRisk >= 70 ? "critical" : "warning",
      weightImpact: Math.round(components.progressRisk * weights.progress),
    });
    suggestedInterventions.push("LMS deadline pacing planner", "Study hall catch-up block");
  } else if (student.learningProgress.missingAssignments === 0) {
    protectiveFactors.push("Zero missing assignments; submissions consistently on time");
  }

  // Participation & Engagement breakdown
  if (components.participationRisk >= 55) {
    drivers.push({
      factor: "Section Disengagement",
      description: `Section participation score is ${student.participation.score}/100. Observed behavior indicates ${student.participation.peerCollaboration.toLowerCase()} engagement.`,
      severity: components.participationRisk >= 75 ? "critical" : "warning",
      weightImpact: Math.round(components.participationRisk * weights.participation),
    });
    suggestedInterventions.push("Low-stakes small group collaboration", "Interest-based inquiry project alignment");
  } else if (student.participation.score >= 75) {
    protectiveFactors.push(`Active section voice and leadership (${student.participation.score}/100 participation)`);
  }

  // Teacher Observation breakdown
  if (components.feedbackRisk >= 55) {
    drivers.push({
      factor: "Educator Concern Flags",
      description: `Qualitative teacher notes document recurring distress, focus decline, or course friction.`,
      severity: components.feedbackRisk >= 75 ? "critical" : "warning",
      weightImpact: Math.round(components.feedbackRisk * weights.feedback),
    });
    suggestedInterventions.push("Multi-disciplinary educator case conference", "Guidance counselor check-in");
  }

  // Deduplicate suggested interventions
  const uniqueInterventions = Array.from(new Set(suggestedInterventions));

  return {
    compositeScore,
    riskTier,
    tierColor,
    badgeClass,
    components,
    drivers,
    protectiveFactors,
    suggestedInterventions: uniqueInterventions.slice(0, 3),
  };
}

/**
 * "What-If" Scenario Simulator:
 * Allows educators to simulate how specific support interventions will reduce risk
 */
export function simulateRiskProjection(student, adjustments, weights = defaultWeights) {
  // Create a synthetic clone
  const simulatedStudent = JSON.parse(JSON.stringify(student));

  if (adjustments.attendanceBoost !== undefined) {
    simulatedStudent.attendance.overallRate = Math.min(100, simulatedStudent.attendance.overallRate + adjustments.attendanceBoost);
    simulatedStudent.attendance.consecutiveAbsences = Math.max(0, simulatedStudent.attendance.consecutiveAbsences - 2);
  }

  if (adjustments.missingAssignmentsResolved !== undefined) {
    simulatedStudent.learningProgress.missingAssignments = Math.max(0, simulatedStudent.learningProgress.missingAssignments - adjustments.missingAssignmentsResolved);
    simulatedStudent.learningProgress.submissionTimeliness = Math.min(100, simulatedStudent.learningProgress.submissionTimeliness + (adjustments.missingAssignmentsResolved * 7));
  }

  if (adjustments.gradeGain !== undefined) {
    simulatedStudent.academics.currentAverage = Math.min(100, simulatedStudent.academics.currentAverage + adjustments.gradeGain);
    simulatedStudent.academics.recentDrop = Math.min(10, simulatedStudent.academics.recentDrop + adjustments.gradeGain);
    if (adjustments.gradeGain >= 10 && simulatedStudent.academics.failedAssessments > 0) {
      simulatedStudent.academics.failedAssessments -= 1;
    }
  }

  if (adjustments.participationBoost !== undefined) {
    simulatedStudent.participation.score = Math.min(100, simulatedStudent.participation.score + adjustments.participationBoost);
  }

  const baseline = calculateStudentRisk(student, weights);
  const projected = calculateStudentRisk(simulatedStudent, weights);

  return {
    baselineScore: baseline.compositeScore,
    baselineTier: baseline.riskTier,
    projectedScore: projected.compositeScore,
    projectedTier: projected.riskTier,
    scoreReduction: baseline.compositeScore - projected.compositeScore,
    newComponents: projected.components,
  };
}
