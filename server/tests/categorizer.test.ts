import { categorizeEmail } from "../src/categorizer/ruleCategorizer";

describe("Rule-based Categorizer", () => {

  test("classifies invoice emails", () => {
    const result = categorizeEmail({
      subject: "Invoice for your order",
      body: ""
    });

    expect(result.category).toBe("invoice");
    expect(result.ruleId).toBe("r2");
  });

  test("classifies interested emails", () => {
    const result = categorizeEmail({
      subject: "I am interested",
      body: ""
    });

    expect(result.category).toBe("interested");
  });

  test("classifies follow-up emails", () => {
    const result = categorizeEmail({
      subject: "Just following up",
      body: ""
    });

    expect(result.category).toBe("follow_up");
  });

  test("returns unknown when no rule matches", () => {
    const result = categorizeEmail({
      subject: "Hello friend",
      body: ""
    });

    expect(result.category).toBe("unknown");
  });

});
