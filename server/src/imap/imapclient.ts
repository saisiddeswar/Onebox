import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { logger } from "../utils/logger";
import { emailQueue } from "../queue/queues";

export const createImapClient = () => {
  const client = new ImapFlow({
    host: process.env.IMAP_HOST ?? "",
    port: Number(process.env.IMAP_PORT),
    secure: true,
    auth: {
      user: process.env.IMAP_USER ?? "",
      pass: process.env.IMAP_PASS ?? "",
    },
  });
  return client;
};

export const startImap = async () => {
  const client = createImapClient();

  try {
    await client.connect();
    logger.info("✔ IMAP Client connected.");
  } catch (error) {
    logger.error("❌ Failed to connect IMAP Client");
    return;
  }

  let lock = await client.getMailboxLock("INBOX");

  try {
    logger.info("📨 Fetching last 2 days emails...");

    const since = new Date();
    since.setDate(since.getDate() - 2);

    for await (const message of client.fetch({ since }, { uid: true, envelope: true, source: true })) {
      if (!message.source) continue;

      const parsed = await simpleParser(message.source);

      await emailQueue.add("incomingEmail", {
  subject: parsed.subject,
  from: parsed.from?.text,
  to: parsed.to?.text ?? "",
  body: parsed.text,
  date: parsed.date || new Date(),
  uid: message.uid || Date.now(),
  account: process.env.IMAP_USER,

  headers: parsed.headers // ← add this (optional but useful)
});


      logger.info(`📩 Email enqueued: ${parsed.subject}`);
    }

  } finally {
    lock.release();
  }

  // Listen for new emails
  client.on("exists", async () => {
    logger.info("🔔 New email detected!");

    let lock = await client.getMailboxLock("INBOX");

    try {
      if (!client.mailbox || !client.mailbox.exists) return;

      const message = await client.fetchOne(client.mailbox.exists, { source: true, envelope: true });
      if (!message?.source) return;

      const parsed = await simpleParser(message.source);

      await emailQueue.add("incomingEmail", {
        subject: parsed.subject,
        from: parsed.from?.text,
        to: parsed.to?.text ?? "",
        body: parsed.text,
        date: parsed.date || new Date(),
        uid: message.uid || Date.now(),
        account: process.env.IMAP_USER,
      });

      logger.info(`📬 New email ENQUEUED: ${parsed.subject}`);

    } finally {
      lock.release();
    }
  });
};
