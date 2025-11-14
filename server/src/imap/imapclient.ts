import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { esClient } from "../elasticsearch/elasticClient";
import { logger } from "../utils/logger";

export const createImapClient = () => {
    const client = new ImapFlow({
    host: process.env.IMAP_HOST??"",
    port: Number(process.env.IMAP_PORT),
    secure: true,
    auth: {
      user: process.env.IMAP_USER??"",
      pass: process.env.IMAP_PASS??"",
    },
  });

  return client;
}

export const startImap=async()=>{
    const client=createImapClient();
    try {
        await client.connect();
        logger.info("IMAP Client connected successfully.");
    } catch (error) {
        logger.error("Failed to connect IMAP Client:");
    }
    let lock=await client.getMailboxLock('INBOX');
    try {
        logger.info("fetching 30 days mail");
        const since = new Date();
        since .setDate(since.getDate() - 2);
        for await (const message of client.fetch({ since }, { uid: true, envelope: true, source: true })) {
          if(!message.source) continue;
      const parsed = await simpleParser(message.source);

      logger.info(`📧 Email: ${parsed.subject}`);
      await esClient.index({
  index: "emails",
  document: {
    subject: parsed.subject,
    from: parsed.from?.text,
    to: parsed.to?.text?? "",
    body: parsed.text,
    folder: "INBOX",
    account: process.env.IMAP_USER,
    date: parsed.date || new Date()
  }
});

    }

    } finally{
        lock.release();
        
    }
    client.on("exists", async () => {
    logger.info("🔔 New email detected!");

    // Fetch the newest email
    let lock = await client.getMailboxLock("INBOX");
    try {
if (!client.mailbox || !client.mailbox.exists) return;
      const message = await client.fetchOne(client.mailbox.exists, { source: true, envelope: true });
      if (!message?.source) return;
      const parsed = await simpleParser(message.source);

      logger.info("📩 New Email Received:");
      logger.info(`From: ${parsed.from?.text}`);
      logger.info(`Subject: ${parsed.subject}`);
    } finally {
      lock.release();
    }
  });

}