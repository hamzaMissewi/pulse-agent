---
description: "Install and configure Vercel Workflow SDK before it exists in node_modules. Use when the user asks to 'install workflow', 'set up workflow', 'add durable workflows', 'configure workflow sdk', or 'init workflow' for Next.js, Express, Hono, Fastify, NestJS, Nitro, Nuxt, Astro, SvelteKit, or Vite."
---

# Workflow Init Skill

## Overview

The Vercel Workflow SDK provides durable, crash-safe execution for eve agents. It powers sessions, steps, cron schedules, and resumable runs. This skill guides installation and initial configuration.

## When to Use

Use this skill when:

- The user wants to add durable workflow capabilities to their project
- The `workflow` package is not yet installed
- Setting up a new eve project that needs scheduled tasks or durable sessions

## Installation

```bash
npm install workflow@latest
```

Or with pnpm:

```bash
pnpm add workflow@latest
```

## Framework Integration

### Next.js

The Workflow SDK integrates with Next.js via the eve plugin. No extra setup needed when using `withEve()` in `next.config.ts`:

```ts
import type { NextConfig } from "next";
import { withEve } from "eve/next";

const nextConfig: NextConfig = {};
export default withEve(nextConfig);
```

### Other Frameworks

For Express, Hono, Fastify, NestJS, Nitro, Nuxt, Astro, or SvelteKit, add the workflow middleware:

```ts
import { workflowMiddleware } from "workflow/express";

app.use(workflowMiddleware());
```

## How eve Uses Workflow

Under the hood, eve wraps every session and schedule with the Workflow SDK:

- **Sessions** are durable — progress is checkpointed at step boundaries
- **Schedules** (like `monday-summary.ts`) run as fire-and-forget workflow tasks
- **Steps** inside tools and subagents are retryable and resumable
- **Compaction** preserves conversation state across crashes and deploys

You typically don't interact with the Workflow SDK directly — eve handles the boilerplate. But understanding it helps when debugging durable runs or configuring retry policies.

## Verifying Installation

After installing, verify the workflow package is available:

```bash
node -e "require('workflow')"
```

Or check it appears in your dependencies:

```bash
cat package.json | grep workflow
```
