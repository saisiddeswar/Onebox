import { Queue } from "bullmq";

export const connection = {
  host: "127.0.0.1",
  port: 6379,
};

export const emailQueue = new Queue("emailQueue", {
  connection,
  defaultJobOptions: {
    attempts: 5,           // retry 5 times
    backoff: {
      type: "exponential", // wait 1s → 2s → 4s → 8s → 16s
    },
    removeOnComplete: true,
    removeOnFail: false     // keep failed jobs for debugging
  }
});
