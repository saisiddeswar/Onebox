import { categorizeEmail as ruleCategorize } from "./ruleCategorizer";
import { aiCategorizeEmail } from "./aiCategorizer";

export async function hybridCategorizeEmail({
  subject,
  body
}: {
  subject?: string;
  body?: string;
}) {
  // 1. Try RULE-BASED first
  const ruleResult = ruleCategorize({ subject, body });

  if (ruleResult.category !== "unknown") {
    return {
      ...ruleResult,
      source: "rule"
    };
  }

  // 2. Fallback to AI
  const aiResult = await aiCategorizeEmail({ subject, body });

  return {
    category: aiResult.category,
    ruleId: "ai_fallback",
    confidence: aiResult.confidence,
    source: "ai"
  };
}
