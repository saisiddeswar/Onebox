import { hybridCategorizeEmail } from "../categorizer/hybridCategorizer";
import { esClient } from "../elasticsearch/elasticClient";

export async function processEmailJob(jobData: any) {
  const { subject, body, from, to, date, uid, account } = jobData;

  const { category, ruleId, source, confidence } =
    await hybridCategorizeEmail({ subject, body });

  const id = `${account}-${uid}`;

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
      source,
      confidence
    }
  });

  return { id, category, ruleId, source };
}
