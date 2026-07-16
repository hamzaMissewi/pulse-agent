import { defineSchedule } from "eve/schedules";

const currentWeek = "2026-06-29 through 2026-07-05";
const previousWeek = "2026-06-22 through 2026-06-28";

export default defineSchedule({
  // Every Monday at 09:00 UTC.
  //
  // In a deployed Eve app this becomes a Vercel Cron Job. During local
  // recording, Eve exposes the same path through:
  //   POST /eve/v1/dev/schedules/monday-summary
  //
  // That local trigger is useful on camera because it starts the exact same
  // schedule run without waiting for the real weekly cron tick.
  cron: "0 9 * * 1",

  // This is Eve's fire-and-forget task mode: the schedule supplies a prompt,
  // and Eve starts an agent session to complete it. The output is visible in
  // the run stream/logs, and the agent can still call tools, subagents, and
  // the sandbox while it works.
  markdown: [
    `Run the DevScale weekly business report for ${currentWeek} versus ${previousWeek}.`,
    "Use query_metrics with weekly grain.",
    "Delegate anomaly review to the investigator subagent.",
    "Run run_analysis for revenue and tasksCompleted so Python executes in the Eve sandbox.",
    "Finish with a concise executive summary covering project delivery, revenue trend, client growth, and an Agent Stack note that calls out Eve, Vercel Workflow, Vercel Sandbox, AI Gateway, and the web channel.",
  ].join(" "),
});
