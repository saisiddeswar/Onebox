import { Request, Response } from "express";
import { esClient } from "../elasticsearch/elasticClinet";

export const getEmails = async (req: Request, res: Response) => {
  const result = await esClient.search({
    index: "emails",
    size: 50,
    sort: [
      { date: { order: "desc" } }  // latest first
    ]
  });

  res.json(result.hits.hits);
};
export const getEmailById = async (req: Request, res: Response) => {

  const id = req.params.id;

  try {
    const result = await esClient.get({
      index: "emails",
      id
    });

    res.json(result);
  } catch (err) {
    res.status(404).json({ message: "Email not found" });
  }
};

