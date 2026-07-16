# DevScale Intelligence: AI Business Analyst

DevScale Intelligence is an AI-powered business metrics analyst for
[DevScale Digital Solutions](https://www.devscale.online). It answers questions
about projects delivered, revenue, tasks completed, client satisfaction, and team
utilization — with sandboxed Python analysis, anomaly detection via a specialist
subagent, and scheduled weekly reports.

Built with the [Eve framework](https://eve.dev) and Vercel's Agent Stack.

## What You Need

- Node 24 or newer. This repo includes `.nvmrc`, so `nvm use` is enough if you
  use nvm.
- pnpm 11.7.0 or newer. The package manager version is declared in
  `package.json`.
- A Vercel project link or an AI Gateway API key. The model in `agent/agent.ts`
  is a Gateway model string: `anthropic/claude-sonnet-5`.
- Vercel CLI access if you want to use the Vercel Sandbox backend locally or wire
  Slack through Vercel Connect.

## Setup

```bash
nvm use
pnpm install
cp .env.example .env.local
```

Then choose one model-auth option:

```bash
# Option A: use Vercel OIDC from a linked project
pnpm dlx vercel@latest link
pnpm dlx vercel@latest env pull .env.local
```

```bash
# Option B: use an AI Gateway key
# Paste AI_GATEWAY_API_KEY into .env.local
```

Run the web demo:

```bash
pnpm dev
```

Open `http://localhost:3000` and ask DevScale Intelligence something like:

```txt
How did revenue do this week compared to last week?
```

## Optional Slack Demo

The Slack channel is already authored in `agent/channels/slack.ts`. It uses
Vercel Connect, so you do not need `SLACK_BOT_TOKEN` or `SLACK_SIGNING_SECRET`.

By default the app looks for this connector UID:

```txt
slack/vercel-eve-bot
```

To use your own connector, set this in `.env.local` and in your Vercel project:

```txt
SLACK_CONNECTOR=slack/your-connector
```

The Eve Slack docs cover the full Connect setup:

```bash
pnpm dlx vercel@latest connect create slack --triggers
pnpm dlx vercel@latest connect attach <uid> --triggers --trigger-path /eve/v1/slack --yes
```

## Architecture

- `agent/` is the filesystem-first Eve agent.
- `agent/agent.ts` picks the AI Gateway model and runtime limits.
- `agent/instructions.md` gives DevScale Intelligence its analyst behavior.
- `agent/lib/devscale-data.ts` holds the DevScale business metrics dataset.
- `agent/tools/query_metrics.ts` reads the metrics dataset.
- `agent/tools/run_analysis.ts` runs chart-ready analysis through the sandbox.
- `agent/sandbox/sandbox.ts` pins Vercel Sandbox with two vCPUs and `deny-all`
  network egress for each session.
- `agent/subagents/investigator/` is the specialist anomaly-review subagent.
- `agent/subagents/investigator/` is the specialist anomaly-review subagent.

### Investigator Example Output

See `agent/subagents/investigator/example_output.json` for a small example
of the `investigator` subagent output that follows the `outputSchema` in
`agent/subagents/investigator/agent.ts`.
- `agent/schedules/monday-summary.ts` is the Monday weekly report prompt.
- `agent/channels/slack.ts` shows the Vercel Connect-backed Slack channel.
- `app/_components/agent-chat.tsx` is the web chat UI.

## Trigger The Weekly Report Locally

`eve dev` does not wait for cron. Trigger the same schedule path on demand:

```bash
pnpm dev
```

Then, in another terminal:

```bash
curl -X POST http://localhost:3000/eve/v1/dev/schedules/monday-summary
```

## Useful Commands

```bash
pnpm typecheck
pnpm build
pnpm build:eve
pnpm dev:eve
```

## Deploy

Deploy it like a normal Vercel app:

```bash
VERCEL_USE_EXPERIMENTAL_FRAMEWORKS=1 pnpm dlx vercel@latest deploy
```

Set `AI_GATEWAY_API_KEY` only if you are not using Vercel OIDC/Gateway auth for
the deployment. Set `SLACK_CONNECTOR` if your connector UID is different from the
demo default.

Before using private customer data, replace the public demo auth in
`agent/channels/eve.ts` with your real route or app auth policy.

## About DevScale

[DevScale Digital Solutions](https://www.devscale.online) is a digital
transformation company based in Tunisia, serving international clients with
custom SaaS, web development, cloud engineering, AI integration, and IT
consulting services. Notable clients include Unilumin, Carrefour, Shell, Nissan,
Balkan Investment Group, and Globalnet.
