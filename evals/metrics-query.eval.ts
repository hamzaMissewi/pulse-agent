import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description:
    "Agent calls query_metrics when asked about DevScale revenue and returns a concrete answer.",
  async test(t) {
    await t.send("How did revenue do this week compared to last week?");
    t.succeeded();
    t.calledTool("query_metrics");
    t.check(t.reply, includes("revenue"));
  },
});
