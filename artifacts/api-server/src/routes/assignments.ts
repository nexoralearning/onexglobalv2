import { Router } from "express";
import { logger } from "../lib/logger";

const router: Router = Router();

// ── Keyword maps ─────────────────────────────────────────────────────────────

const HARD_KEYWORDS = [
  "dissertation", "thesis", "research paper", "literature review", "systematic review",
  "empirical study", "meta-analysis", "original research", "capstone", "final project",
  "comprehensive exam", "proof", "algorithm design", "machine learning", "data analysis",
  "statistical analysis", "case study", "audit", "security", "architecture",
];
const MEDIUM_KEYWORDS = [
  "essay", "report", "presentation", "group project", "lab report", "case analysis",
  "annotated bibliography", "proposal", "design document", "review", "critique",
  "comparative analysis", "implementation", "programme", "project plan",
];
const EASY_KEYWORDS = [
  "quiz", "summary", "reflection", "journal", "discussion", "response",
  "reading", "worksheet", "exercise", "problem set", "homework", "short answer",
  "log", "blog post", "forum post",
];

const SUBJECT_TOPICS: Record<string, string[]> = {
  "computer science":   ["Algorithms", "Data Structures", "Programming", "Software Design", "Complexity Analysis"],
  "mathematics":        ["Calculus", "Linear Algebra", "Proof Techniques", "Number Theory", "Statistics"],
  "economics":          ["Microeconomics", "Macroeconomics", "Econometrics", "Market Analysis", "Policy Evaluation"],
  "business":           ["Strategy", "Finance", "Marketing", "Organisational Behaviour", "Operations"],
  "psychology":         ["Research Methods", "Cognitive Science", "Behavioural Analysis", "Statistics", "Ethics"],
  "biology":            ["Cell Biology", "Genetics", "Ecology", "Biochemistry", "Scientific Method"],
  "chemistry":          ["Organic Chemistry", "Thermodynamics", "Lab Techniques", "Reaction Mechanisms", "Safety"],
  "physics":            ["Mechanics", "Electromagnetism", "Thermodynamics", "Quantum Theory", "Problem Solving"],
  "law":                ["Case Analysis", "Statutory Interpretation", "Legal Reasoning", "Precedent", "Legal Writing"],
  "history":            ["Primary Sources", "Historiography", "Critical Analysis", "Chronology", "Argument Construction"],
  "engineering":        ["Design Principles", "Technical Drawing", "Systems Thinking", "Problem Solving", "Standards"],
  "medicine":           ["Clinical Reasoning", "Anatomy", "Pathophysiology", "Evidence-Based Practice", "Ethics"],
  "nursing":            ["Patient Care", "Clinical Assessment", "Pharmacology", "Evidence-Based Practice", "Ethics"],
  "sociology":          ["Social Theory", "Research Methods", "Data Interpretation", "Social Policy", "Ethics"],
  "philosophy":         ["Logic", "Argumentation", "Critical Reading", "Ethical Theory", "Metaphysics"],
  "literature":         ["Close Reading", "Literary Theory", "Textual Analysis", "Contextualisation", "Argumentation"],
  "finance":            ["Financial Analysis", "Valuation", "Risk Management", "Accounting", "Modelling"],
  "accounting":         ["Financial Statements", "Auditing", "Tax", "Management Accounting", "Standards"],
  "architecture":       ["Design Process", "Technical Drawing", "Materials", "Space Planning", "History"],
  "education":          ["Pedagogy", "Curriculum Design", "Assessment", "Child Development", "Reflective Practice"],
};

const APPROACH_BY_TYPE: Record<string, string> = {
  essay:        "Start by outlining your argument before writing. Draft a clear thesis, support each point with evidence, and leave time to revise for coherence and referencing.",
  report:       "Follow the standard structure: introduction, methodology, findings, and conclusion. Use headings, keep your writing concise, and cite all data sources.",
  research:     "Begin with a focused literature search to understand existing work. Clearly state your research question, choose an appropriate methodology, and document every decision.",
  presentation: "Open with a strong hook, limit each slide to one key idea, and rehearse aloud at least twice. Prepare for likely questions and time yourself strictly.",
  project:      "Break the work into milestones with internal deadlines. Identify dependencies early, communicate regularly with team members, and keep a shared progress log.",
  lab:          "Re-read the protocol before your session. Record raw observations in real time, note any deviations, and complete your write-up while the experiment is fresh.",
  analysis:     "Identify the key variables or arguments first. Use a structured framework to organise your analysis, support every claim with evidence, and state limitations clearly.",
  default:      "Read the brief carefully and identify the marking criteria. Create a realistic schedule working backwards from the due date, and allocate extra time for revision.",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function detectDifficulty(title: string, description: string): "Easy" | "Medium" | "Hard" | "Very Hard" {
  const combined = `${title} ${description}`.toLowerCase();
  const wordCount = description.trim().split(/\s+/).length;

  if (HARD_KEYWORDS.some(k => combined.includes(k))) {
    return wordCount > 150 ? "Very Hard" : "Hard";
  }
  if (MEDIUM_KEYWORDS.some(k => combined.includes(k))) return "Medium";
  if (EASY_KEYWORDS.some(k => combined.includes(k))) return "Easy";

  // Fallback: use description length as a proxy for complexity
  if (wordCount > 100) return "Medium";
  return "Easy";
}

function estimateHours(difficulty: string, title: string, description: string): number {
  const base: Record<string, number> = { Easy: 2, Medium: 6, Hard: 14, "Very Hard": 30 };
  let hours = base[difficulty] ?? 6;

  // Adjust for specific task types
  const combined = `${title} ${description}`.toLowerCase();
  if (combined.includes("group")) hours = Math.round(hours * 0.7);      // shared effort
  if (combined.includes("presentation")) hours = Math.round(hours * 1.2); // rehearsal overhead
  if (combined.includes("research") || combined.includes("literature")) hours = Math.round(hours * 1.3);

  return Math.max(1, Math.min(hours, 40));
}

function extractTopics(title: string, subject: string): string[] {
  const subjectKey = Object.keys(SUBJECT_TOPICS).find(k =>
    subject.toLowerCase().includes(k) || k.includes(subject.toLowerCase()),
  );
  const subjectTopics = subjectKey ? SUBJECT_TOPICS[subjectKey] : [];

  // Extract capitalised phrases from the title as additional topics
  const titleTerms = title.match(/\b[A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?\b/g) ?? [];
  const unique = [...new Set([...titleTerms, ...subjectTopics])].slice(0, 4);
  return unique.length > 0 ? unique : ["Critical Thinking", "Academic Writing", "Research Skills"];
}

function buildApproach(title: string, description: string): string {
  const combined = `${title} ${description}`.toLowerCase();

  if (combined.includes("essay") || combined.includes("argument")) return APPROACH_BY_TYPE.essay;
  if (combined.includes("report") || combined.includes("lab report")) return APPROACH_BY_TYPE.report;
  if (combined.includes("research") || combined.includes("dissertation") || combined.includes("thesis")) return APPROACH_BY_TYPE.research;
  if (combined.includes("presentation") || combined.includes("slides")) return APPROACH_BY_TYPE.presentation;
  if (combined.includes("group") || combined.includes("team") || combined.includes("project")) return APPROACH_BY_TYPE.project;
  if (combined.includes("lab") || combined.includes("experiment")) return APPROACH_BY_TYPE.lab;
  if (combined.includes("analysis") || combined.includes("case study") || combined.includes("critique")) return APPROACH_BY_TYPE.analysis;

  return APPROACH_BY_TYPE.default;
}

function buildSummary(title: string, subject: string, difficulty: string, dueDate: string): string {
  const due = dueDate ? new Date(dueDate) : null;
  const daysLeft = due ? Math.ceil((due.getTime() - Date.now()) / 86_400_000) : null;

  const urgency =
    daysLeft === null ? "" :
    daysLeft < 0     ? " which is already overdue" :
    daysLeft === 0   ? " due today" :
    daysLeft === 1   ? " due tomorrow" :
    daysLeft <= 3    ? ` due in ${daysLeft} days` :
    ` due in ${daysLeft} days`;

  const diffDesc: Record<string, string> = {
    Easy: "a straightforward",
    Medium: "a moderately complex",
    Hard: "a challenging",
    "Very Hard": "a highly demanding",
  };

  const subjectNote = subject ? ` for ${subject}` : "";
  return `This is ${diffDesc[difficulty] ?? "a"} task${subjectNote}${urgency}. "${title}" will require focused effort and good time management to complete well.`;
}

// ── Route ─────────────────────────────────────────────────────────────────────

router.post("/assignments/scan", (req, res) => {
  const { title, subject = "", description = "", dueDate = "", priority = "Medium" } = req.body as {
    title?: string; subject?: string; description?: string; dueDate?: string; priority?: string;
  };

  if (!title) {
    res.status(400).json({ error: "Assignment title is required" });
    return;
  }

  try {
    const difficulty = detectDifficulty(title, description);
    const topics     = extractTopics(title, subject);
    const approach   = buildApproach(title, description);
    const summary    = buildSummary(title, subject, difficulty, dueDate);
    const estimatedHours = estimateHours(difficulty, title, description);

    logger.info({ title, subject, difficulty }, "Assignment scanned (algorithmic)");

    res.json({
      summary,
      difficulty,
      topics,
      approach,
      estimatedHours,
      scannedAt: new Date().toISOString(),
    });
  } catch (err) {
    logger.error(err, "Assignment scan error");
    res.status(500).json({ error: "Failed to scan assignment. Please try again." });
  }
});

export default router;
