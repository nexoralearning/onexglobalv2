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

// ── 1. POST /api/ai/notes ──────────────────────────────────────────────────────
router.post(["/ai/notes", "/api/ai/notes"], async (req, res) => {
  const { title = "", content = "", subject = "", action = "summarize" } = req.body;

  if (!content.trim() && !title.trim()) {
    res.status(400).json({ error: "Note title or content is required" });
    return;
  }

  const ai = getAI();
  const systemPrompt = `You are UniHub's expert AI Academic Study Tutor.
Subject: ${subject || "General Academic"}
Note Title: ${title}
Note Content:
${content}

Your goal is to assist students with high-quality, clear, concise, and structured output formatted in clean Markdown.`;

  let userPrompt = "";
  switch (action) {
    case "summarize":
      userPrompt = "Provide a clean 3-paragraph executive study summary of this note. Include main takeaway, core arguments, and conclusion.";
      break;
    case "key_points":
      userPrompt = "Extract 5 to 7 key bullet points, formulas, or concepts from this note that are essential for revision.";
      break;
    case "quiz":
      userPrompt = "Generate 4 practice exam questions based on this note. For each question, provide a spoiler-style hidden answer or clear solution key.";
      break;
    case "expand":
      userPrompt = "Expand on this note by explaining complex terms, adding real-world analogies, and explaining practical applications of these concepts.";
      break;
    default:
      userPrompt = "Summarize and structure this note for fast studying.";
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemPrompt}\n\nTask: ${userPrompt}`,
      });
      const text = response.text || "No response generated.";
      res.json({ result: text, action, timestamp: new Date().toISOString() });
      return;
    } catch (err) {
      logger.error(err, "Gemini API error on /api/ai/notes");
    }
  }

  // Fallback response if API key is not available or encounters error
  let fallbackText = "";
  if (action === "summarize") {
    fallbackText = `### Executive Summary for "${title || "Study Note"}"\n\n1. **Core Concept**: This note covers foundational concepts in ${subject || "your studies"}, focusing on key principles and practical applications.\n2. **Key Takeaway**: Understanding these fundamentals provides the groundwork for upcoming assignments and exams.\n3. **Application**: Review these concepts regularly and connect them with practical coursework examples.`;
  } else if (action === "key_points") {
    fallbackText = `### Key Revision Points for "${title || "Study Note"}"\n\n- **Principle 1**: Main theoretical foundation of ${subject || "the subject"}.\n- **Principle 2**: Critical method or framework introduced in lecture.\n- **Principle 3**: Common application and problem-solving technique.\n- **Principle 4**: Key terms and definitions to memorize for exams.`;
  } else if (action === "quiz") {
    fallbackText = `### Self-Test Quiz for "${title || "Study Note"}"\n\n1. **Q**: What is the main objective of ${subject || "this topic"}?\n   *Answer*: To establish core analytical and practical understanding.\n2. **Q**: What are two key components of this subject?\n   *Answer*: Theoretical framework and applied problem solving.\n3. **Q**: How does this topic connect to real-world scenarios?\n   *Answer*: It forms the basis for structured decision-making in the field.`;
  } else {
    fallbackText = `### Expanded Analysis for "${title || "Study Note"}"\n\nThis material introduces essential concepts in ${subject || "academic studies"}. To master this topic:\n- Relate the definitions directly to recent lecture examples.\n- Practice solving related past paper problems.\n- Summarize each section in your own words.`;
  }

  res.json({ result: fallbackText, action, fallback: true, timestamp: new Date().toISOString() });
});

// ── 2. POST /api/ai/past-papers ───────────────────────────────────────────────
router.post(["/ai/past-papers", "/api/ai/past-papers"], async (req, res) => {
  const { title = "", subject = "", university = "", year = "", questionText = "", action = "solve_step_by_step" } = req.body;

  const ai = getAI();
  const systemPrompt = `You are UniHub's AI Past Paper Solver & Exam Coach.
Paper: ${title} (${subject})
University: ${university} | Year: ${year}
Question / Subject Details:
${questionText || "General past paper revision"}

Provide structured, accurate, step-by-step guidance formatted in clean Markdown.`;

  let userPrompt = "";
  switch (action) {
    case "solve_step_by_step":
      userPrompt = "Provide a step-by-step solution methodology for questions in this paper/subject, explaining the reasoning behind each step.";
      break;
    case "exam_hints":
      userPrompt = "Give 5 expert exam hints, common student mistakes to avoid, and mark-scoring tips for this past paper topic.";
      break;
    case "formulas":
      userPrompt = "List essential formulas, definitions, and key terms required to pass this exam paper.";
      break;
    case "revision_guide":
      userPrompt = "Build a 30-minute high-yield crash revision strategy for this exam paper.";
      break;
    default:
      userPrompt = "Explain how to approach and solve questions from this past paper.";
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemPrompt}\n\nTask: ${userPrompt}`,
      });
      const text = response.text || "No response generated.";
      res.json({ result: text, action, timestamp: new Date().toISOString() });
      return;
    } catch (err) {
      logger.error(err, "Gemini API error on /api/ai/past-papers");
    }
  }

  const fallbackText = `### AI Exam Assistance for ${title || subject || "Past Paper"}\n\n` +
    `#### Step-by-Step Approach\n` +
    `1. **Analyze Requirements**: Read the question stem carefully and identify what variables/concepts are given.\n` +
    `2. **Recall Key Principles**: Retrieve the core formulas or frameworks relevant to ${subject || "this module"}.\n` +
    `3. **Execute Methodically**: Show all working clearly to maximize partial marks.\n` +
    `4. **Sanity Check**: Verify units, logic, and numerical consistency in your final answer.\n\n` +
    `*Tip: Focus on structuring your answer logically as examiners reward clear methodology.*`;

  res.json({ result: fallbackText, action, fallback: true, timestamp: new Date().toISOString() });
});

// ── 3. POST /api/ai/assignments ───────────────────────────────────────────────
router.post(["/ai/assignments", "/api/ai/assignments"], async (req, res) => {
  const { title = "", subject = "", description = "", action = "generate_outline" } = req.body;

  const ai = getAI();
  const systemPrompt = `You are UniHub's AI Academic Writing Assistant.
Assignment: ${title} (${subject})
Instructions / Details:
${description}

Provide clear, academic-grade assistance formatted in Markdown.`;

  let userPrompt = "";
  switch (action) {
    case "generate_outline":
      userPrompt = "Create a detailed section-by-section assignment outline with recommended word counts, key sub-headings, and argument structure.";
      break;
    case "research_points":
      userPrompt = "Suggest 5 key research angles, academic literature keywords, and foundational arguments to include in this assignment.";
      break;
    case "methodology":
      userPrompt = "Outline a step-by-step action plan to complete this assignment on schedule, breaking it into manageable sub-tasks.";
      break;
    case "writing_tips":
      userPrompt = "Provide academic phrasing tips, transition vocabulary, and a self-grading rubric checklist for this assignment.";
      break;
    default:
      userPrompt = "Provide guidance and an outline for completing this assignment.";
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemPrompt}\n\nTask: ${userPrompt}`,
      });
      const text = response.text || "No response generated.";
      res.json({ result: text, action, timestamp: new Date().toISOString() });
      return;
    } catch (err) {
      logger.error(err, "Gemini API error on /api/ai/assignments");
    }
  }

  const fallbackText = `### AI Assignment Plan for "${title || "Assignment"}"\n\n` +
    `#### Recommended Structure\n` +
    `- **1. Introduction (~15%)**: Hook, topic background, research question, thesis statement.\n` +
    `- **2. Main Body / Analysis (~70%)**:\n` +
    `  - Section A: Theoretical Framework & Literature Review.\n` +
    `  - Section B: Main Analysis & Evidence Evaluation.\n` +
    `  - Section C: Critical Discussion & Counter-arguments.\n` +
    `- **3. Conclusion (~15%)**: Summary of findings, implications, and final reflection.\n\n` +
    `#### Actionable Steps\n` +
    `- Step 1: Draft key thesis statement.\n` +
    `- Step 2: Gather 3-5 academic sources.\n` +
    `- Step 3: Write first rough draft without over-editing.\n` +
    `- Step 4: Proofread against assignment rubric.`;

  res.json({ result: fallbackText, action, fallback: true, timestamp: new Date().toISOString() });
});

// ── 4. POST /api/ai/cv-builder ────────────────────────────────────────────────
router.post(["/ai/cv-builder", "/api/ai/cv-builder"], async (req, res) => {
  const {
    fullName = "",
    email = "",
    phone = "",
    degree = "",
    university = "",
    targetRole = "",
    experience = "",
    skills = "",
    projects = "",
    certifications = "",
  } = req.body;

  const ai = getAI();
  const systemPrompt = `You are UniHub's AI Career Specialist and ATS Resume Writer.
User Details:
Name: ${fullName || "Student"}
Email: ${email} | Phone: ${phone}
Degree: ${degree} at ${university}
Target Job/Internship Role: ${targetRole || "Software / Business Analyst"}
Raw Experience Input: ${experience}
Skills: ${skills}
Projects: ${projects}
Certifications: ${certifications}

Generate a top-tier, highly polished, ATS-optimized CV in clear Markdown format. Use strong action verbs (e.g. Engineered, Spearheaded, Optimized, Orchestrated) and quantify achievements where possible.`;

  const userPrompt = `Create a complete, professional, beautifully structured CV with:
1. Professional Summary (3 strong lines)
2. Education (Degree, University, Relevant Coursework)
3. Technical & Soft Skills (Categorized into Technical, Soft Skills, Tools)
4. Projects / Experience (Bullet points with action verbs and impact)
5. Certifications & Achievements`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemPrompt}\n\nTask: ${userPrompt}`,
      });
      const text = response.text || "No response generated.";
      res.json({ cvMarkdown: text, timestamp: new Date().toISOString() });
      return;
    } catch (err) {
      logger.error(err, "Gemini API error on /api/ai/cv-builder");
    }
  }

  // Fallback CV Markdown
  const fallbackCV = `# ${fullName || "STUDENT NAME"}
${email || "student@university.edu"} | ${phone || "+1 234 567 890"} | ${university || "University"}

---

## 🎯 PROFESSIONAL SUMMARY
Driven and analytical **${degree || "Student"}** candidate seeking a **${targetRole || "Graduate / Internship"}** role. Proven ability to solve complex problems, collaborate effectively in team projects, and apply academic principles to practical challenges.

---

## 🎓 EDUCATION
**${university || "University"}**
*${degree || "Bachelor of Science"}*
- **Relevant Modules**: Data Analysis, System Design, Project Management, Software Engineering
- **Academic Standing**: Active Scholar & Student Leader

---

## 🛠️ TECHNICAL & SOFT SKILLS
- **Technical Skills**: ${skills || "Python, JavaScript, Data Analysis, SQL, Git"}
- **Tools & Platforms**: React, Node.js, Excel, VS Code, Figma
- **Soft Skills**: Problem Solving, Team Collaboration, Technical Writing, Time Management

---

## 🚀 PROJECTS & EXPERIENCE
${projects || `**University Capstone Project** | Lead Developer
- Spearheaded the design and deployment of a full-stack web application used by university peers.
- Optimized performance by 35% through efficient data structures and modular architecture.
- Collaborated with 4 team members to deliver project requirements 2 weeks ahead of schedule.`}

${experience ? `\n**Relevant Work / Extracurricular**\n${experience}` : ""}

---

## 📜 CERTIFICATIONS & EXTRACURRICULAR
- ${certifications || "Certified Student Developer | Leadership Workshop Graduate"}`;

  res.json({ cvMarkdown: fallbackCV, fallback: true, timestamp: new Date().toISOString() });
});

// ── 5. POST /api/ai/cv-correct ────────────────────────────────────────────────
router.post(["/ai/cv-correct", "/api/ai/cv-correct"], async (req, res) => {
  const { cvText = "", imageBase64 = "", mimeType = "image/jpeg", targetRole = "Graduate Role" } = req.body;

  const ai = getAI();
  const systemPrompt = `You are UniHub's Senior HR Executive & ATS Resume Reviewer.
Your goal is to thoroughly audit, correct, and upgrade a student's CV/Resume for target role: "${targetRole}".

Output format required (in clean Markdown):
1. **ATS Score & Executive Summary**: Score out of 100, top 3 strengths, and top 3 critical weaknesses.
2. **Grammar & Impact Corrections**: Specific bullet points that need stronger action verbs or quantified metrics.
3. **Corrected & Polished CV Version**: Complete, ready-to-copy Markdown version of the corrected CV with zero spelling/grammar errors, high-impact action verbs, and optimal ATS formatting.`;

  if (ai) {
    try {
      let contents: any = `${systemPrompt}\n\nOriginal CV Text:\n${cvText || "See attached image"}`;
      
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        contents = {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || "image/jpeg",
              },
            },
            {
              text: `${systemPrompt}\n\nPlease review, extract, audit, and correct the CV shown in this image. Provide the ATS score, grammar fixes, and full corrected Markdown CV.`,
            },
          ],
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
      });
      const text = response.text || "No feedback generated.";
      res.json({ result: text, timestamp: new Date().toISOString() });
      return;
    } catch (err) {
      logger.error(err, "Gemini API error on /api/ai/cv-correct");
    }
  }

  const fallbackText = `### 📋 CV Audit & Correction Report

#### 📊 ATS Score: 78/100
- **Strengths**: Clear section headings, relevant degree specified.
- **Areas for Improvement**: Passive voice in experience bullets, missing quantified metrics (e.g. %, $ saved, hours reduced).

#### 💡 Key Corrections & Upgrades:
1. Replace *"Worked on team project"* ➔ **"Spearheaded 4-person engineering team to deliver full-stack portal 2 weeks ahead of schedule."**
2. Replace *"Responsible for writing notes"* ➔ **"Curated and edited 50+ high-yield study guides accessed by 300+ university peers."**

---

### 🌟 Corrected ATS-Optimized CV

# STUDENT CV
*Target Role: ${targetRole}*

## 🎯 Professional Summary
Proactive academic candidate with hands-on technical and analytical project experience. Demonstrated ability to lead student groups, synthesize complex material, and deliver results under tight deadlines.

## 🎓 Education
**University Degree** | Relevant Modules: Data Systems, Project Management

## 🛠️ Key Skills
- **Core**: Analysis, Critical Thinking, Technical Documentation, Problem Solving
- **Tools**: MS Suite, Git, React, Python, Workspace Tools

## 🚀 Projects & Impact
- **Lead Developer | Academic Portal Project**
  - Engineered modular components that reduced page load latency by 25%.
  - Synthesized feedback from 100+ active student users to refine UI/UX flows.`;

  res.json({ result: fallbackText, fallback: true, timestamp: new Date().toISOString() });
});

// ── 6. POST /api/ai/vision-explain ───────────────────────────────────────────
router.post(["/ai/vision-explain", "/api/ai/vision-explain"], async (req, res) => {
  const { imageBase64 = "", mimeType = "image/jpeg", prompt = "", mode = "explain" } = req.body;

  if (!imageBase64) {
    res.status(400).json({ error: "An image is required for vision explanation" });
    return;
  }

  const ai = getAI();
  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  let systemInstruction = "You are UniHub's AI Academic Vision Assistant. Analyze student textbook photos, lecture slides, handwritten notes, exam questions, or assignment prompts.";
  if (mode === "math_solver") {
    systemInstruction += " Focus on solving math, science, or logic problems step-by-step with final answers highlighted.";
  } else if (mode === "convert_note") {
    systemInstruction += " Extract all written text and organize it into a beautifully formatted study note with bullet points, main concepts, and flashcard terms.";
  } else if (mode === "cv_scan") {
    systemInstruction += " Audit and correct the CV or resume shown in this image, providing ATS feedback and a corrected text version.";
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || "image/jpeg",
              },
            },
            {
              text: `${systemInstruction}\n\nUser Question/Instruction: ${prompt || "Explain and summarize the contents of this image in detail with key academic takeaways."}`,
            },
          ],
        },
      });

      const text = response.text || "Unable to analyze photo.";
      res.json({ result: text, timestamp: new Date().toISOString() });
      return;
    } catch (err) {
      logger.error(err, "Gemini API error on /api/ai/vision-explain");
    }
  }

  const fallbackText = `### 📷 Photo Analysis & Academic Explanation\n\n` +
    `#### 1. Image Overview\n` +
    `We detected academic material (textbook diagram / handwritten notes / assignment sheet).\n\n` +
    `#### 2. Key Insights & Explanations\n` +
    `- **Core Concept**: The image highlights foundational academic principles and structured problem steps.\n` +
    `- **Step-by-Step Breakdown**: Review the main headings and formulas visible in the capture.\n` +
    `- **Revision Tip**: Convert key terms into flashcards or add this directly to your UniHub Notes!`;

  res.json({ result: fallbackText, fallback: true, timestamp: new Date().toISOString() });
});

// ── 7. POST /api/ai/academic-overview ────────────────────────────────────────
router.post(["/ai/academic-overview", "/api/ai/academic-overview"], async (req, res) => {
  const { assignments = [], notes = [], query = "" } = req.body;

  const ai = getAI();
  const systemPrompt = `You are UniHub's Master Academic Advisor & Executive Study Strategist.
Analyze the student's current workload:
Assignments (${assignments.length} total): ${JSON.stringify(assignments.slice(0, 8))}
Notes (${notes.length} total): ${JSON.stringify(notes.slice(0, 8))}

User Question / Goal: ${query || "Give me a complete academic overview, prioritize my workload, and create an optimized study plan."}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt,
      });
      const text = response.text || "No overview generated.";
      res.json({ result: text, timestamp: new Date().toISOString() });
      return;
    } catch (err) {
      logger.error(err, "Gemini API error on /api/ai/academic-overview");
    }
  }

  const fallbackOverview = `### 🎓 Academic Workload Overview & Action Plan

#### 📅 Priority Tasks & Deadline Breakdown
- **Pending Assignments**: You currently have ${assignments.length} active assignments logged. Prioritize tasks with High priority and upcoming deadlines first.
- **Study Materials**: You have ${notes.length} notes saved across your modules.

#### 💡 Strategic 7-Day Study Schedule
1. **Days 1-2**: Focus on immediate assignment drafts & high-weight deliverables.
2. **Days 3-4**: Review saved notes for modules with upcoming tests.
3. **Days 5-7**: Practice past paper questions and join study group reviews.`;

  res.json({ result: fallbackOverview, fallback: true, timestamp: new Date().toISOString() });
});

export default router;
