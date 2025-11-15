import axios from "axios";
import fs from "fs";
import path from "path";

interface WebhookConfig {
  emailProcessed: string[];
}

const CONFIG_PATH = path.join(__dirname, "../config/webhooks.json");

function loadWebhookConfig(): WebhookConfig {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ Failed to load webhook config");
    return { emailProcessed: [] };
  }
}

export async function sendEmailWebhook(payload: any) {
  const config = loadWebhookConfig();

  for (const url of config.emailProcessed) {
    try {
      await axios.post(url, payload, {
        timeout: 5000 // 5 sec timeout
      });

      console.log(`🌐 Webhook sent → ${url}`);
    } catch (err) {
      console.error(`❌ Webhook failed → ${url}`, err.message);
    }
  }
}
