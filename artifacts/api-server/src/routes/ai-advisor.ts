import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { logger } from "../lib/logger";

const router: Router = Router();

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// ── Shared interfaces ─────────────────────────────────────────────────────────

interface UserProfile {
  name: string;
  university: string;
  degree: string;
  year: number;
  country: string;
}

interface AssignmentSummary {
  title: string;
  subject: string;
  dueDate: string;
  status: string;
  priority: string;
}

interface NoteSummary {
  title: string;
  subject: string;
  category: string;
}

interface AdvisorRequest {
  user: UserProfile;
  assignments?: AssignmentSummary[];
  notes?: NoteSummary[];
}

interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

interface ChatRequest {
  user: UserProfile;
  messages: ChatMessageInput[];
  context?: { assignments?: AssignmentSummary[]; notes?: NoteSummary[] };
}

interface ScanContentRequest {
  text?: string;
  fileData?: string;
  mimeType?: string;
  context?: string;
}

// ── Algorithmic Score Calculator ──────────────────────────────────────────────

function computeAcademicHealth(
  pending: AssignmentSummary[],
  overdue: AssignmentSummary[],
  completed: AssignmentSummary[],
  notes: NoteSummary[],
  upcomingSoon: AssignmentSummary[],
): number {
  const total = pending.length + overdue.length + completed.length;
  if (total === 0 && notes.length === 0) return 75;

  let score = 75;

  if (total > 0) {
    const completionRate = completed.length / total;
    score += Math.round(completionRate * 20);
  }

  score -= Math.min(overdue.length * 8, 30);
  const highPriorityOverdue = overdue.filter(a => a.priority === "High");
  score -= highPriorityOverdue.length * 5;
  score -= Math.min(upcomingSoon.length * 3, 12);

  const noteSubjects = new Set(notes.map(n => n.subject.toLowerCase()));
  const assignmentSubjects = new Set([...pending, ...overdue].map(a => a.subject.toLowerCase()));
  const coveredSubjects = [...assignmentSubjects].filter(s => noteSubjects.has(s)).length;
  if (assignmentSubjects.size > 0) {
    score += Math.round((coveredSubjects / assignmentSubjects.size) * 10);
  } else if (notes.length > 0) {
    score += Math.min(notes.length * 2, 10);
  }

  return Math.max(10, Math.min(100, score));
}

function buildOverallStatus(score: number, overdue: AssignmentSummary[]): "On Track" | "Needs Attention" | "At Risk" | "Great Work" {
  if (overdue.length > 0) return score >= 70 ? "Needs Attention" : "At Risk";
  if (score >= 85) return "Great Work";
  if (score >= 65) return "On Track";
  if (score >= 45) return "Needs Attention";
  return "At Risk";
}

// ── POST /api/ai/overview ─────────────────────────────────────────────────────

router.post(["/ai/overview", "/api/ai/overview"], async (req, res) => {
  const { user, assignments = [], notes = [] } = req.body as AdvisorRequest;

  if (!user?.name) {
    res.status(400).json({ error: "User profile required" });
    return;
  }

  try {
    const now = Date.now();
    const pending   = assignments.filter(a => a.status === "Pending");
    const overdue   = assignments.filter(a => a.status === "Overdue");
    const completed = assignments.filter(a => a.status === "Completed");
    const upcomingSoon = pending.filter(a => {
      const diff = (new Date(a.dueDate).getTime() - now) / 86_400_000;
      return diff >= 0 && diff <= 7;
    });

    const score = computeAcademicHealth(pending, overdue, completed, notes, upcomingSoon);
    const overallStatus = buildOverallStatus(score, overdue);

    const ai = getAI();
    if (ai) {
      try {
        const prompt = `You are a top-tier academic AI advisor for ${user.name}, studying ${user.degree} (Year ${user.year}) at ${user.university}.
Analyze their current academic workload and return ONLY a valid JSON object.

Academic Data:
- Score: ${score}/100 (${overallStatus})
- Overdue Assignments (${overdue.length}): ${JSON.stringify(overdue)}
- Pending Assignments (${pending.length}): ${JSON.stringify(pending)}
- Completed Assignments (${completed.length}): ${JSON.stringify(completed)}
- Saved Study Notes (${notes.length}): ${JSON.stringify(notes)}

Return JSON strictly matching this structure:
{
  "headline": "A punchy, personalized 1-sentence assessment for ${user.name}",
  "insights": [
    { "type": "warning"|"tip"|"achievement"|"info", "title": "Short title", "body": "2-sentence practical advice" },
    { "type": "warning"|"tip"|"achievement"|"info", "title": "Short title", "body": "2-sentence practical advice" },
    { "type": "warning"|"tip"|"achievement"|"info", "title": "Short title", "body": "2-sentence practical advice" }
  ],
  "priorities": ["Top priority 1 with specific module name", "Top priority 2", "Top priority 3"],
  "weeklyPlan": "A 3-sentence high-yield study strategy for the upcoming 7 days.",
  "motivationalNote": "A short, encouraging quote or message for ${user.name}."
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: { responseMimeType: "application/json" },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          res.json({
            headline: parsed.headline,
            overallStatus,
            score,
            insights: parsed.insights || [],
            priorities: parsed.priorities || [],
            weeklyPlan: parsed.weeklyPlan || "",
            motivationalNote: parsed.motivationalNote || "",
          });
          return;
        }
      } catch (err) {
        logger.warn({ err }, "Gemini overview JSON failed, using dynamic structured response");
      }
    }

    // Dynamic fallback if API key is unconfigured
    const first = user.name.split(" ")[0];
    const headline = overdue.length > 0
      ? `${first}, you have ${overdue.length} overdue item${overdue.length > 1 ? "s" : ""} — submitting them now will quickly recover your GPA.`
      : `${first}, you are ${overallStatus.toLowerCase()} with ${pending.length} active task${pending.length !== 1 ? "s" : ""}.`;

    const insights = [
      {
        type: overdue.length > 0 ? "warning" : "tip",
        title: overdue.length > 0 ? "Resolve Overdue Submissions" : "Prioritize High-Weight Deliverables",
        body: overdue.length > 0
          ? `You have ${overdue.length} assignment(s) past the due date. Submit partial work now to minimize late penalties.`
          : `Focus your primary study hours on modules with upcoming deadlines or high credit weights.`,
      },
      {
        type: notes.length > 0 ? "achievement" : "info",
        title: notes.length > 0 ? "Active Note Library" : "Build Study Notes",
        body: notes.length > 0
          ? `You have ${notes.length} note(s) saved across your modules. Use active recall on key terms.`
          : `Adding lecture notes for active modules makes exam preparation up to 40% faster.`,
      },
    ];

    const priorities = overdue.length > 0
      ? overdue.map(a => `Submit overdue task "${a.title}" (${a.subject})`)
      : pending.slice(0, 3).map(a => `Work on "${a.title}" (${a.subject})`);

    res.json({
      headline,
      overallStatus,
      score,
      insights,
      priorities: priorities.length > 0 ? priorities : ["Review module syllabus", "Add upcoming deadlines to UniHub"],
      weeklyPlan: "Schedule two 90-minute deep work blocks each day. Tackle the most challenging assignment early in the morning when focus is sharpest.",
      motivationalNote: `Consistency isn't about perfection, ${first} — it's about making progress every day.`,
    });
  } catch (err) {
    logger.error(err, "AI overview error");
    res.status(500).json({ error: "Failed to generate overview." });
  }
});

// ── POST /api/ai/chat (STREAMING REAL GEMINI CHAT) ────────────────────────────

router.post(["/ai/chat", "/api/ai/chat"], async (req, res) => {
  const { user, messages = [], context = {} } = req.body as ChatRequest;

  if (!user?.name || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "User profile and messages are required" });
    return;
  }

  const assignments = context?.assignments ?? [];
  const notes       = context?.notes ?? [];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const pending   = assignments.filter((a: AssignmentSummary) => a.status === "Pending");
  const overdue   = assignments.filter((a: AssignmentSummary) => a.status === "Overdue");
  const completed = assignments.filter((a: AssignmentSummary) => a.status === "Completed");

  const systemInstruction = `You are UniHub's AI Academic Advisor & Study Companion. You are conversing directly with ${user.name}, a Year ${user.year} ${user.degree} student at ${user.university} (${user.country}).

Live Academic Context of ${user.name}:
- Pending assignments (${pending.length}): ${pending.map((a: AssignmentSummary) => `"${a.title}" in ${a.subject} (due ${a.dueDate || "N/A"})`).join(", ") || "None"}
- Overdue assignments (${overdue.length}): ${overdue.map((a: AssignmentSummary) => `"${a.title}" in ${a.subject}`).join(", ") || "None"}
- Completed assignments: ${completed.length}
- Saved study notes (${notes.length}): ${notes.map((n: NoteSummary) => `"${n.title}" (${n.subject})`).join(", ") || "None"}

Guidelines:
1. READ and directly address the user's latest prompt and full conversation history. Never return generic pre-written script templates or flat commands.
2. Provide intelligent, insightful, empathetic, and academic advice. If the user asks a specific question (e.g. about math, essay writing, coding, career advice, or their assignments), answer it directly with high expertise.
3. Use clean Markdown formatting with clear headings, bullet points, or code blocks where appropriate.
4. Keep tone friendly, supportive, and academically sharp.`;

  const ai = getAI();

  if (ai) {
    try {
      // Build clean contents for Gemini
      const formattedContents = messages
        .filter(m => (m.content && m.content.trim().length > 0) || m.image)
        .map(m => {
          const role = m.role === "assistant" ? "model" : "user";
          const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

          if (m.image) {
            const cleanBase64 = m.image.replace(/^data:image\/\w+;base64,/, "");
            const mimeMatch = m.image.match(/^data:(image\/\w+);base64,/);
            const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
            parts.push({
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            });
          }

          parts.push({ text: m.content && m.content.trim() ? m.content : "Analyze the attached image and assist me." });

          return { role, parts };
        });

      if (formattedContents.length === 0) {
        formattedContents.push({
          role: "user",
          parts: [{ text: "Hello! How can you assist me with my studies today?" }],
        });
      }

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ content: chunk.text })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    } catch (err) {
      logger.error({ err }, "Gemini API streaming error in /api/ai/chat");
    }
  }

  // Fallback if API key is not present or stream failed
  const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content || "Hello";
  const fallbackReply = `Hello ${user.name.split(" ")[0]}! I noticed you asked: "${lastUserMsg}".\n\nI am your AI Academic Companion. I can help you analyze your ${pending.length} pending assignments, draft essay outlines, explain complex study topics, solve math problems from photos, or prepare an ATS-ready CV.\n\nPlease check your GEMINI_API_KEY settings to unlock full real-time Gemini streaming capabilities!`;

  const words = fallbackReply.split(" ");
  let index = 0;
  const interval = setInterval(() => {
    if (index >= words.length) {
      clearInterval(interval);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }
    const chunk = words.slice(index, index + 4).join(" ") + (index + 4 < words.length ? " " : "");
    res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    index += 4;
  }, 30);

  req.on("close", () => clearInterval(interval));
});

// ── POST /api/ai/scan-content (REAL GEMINI SCANNER) ───────────────────────────

router.post(["/ai/scan-content", "/api/ai/scan-content"], async (req, res) => {
  const { text = "", fileData, mimeType, context } = req.body as ScanContentRequest;

  if (!text.trim() && !fileData) {
    res.status(400).json({ error: "Either text content or a file upload is required" });
    return;
  }

  const ai = getAI();
  if (ai) {
    try {
      const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

      if (fileData) {
        const cleanBase64 = fileData.replace(/^data:[^;]+;base64,/, "");
        parts.push({
          inlineData: {
            mimeType: mimeType || "image/jpeg",
            data: cleanBase64,
          },
        });
      }

      const prompt = `Analyze this academic content (document / photo / note / essay / code) and return a strictly valid JSON object.
Context: ${context || "University Coursework"}
Extracted Text:
${text || "See attached file"}

Return JSON format strictly as:
{
  "summary": "Executive summary of the content in 2-3 sentences.",
  "difficulty": "Easy" | "Medium" | "Hard" | "Very Hard",
  "topics": ["Topic 1", "Topic 2", "Topic 3"],
  "approach": "Recommended study or writing methodology in 2 sentences.",
  "estimatedHours": 3,
  "keyPoints": ["Key takeaway or formula 1", "Key takeaway 2", "Key takeaway 3", "Key takeaway 4"],
  "contentType": "Essay" | "Report" | "Lecture Notes" | "Code" | "Research Paper" | "Exam Question"
}`;

      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts },
        config: { responseMimeType: "application/json" },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        res.json({
          summary: parsed.summary || "Academic material scanned.",
          difficulty: parsed.difficulty || "Medium",
          topics: parsed.topics || ["General Academic"],
          approach: parsed.approach || "Review main concepts systematically.",
          estimatedHours: parsed.estimatedHours || 2,
          keyPoints: parsed.keyPoints || [],
          contentType: parsed.contentType || "Study Material",
          scannedAt: new Date().toISOString(),
        });
        return;
      }
    } catch (err) {
      logger.error(err, "Gemini scan-content error");
    }
  }

  // Fallback
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  res.json({
    summary: `Content scanned (${wordCount} words). Review key points for study.`,
    difficulty: wordCount > 500 ? "Hard" : "Medium",
    topics: [context || "Academic Material"],
    approach: "Focus on main ideas, headings, and key definitions first.",
    estimatedHours: Math.max(1, Math.round(wordCount / 500)),
    keyPoints: ["Identify main thesis or problem statement", "Note key terminology", "Review practical examples"],
    contentType: "Study Material",
    scannedAt: new Date().toISOString(),
  });
});

export default router;

