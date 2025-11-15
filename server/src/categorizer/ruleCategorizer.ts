import fs from "fs";
import path from "path";
import { Rule, CategoryName } from "./types";

const RULES_PATH = path.join(__dirname, "../config/rules.json");

function loadRules(): Rule[] {
  try {
    const raw = fs.readFileSync(RULES_PATH, "utf8");
    const parsed = JSON.parse(raw) as Rule[];
    return parsed.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  } catch (err) {
    console.error("Failed to load rules:", err);
    return [];
  }
}

function textContainsAny(text: string | undefined, arr?: string[]) {
  if (!text || !arr || arr.length === 0) return false;
  const lower = text.toLowerCase();
  return arr.some((s) => lower.includes(s.toLowerCase()));
}

export function categorizeEmail(data: {
  subject?: string;
  body?: string;
}): { category: CategoryName; ruleId?: string } {
  const rules = loadRules();

  const subject = data.subject || "";
  const body = data.body || "";

  for (const r of rules) {
    // regex match
    if (r.regex) {
      try {
        const rx = new RegExp(r.regex, "i");
        if (rx.test(subject) || rx.test(body)) {
          return { category: r.category, ruleId: r.id };
        }
      } catch (err) {
        console.warn(`Invalid regex in rule ${r.id}:`, err);
      }
    }

    // keyword match
    if (r.keywords && r.keywords.length > 0) {
      if (textContainsAny(subject, r.keywords) || textContainsAny(body, r.keywords)) {
        return { category: r.category, ruleId: r.id };
      }
    }
  }

  return { category: "unknown" };
}
