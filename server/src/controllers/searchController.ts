import { Request, Response } from "express";
import { esClient } from "../elasticsearch/elasticClient";

export const searchEmails = async (req: Request, res: Response) => {

  const q = req.query.q as string;

  if (!q) {
    return res.status(400).json({
      message: "Please provide a search query. Example: ?q=meeting"
    });
  }

  const result = await esClient.search({
    index: "emails",
    query: {
      multi_match: {
        query: q,
        fields: ["subject", "body", "from", "to"]
      }
    },
    size: 50
  });

  res.json(result.hits.hits);
};
