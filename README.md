# BeaconEdu: Early Student Risk Identification & Intervention Platform

> **An Explainable, Human-in-the-Loop Decision Support Platform to Prevent Student Disengagement and Academic Failure.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

---

## 1. Problem Statement
Students often gradually fall behind academically or disengage from learning silently—missing homework, skipping morning classes, or experiencing conceptual roadblocks—without educators noticing in time to intervene before failure occurs.

## 2. Background & Multi-Indicator Context
Signals of disengagement and academic struggle exist across multiple dimensions:
- **Attendance & Velocity**: Consecutive absences, drop in attendance rate, unexcused tardiness.
- **Academic Performance**: Course averages, failed formative quizzes, steep downward grade trajectories.
- **Learning Progress & Timeliness**: Unsubmitted homework backlog, late turn-in percentages, LMS platform study hours.
- **Classroom Participation**: In-class question rate, collaborative group work engagement, withdrawal cues.
- **Teacher Qualitative Observations**: Qualitative notes capturing emotional cues, frustration, fatigue, and language barriers.

However, educators lack an integrated, efficient tool to synthesize these scattered signals early.

## 3. Challenge Addressed
**BeaconEdu** synthesizes these multidimensional signals into transparent risk indicators, delivering:
1. **Early Identification**: Proactive alert feed before grading deadlines make recovery impossible.
2. **Explainable AI (XAI)**: No black box—every risk score shows the exact points contributed by each indicator, top risk drivers, and protective student strengths.
3. **What-If Support Simulator**: Interactive modeling tool where educators simulate how attendance recovery or tutoring lifts student trajectory.
4. **Human-in-the-Loop Intervention Hub**: 4-stage Kanban workflow (Recommended → Approved → In Progress → Recovered) ensuring certified educators retain 100% decision authority.
5. **FERPA Privacy & Responsible Data Governance**: 1-click anonymization masking PII during staff reviews, client-side data privacy, and data export audits.

---

## 4. Key Constraints & Ethical Compliance

| Constraint | BeaconEdu Solution |
| :--- | :--- |
| **No Irreversible Automated Decisions** | System is strictly **advisory**. AI cannot unilaterally fail a student, assign disciplinary actions, or make punitive academic determinations. |
| **Explainability (XAI)** | Transparent score formula: `Composite Risk = Σ (Weight_i × SubScore_i)`. Educators can view and calibrate weights. |
| **FERPA & Privacy Protection** | 100% local client-side processing. One-click PII masking (names & photos replaced with hash tokens). |
| **Responsible Data Handling** | Export audit reports as CSV/JSON; no external telemetry or proprietary tracking. |

---

## 5. Technology Stack
- **Framework**: React 19 + Vite (Blazing fast HMR and zero-config builds)
- **Styling**: Vanilla CSS Design Tokens (Glassmorphism, dark/light modes, micro-animations, accessible contrast)
- **Icons & Visuals**: Lucide Icons & Canvas Confetti for student recovery celebrations
- **Zero-Cost Deployment**: Ready for Vercel, Netlify, GitHub Pages, or Cloudflare Pages.

---

## 6. Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Generates an optimized static production bundle in `dist/`.

---

## 7. 100% Free Deployment Instructions

### Option A: Deploy to Vercel (Recommended - 2 Minutes, Free)
1. Push this folder to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and log in with GitHub.
3. Click **"Add New Project"** and select your repository.
4. Leave settings as default (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).
5. Click **"Deploy"**. Your live URL will be active immediately.

### Option B: Deploy to Netlify (Free Drag-and-Drop)
1. Run `npm run build` locally to generate the `dist` folder.
2. Go to [Netlify Drop](https://app.netlify.com/drop).
3. Drag and drop the `dist/` folder into the browser window.
4. Your application is live within 30 seconds with a free `.netlify.app` domain.

### Option C: GitHub Pages (Free Automated CI/CD)
1. In your GitHub repository, go to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push to `main`; the included workflow will automatically build and publish to `https://<username>.github.io/<repo>/`.

---

## 8. Application Modules Walkthrough

```
BeaconEdu
├── 🧭 Top Navigation
│   ├── FERPA Anonymizer Toggle (1-click PII masking)
│   ├── Algorithm Weight Customizer (Inspect & adjust model weights)
│   ├── Privacy & Governance Center (FERPA principles, export CSV/JSON)
│   ├── "+ Add Student" Intake Modal
│   └── Light / Dark Mode Switcher
│
├── 📊 Cohort Pulse Dashboard
│   ├── 6 High-Impact Metric Cards (High Risk, Watchlist, Active Plans, Recoveries, Attendance)
│   ├── Real-Time Early Warning Alert Feed
│   ├── Stacked Risk Distribution Bar & Benchmark Indicator Health
│   └── Multi-Signal Filterable Student Table
│
├── 🔍 360° Student Review Modal
│   ├── 1. Explainability & Diagnostics (Feature impact waterfall)
│   ├── 2. Longitudinal Trends (6-Week grade vs attendance SVG chart)
│   ├── 3. Course-by-Course Mastery & LMS platform engagement
│   ├── 4. Qualitative Teacher Observation Log with sentiment flags
│   ├── 5. "What-If" Support Simulator (Interactive projection sliders)
│   └── 6. Actionable Intervention Plan (Educator decision approval & notes)
│
└── 📋 Intervention Management Hub
    └── 4-Stage Kanban Workflow (Recommended → Approved → In Progress → Resolved)
```

---

## 9. License
Distributed under the MIT License for educational and research use.
