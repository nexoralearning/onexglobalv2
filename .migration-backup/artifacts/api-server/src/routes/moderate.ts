import { Router } from "express";

const router: Router = Router();

router.post("/moderate", async (req, res) => {
  const { image } = req.body as { image?: string };

  if (!image || !image.startsWith("data:image/")) {
    res.status(400).json({ error: "Invalid or missing image data URL" });
    return;
  }

  const apiKey = process.env["OPENAI_API_KEY"];

  // No key configured — default to safe so users aren't blocked.
  if (!apiKey) {
    res.json({ safe: true });
    return;
  }

  try {
    // Lazy import so the server starts cleanly even without credentials.
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'You are a content moderator for a student academic platform. Examine this image and reply with ONLY one of:\n"SAFE" — appropriate for a school/university environment.\n"UNSAFE: <reason>" — if it contains nudity, sexual content, graphic violence, hate symbols, drugs, or content inappropriate for students.\nKeep reasons brief (5 words max). No other text.',
            },
            {
              type: "image_url",
              image_url: { url: image, detail: "low" },
            },
          ],
        },
      ],
      max_tokens: 30,
    });

    const text = (completion.choices[0]?.message?.content ?? "SAFE").trim();
    const safe = text.toUpperCase().startsWith("SAFE");
    const reason = safe
      ? undefined
      : text.replace(/^UNSAFE:\s*/i, "").trim() || "Inappropriate content";

    res.json({ safe, reason });
  } catch (err) {
    console.error("Moderation error:", err);
    // On any failure, default to safe to avoid blocking the user.
    res.json({ safe: true });
  }
});

export default router;
