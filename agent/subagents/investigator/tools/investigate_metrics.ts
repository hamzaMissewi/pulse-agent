import { defineTool } from "eve/tools";
import { z } from "zod";
import {
  compareMetric,
  currentWeek,
  getWeeklyRows,
  metricDefinitions,
  metricKeys,
  previousWeek,
  type MetricKey,
} from "../../../lib/devscale-data.js";

const metricSchema = z.enum(metricKeys);

export default defineTool({
  description:
    "Investigate week-over-week DevScale business metric movement and return notable changes, supported drivers, and watchouts.",
  inputSchema: z.object({
    question: z.string().optional(),
    metrics: z.array(metricSchema).optional().describe("Metrics to inspect. Defaults to all."),
    thresholdPercent: z.number().min(0).max(100).default(15),
  }),
  async execute({ metrics, question, thresholdPercent }) {
    const selectedMetrics: readonly MetricKey[] =
      metrics && metrics.length > 0 ? metrics : metricKeys;
    const [previous, current] = getWeeklyRows();
    const findings = selectedMetrics
      .map((metric) => {
        const comparison = compareMetric(metric);
        const absPercent = Math.abs(comparison.percentChange ?? 0);

        return {
          metric,
          definition: metricDefinitions[metric],
          aggregation: comparison.aggregation,
          previous: comparison.previous,
          current: comparison.current,
          absoluteChange: comparison.absoluteChange,
          percentChange: comparison.percentChange,
          severity:
            absPercent >= 25 ? "headline" : absPercent >= thresholdPercent ? "notable" : "normal",
          interpretation: interpret(metric, comparison.absoluteChange, comparison.percentChange),
        };
      })
      .sort((left, right) => Math.abs(right.percentChange ?? 0) - Math.abs(left.percentChange ?? 0));

    const deliveryRatePrevious = rate(previous.projectsDelivered, previous.clientsActive);
    const deliveryRateCurrent = rate(current.projectsDelivered, current.clientsActive);
    const taskRatePrevious = rate(previous.tasksCompleted, previous.projectsDelivered);
    const taskRateCurrent = rate(current.tasksCompleted, current.projectsDelivered);

    return {
      question,
      weekRanges: {
        previousWeek,
        currentWeek,
      },
      thresholdPercent,
      findings,
      funnelChecks: {
        deliveryRate: {
          previous: deliveryRatePrevious,
          current: deliveryRateCurrent,
          pointChange: deliveryRateCurrent - deliveryRatePrevious,
        },
        taskEfficiency: {
          previous: taskRatePrevious,
          current: taskRateCurrent,
          pointChange: taskRateCurrent - taskRatePrevious,
        },
      },
      likelyDrivers: buildDrivers({
        current,
        deliveryRateCurrent,
        deliveryRatePrevious,
        previous,
        taskEfficiencyCurrent: taskRateCurrent,
        taskEfficiencyPrevious: taskRatePrevious,
      }),
      watchouts: [
        "This dataset covers only two weeks, so seasonality and campaign attribution are not available.",
        "Client satisfaction and team utilization are point-in-time snapshots, not smoothed averages.",
        "Treat driver language as supported interpretation, not causal proof.",
      ],
    };
  },
  toModelOutput(output) {
    return {
      type: "json",
      value: {
        weekRanges: output.weekRanges,
        findings: output.findings.map((f) => ({
          metric: f.metric,
          severity: f.severity,
          interpretation: f.interpretation,
          percentChange: f.percentChange,
        })),
        funnelChecks: output.funnelChecks,
        likelyDrivers: output.likelyDrivers,
        watchouts: output.watchouts,
      },
    };
  },
});

function interpret(metric: MetricKey, absoluteChange: number, percentChange: number | null) {
  const direction = absoluteChange >= 0 ? "increased" : "decreased";
  const magnitude =
    percentChange === null ? `${Math.abs(absoluteChange).toLocaleString()} units` : formatPercent(Math.abs(percentChange));

  return `${metric} ${direction} by ${magnitude} week over week.`;
}

function buildDrivers({
  current,
  deliveryRateCurrent,
  deliveryRatePrevious,
  previous,
  taskEfficiencyCurrent,
  taskEfficiencyPrevious,
}: {
  readonly current: ReturnType<typeof getWeeklyRows>[number];
  readonly deliveryRateCurrent: number;
  readonly deliveryRatePrevious: number;
  readonly previous: ReturnType<typeof getWeeklyRows>[number];
  readonly taskEfficiencyCurrent: number;
  readonly taskEfficiencyPrevious: number;
}) {
  const drivers: string[] = [];

  if (current.projectsDelivered > previous.projectsDelivered && current.clientsActive > previous.clientsActive) {
    drivers.push("Project delivery volume and active clients both rose, showing organic growth.");
  }

  if (deliveryRateCurrent >= deliveryRatePrevious) {
    drivers.push("Delivery rate per client held or improved while client count increased.");
  } else {
    drivers.push("Delivery rate per client softened, so growth may be stretching team capacity.");
  }

  if (taskEfficiencyCurrent >= taskEfficiencyPrevious) {
    drivers.push("Tasks per project held or improved, supporting delivery throughput.");
  } else {
    drivers.push("Tasks per project softened, suggesting more complex engagements or context switching.");
  }

  if (current.clientSatisfaction >= previous.clientSatisfaction) {
    drivers.push("Client satisfaction improved during the growth period.");
  }

  if (current.revenue > previous.revenue) {
    const revenueGrowth = ((current.revenue - previous.revenue) / previous.revenue) * 100;
    drivers.push(`Revenue grew ${revenueGrowth.toFixed(1)}% week over week, indicating stronger engagement mix.`);
  }

  return drivers;
}

function rate(numerator: number, denominator: number) {
  return denominator === 0 ? 0 : numerator / denominator;
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}
