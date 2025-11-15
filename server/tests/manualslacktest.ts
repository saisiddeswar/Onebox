import { sendSlackNotification } from "../src/slack/slackNotifier";

async function run() {
  console.log("➡ Sending test Slack notification...");

  await sendSlackNotification({
    subject: "Test Email Notification",
    from: "test@example.com",
    category: "interested",
    ruleId: "manual-test"
  });

  console.log("✔ Test completed.");
}

run();
