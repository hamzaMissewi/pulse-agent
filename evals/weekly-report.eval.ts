import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description:
    "Agent delegates to the investigator subagent when asked about anomalies.",
  async test(t) {
    await t.send(
      "Run the weekly business report and have the investigator check anomalies.",
    );
    t.succeeded();
    t.calledTool("query_metrics");
    t.calledTool("run_analysis");
  },
});
