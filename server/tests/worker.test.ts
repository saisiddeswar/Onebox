import { processEmailJob } from "../src/worker/processEmail";
import { esClient } from "../src/elasticsearch/elasticClient";

// 🔥 MOCK ELASTICSEARCH
jest.mock("../src/elasticsearch/elasticClient", () => ({
  esClient: {
    index: jest.fn().mockResolvedValue({ result: "created" })
  }
}));

describe("Worker Email Processing", () => {

  test("should categorize email and index to ES", async () => {
    const result = await processEmailJob({
      subject: "Invoice for your order",
      body: "Here is your invoice",
      uid: 123,
      account: "test@gmail.com"
    });

    // Expect proper category
    expect(result.category).toBe("invoice");

    // Expect esClient.index to be called once
    expect(esClient.index).toHaveBeenCalledTimes(1);

    // Check what was indexed
    const callArgs = (esClient.index as jest.Mock).mock.calls[0][0];

    expect(callArgs.index).toBe("emails");
    expect(callArgs.document.category).toBe("invoice");
    expect(callArgs.document.subject).toBe("Invoice for your order");
  });

});
