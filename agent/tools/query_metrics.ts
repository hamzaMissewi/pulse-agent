import { defineTool } from "eve/tools";
import { z } from "zod";
import {
  currentWeek,
  metricDefinitions,
  metricKeys,
  previousWeek,
  queryMetricRows,
  type MetricKey,
} from "../lib/devscale-data.js";

const metricSchema = z.enum(metricKeys);

export default defineTool({
  description:
    "Read DevScale business metrics for projects delivered, revenue, tasks completed, client satisfaction, and team utilization. Use before answering metric questions.",
  inputSchema: z.object({
    metrics: z.array(metricSchema).optional().describe("Metrics to include. Defaults to all."),
    startDate: z.string().optional().describe("Inclusive YYYY-MM-DD start date."),
    endDate: z.string().optional().describe("Inclusive YYYY-MM-DD end date."),
    grain: z.enum(["daily", "weekly"]).default("daily"),
  }),
  async execute({ endDate, grain, metrics, startDate }) {
    const selectedMetrics: readonly MetricKey[] =
      metrics && metrics.length > 0 ? metrics : metricKeys;
    const rows = queryMetricRows({
      endDate,
      grain,
      metrics: selectedMetrics,
      startDate,
    });

    return {
      dataset: "DevScale business metrics",
      availableRange: {
        startDate: previousWeek.startDate,
        endDate: currentWeek.endDate,
      },
      currentWeek,
      previousWeek,
      grain,
      metrics: selectedMetrics,
      definitions: Object.fromEntries(
        selectedMetrics.map((metric) => [metric, metricDefinitions[metric]]),
      ),
      rows,
      notes: [
        "Flow metrics (projectsDelivered, revenue, tasksCompleted) are summed across a period.",
        "Stock metrics (clientsActive, clientSatisfaction, teamUtilization) use end-of-period values.",
        "DevScale Digital Solutions — www.devscale.online",
      ],
    };
  },
});
