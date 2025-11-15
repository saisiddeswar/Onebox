import { Client } from "@elastic/elasticsearch";

// Create ES client normally
export const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
});

// Prevent index creation in Jest tests
if (process.env.NODE_ENV === "test") {
  console.log("🧪 Jest test mode: Elasticsearch index creation skipped");
  // skip running createEmailIndex
} else {
  // Run index creation only in dev & production
  createEmailIndex();
}

export async function createEmailIndex() {
  const exists = await esClient.indices.exists({ index: "emails" });

  if (!exists) {
    await esClient.indices.create({
      index: "emails",
      body: {
        mappings: {
          properties: {
            subject: { type: "text" },
            from: { type: "text" },
            to: { type: "text" },
            body: { type: "text" },
            account: { type: "keyword" },
            folder: { type: "keyword" },
            date: { type: "date" }
          }
        }
      }
    });

    console.log("🟢 Elastic Index 'emails' created");
  }
}
