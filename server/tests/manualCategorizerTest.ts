import { categorizeEmail } from "../src/categorizer/ruleCategorizer";

function testCase(subject: string, body: string) {
  const result = categorizeEmail({ subject, body });
  console.log(`Test -> "${subject}"`);
  console.log("Result:", result);
  console.log("--------");
}

// Test cases
testCase("Invoice for your order", "");
testCase("I am interested in your product", "");
testCase("Just following up on my request", "");
testCase("Lottery prize winner", "");
testCase("Hello there", "");
