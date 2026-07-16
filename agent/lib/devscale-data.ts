export const metricKeys = [
  "projectsDelivered",
  "clientsActive",
  "revenue",
  "tasksCompleted",
  "clientSatisfaction",
  "teamUtilization",
] as const;

export type MetricKey = (typeof metricKeys)[number];

export type MetricRow = {
  readonly date: string;
  readonly projectsDelivered: number;
  readonly clientsActive: number;
  readonly revenue: number;
  readonly tasksCompleted: number;
  readonly clientSatisfaction: number;
  readonly teamUtilization: number;
};

export type Grain = "daily" | "weekly";

export const currentWeek = {
  label: "Current week",
  startDate: "2026-06-29",
  endDate: "2026-07-05",
};

export const previousWeek = {
  label: "Previous week",
  startDate: "2026-06-22",
  endDate: "2026-06-28",
};

export const metricDefinitions: Record<MetricKey, string> = {
  projectsDelivered: "Projects delivered or milestones completed during the period. Sum daily rows.",
  clientsActive: "Active client accounts at end of period. Use end-of-period value.",
  revenue: "Daily revenue in USD from client engagements. Sum daily rows.",
  tasksCompleted: "Development tasks (features, fixes, integrations) completed. Sum daily rows.",
  clientSatisfaction: "Average client satisfaction score (0-100) for the period. Use end-of-period value.",
  teamUtilization: "Team utilization percentage across active projects. Use end-of-period value.",
};

export const metricRows: readonly MetricRow[] = [
  {
    date: "2026-06-22",
    projectsDelivered: 3,
    clientsActive: 18,
    revenue: 12400,
    tasksCompleted: 24,
    clientSatisfaction: 87,
    teamUtilization: 78,
  },
  {
    date: "2026-06-23",
    projectsDelivered: 4,
    clientsActive: 18,
    revenue: 14200,
    tasksCompleted: 31,
    clientSatisfaction: 88,
    teamUtilization: 82,
  },
  {
    date: "2026-06-24",
    projectsDelivered: 2,
    clientsActive: 19,
    revenue: 11800,
    tasksCompleted: 22,
    clientSatisfaction: 86,
    teamUtilization: 75,
  },
  {
    date: "2026-06-25",
    projectsDelivered: 5,
    clientsActive: 19,
    revenue: 16500,
    tasksCompleted: 35,
    clientSatisfaction: 89,
    teamUtilization: 85,
  },
  {
    date: "2026-06-26",
    projectsDelivered: 4,
    clientsActive: 20,
    revenue: 15100,
    tasksCompleted: 29,
    clientSatisfaction: 90,
    teamUtilization: 88,
  },
  {
    date: "2026-06-27",
    projectsDelivered: 2,
    clientsActive: 20,
    revenue: 9800,
    tasksCompleted: 18,
    clientSatisfaction: 88,
    teamUtilization: 72,
  },
  {
    date: "2026-06-28",
    projectsDelivered: 1,
    clientsActive: 20,
    revenue: 7200,
    tasksCompleted: 12,
    clientSatisfaction: 87,
    teamUtilization: 65,
  },
  {
    date: "2026-06-29",
    projectsDelivered: 5,
    clientsActive: 21,
    revenue: 18200,
    tasksCompleted: 38,
    clientSatisfaction: 91,
    teamUtilization: 89,
  },
  {
    date: "2026-06-30",
    projectsDelivered: 6,
    clientsActive: 21,
    revenue: 21400,
    tasksCompleted: 42,
    clientSatisfaction: 92,
    teamUtilization: 91,
  },
  {
    date: "2026-07-01",
    projectsDelivered: 4,
    clientsActive: 22,
    revenue: 17600,
    tasksCompleted: 33,
    clientSatisfaction: 90,
    teamUtilization: 87,
  },
  {
    date: "2026-07-02",
    projectsDelivered: 7,
    clientsActive: 22,
    revenue: 24800,
    tasksCompleted: 48,
    clientSatisfaction: 93,
    teamUtilization: 94,
  },
  {
    date: "2026-07-03",
    projectsDelivered: 5,
    clientsActive: 23,
    revenue: 19500,
    tasksCompleted: 36,
    clientSatisfaction: 91,
    teamUtilization: 90,
  },
  {
    date: "2026-07-04",
    projectsDelivered: 3,
    clientsActive: 23,
    revenue: 13200,
    tasksCompleted: 25,
    clientSatisfaction: 89,
    teamUtilization: 80,
  },
  {
    date: "2026-07-05",
    projectsDelivered: 4,
    clientsActive: 24,
    revenue: 16800,
    tasksCompleted: 30,
    clientSatisfaction: 92,
    teamUtilization: 86,
  },
];

const stockMetrics = new Set<MetricKey>(["clientsActive", "clientSatisfaction", "teamUtilization"]);

export function filterRows(startDate = previousWeek.startDate, endDate = currentWeek.endDate) {
  return metricRows.filter((row) => row.date >= startDate && row.date <= endDate);
}

export function aggregatePeriod(
  label: string,
  startDate: string,
  endDate: string,
  rows = filterRows(startDate, endDate),
) {
  const periodRows = rows.filter((row) => row.date >= startDate && row.date <= endDate);
  const last = periodRows.at(-1);

  return {
    label,
    startDate,
    endDate,
    projectsDelivered: sum(periodRows, "projectsDelivered"),
    clientsActive: last?.clientsActive ?? 0,
    revenue: sum(periodRows, "revenue"),
    tasksCompleted: sum(periodRows, "tasksCompleted"),
    clientSatisfaction: last?.clientSatisfaction ?? 0,
    teamUtilization: last?.teamUtilization ?? 0,
  };
}

export function getWeeklyRows() {
  return [
    aggregatePeriod(previousWeek.label, previousWeek.startDate, previousWeek.endDate),
    aggregatePeriod(currentWeek.label, currentWeek.startDate, currentWeek.endDate),
  ];
}

export function queryMetricRows({
  endDate,
  grain,
  metrics,
  startDate,
}: {
  readonly endDate?: string;
  readonly grain: Grain;
  readonly metrics: readonly MetricKey[];
  readonly startDate?: string;
}) {
  const rows =
    grain === "weekly" ? getWeeklyRows() : filterRows(startDate, endDate);

  return rows.map((row) => {
    const selected: Record<string, number | string> = {
      label: "label" in row ? row.label : row.date,
      startDate: "startDate" in row ? row.startDate : row.date,
      endDate: "endDate" in row ? row.endDate : row.date,
    };

    for (const metric of metrics) {
      selected[metric] = row[metric];
    }

    return selected;
  });
}

export function compareMetric(metric: MetricKey) {
  const [previous, current] = getWeeklyRows();
  const previousValue = previous[metric];
  const currentValue = current[metric];
  const absoluteChange = currentValue - previousValue;
  const percentChange = previousValue === 0 ? null : (absoluteChange / previousValue) * 100;

  return {
    metric,
    aggregation: stockMetrics.has(metric) ? "end_of_period" : "sum",
    previous: {
      label: previous.label,
      startDate: previous.startDate,
      endDate: previous.endDate,
      value: previousValue,
    },
    current: {
      label: current.label,
      startDate: current.startDate,
      endDate: current.endDate,
      value: currentValue,
    },
    absoluteChange,
    percentChange,
  };
}

export function getDashboardSnapshot() {
  const weekly = getWeeklyRows();

  return {
    previousWeek: weekly[0],
    currentWeek: weekly[1],
    comparisons: [
      compareMetric("projectsDelivered"),
      compareMetric("revenue"),
      compareMetric("tasksCompleted"),
      compareMetric("teamUtilization"),
    ],
    dailyProjects: metricRows.map((row) => ({ date: row.date, value: row.projectsDelivered })),
  };
}

function sum(rows: readonly MetricRow[], key: MetricKey) {
  return rows.reduce((total, row) => total + row[key], 0);
}
