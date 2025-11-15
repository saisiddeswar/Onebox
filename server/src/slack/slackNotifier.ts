import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || "";
const NOTIFY_CATEGORIES = (process.env.SLACK_NOTIFY_CATEGORIES || "")
  .split(",")
  .map(s => s.trim().toLowerCase());

export async function sendSlackNotification({
  subject,
  from,
  category,
  ruleId
}: {
  subject: string;
  from: string;
  category: string;
  ruleId?: string;
}) {
  if (!SLACK_WEBHOOK_URL) {
    console.warn("⚠️ No SLACK_WEBHOOK_URL set, skipping Slack notify");
    return;
  }

  if (!NOTIFY_CATEGORIES.includes(category.toLowerCase())) {
    return;
  }

  const payload = {
    text: `📩 *New Email Categorized as:* *${category.toUpperCase()}*\n*Subject:* ${subject}\n*From:* ${from}\n*Rule:* ${ruleId || "AI/unknown"}`
  };

  try {
    await axios.post(SLACK_WEBHOOK_URL, payload);
    console.log(`🔔 Slack notified: [${category}] ${subject}`);
  } catch (err) {
    console.error("❌ Slack notify failed:", err);
  }
}
