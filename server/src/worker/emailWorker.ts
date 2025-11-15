import { Worker } from "bullmq";
import { connection } from "../queue/queues";
import { esClient } from "../elasticsearch/elasticClient";
import { categorizeEmail } from "../categorizer/ruleCategorizer";
import { sendSlackNotification } from "../slack/slackNotifier";
// import { sendEmailWebhook } from "../webhook/webhookSender";
import { hybridCategorizeEmail } from "../categorizer/hybridCategorizer";


const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { subject, from, to, body, date, uid, account } = job.data;

    // 🔍 1. Categorize email using rules
    const { category, ruleId } =  await hybridCategorizeEmail({
      subject,
      body,
    });
    await sendSlackNotification({
  subject,
  from,
  category,
  ruleId
});
// await sendEmailWebhook({
//   subject,
//   from,
//   to,
//   body,
//   date,
//   uid,
//   account,
//   category,
//   ruleId
// });



    const id = `${account}-${uid}`;

    // 📝 2. Save to Elasticsearch with category
    await esClient.index({
      index: "emails",
      id,
      document: {
        subject,
        from,
        to,
        body,
        date,
        folder: "INBOX",
        account,
        category,
        ruleId,
      }
    });

    console.log(`✅ Saved to Elasticsearch [${category}] : ${subject}`);
  },
  { connection }
);

worker.on("failed", (job, err) => {
  console.error("❌ Job failed:", job?.id, err);
});

console.log("🚀 Worker started with rule-based categorization");
