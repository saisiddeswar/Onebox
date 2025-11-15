import { GoogleGenerativeAI } from "@google/generative-ai";
import { ALLOWED_CATEGORIES, AICategory } from "./categories";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function aiCategorizeEmail({
  subject,
  body
}: {
  subject?: string;
  body?: string;
}): Promise<{ category: AICategory; confidence: number }> {

  const prompt = `
You are an email classifier. Read the email and return ONLY one category from this list:
${ALLOWED_CATEGORIES.join(", ")}

Email Subject: ${subject}
Email Body: ${body}

Return ONLY JSON in this exact format:
{
  "category": "<category>",
  "confidence": <number between 0 and 1>
}
`;

  const result = await model.generateContent(prompt);

  // NEW: updated Gemini response field (2025)
  const raw = result.response.text() ?? "{}";

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { category: "unknown", confidence: 0.0 };
  }

  return {
    category: parsed.category as AICategory,
    confidence: parsed.confidence ?? 0.5
  };
}
