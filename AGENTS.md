# eve Agent App — DevScale Intelligence

This project uses the eve framework. Before writing code, read the relevant guide
from the installed eve package docs. In most installs, those docs are at
`node_modules/eve/docs/`. In workspaces or local package installs, resolve the
installed `eve` package location first and read its `docs/` directory. If
package docs are unavailable, use https://eve.dev/docs as a fallback.

## DevScale Context

DevScale Digital Solutions (www.devscale.online) is a digital transformation
company. This agent analyzes business metrics: projects delivered, revenue,
tasks completed, client satisfaction, and team utilization.

The dataset lives in `agent/lib/devscale-data.ts`. All tools and subagents
import from that module.
