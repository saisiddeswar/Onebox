import { Request, Response } from "express";

export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Backend server is healthy ✅",
    time: new Date().toISOString()
  });
};
