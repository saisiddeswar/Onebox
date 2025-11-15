export const ALLOWED_CATEGORIES = [
  "interested",
  "invoice",
  "follow_up",
  "job",
  "spam",
  "unknown"
] as const;

export type AICategory = typeof ALLOWED_CATEGORIES[number];
