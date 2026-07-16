import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description:
    "Smoke test — DevScale Intelligence responds to a basic greeting and identifies itself.",
  async test(t) {
    await t.send("Hello, who are you?");
    t.succeeded();
    t.check(t.reply, includes("DevScale"));
  },
});
