import {Client } from "@elastic/elasticsearch"
export const esClient = new Client({
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});
export const createEmailIndex = async () => {
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
