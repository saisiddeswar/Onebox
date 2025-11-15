import { hybridCategorizeEmail } from "../src/categorizer/hybridCategorizer";

async function run() {
  console.log("➡ RULE MATCH TEST");
  console.log(
    await hybridCategorizeEmail({
      subject: "I am interested in your product",
      body: "Tell me more"
    })
  );

  console.log("\n➡ AI FALLBACK TEST");
  console.log(
    await hybridCategorizeEmail({
      subject: "Let's schedule a technical sync",
      body: "We should discuss design patterns"
    })
  );
}

run();
