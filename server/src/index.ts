import express from "express";
import { PORT } from "./config/env";
import { createEmailIndex } from "./elasticsearch/elasticClient";
import { startImap } from "./imap/imapclient";
import router from "./routes";
import { logger } from "./utils/logger";

const app = express();

app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  createEmailIndex();
  startImap();
});


