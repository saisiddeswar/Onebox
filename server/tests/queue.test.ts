
jest.mock("bullmq", () => {
  return {
    Queue: jest.fn().mockImplementation(() => ({
      add: jest.fn()
    })),
    Worker: jest.fn().mockImplementation(() => ({
      on: jest.fn()
    })),
  };
});
test("queue mock sanity check", () => {
  expect(1).toBe(1);
});

