import { defineAgent } from 'eve';

export default defineAgent({
    // model: 'openai/gpt-4o', // Or "anthropic/claude-3-5-sonnet"
    description:
        'DevScale Intelligence analyzes business metrics — projects, revenue, tasks, client satisfaction — with tools, sandbox analysis, and a specialist investigator subagent.',
    model: 'anthropic/claude-sonnet-5',
    reasoning: 'medium',
    compaction: {
        thresholdPercent: 0.78,
    },
    limits: {
        maxInputTokensPerSession: 350_000,
        maxOutputTokensPerSession: 18_000,
        maxSubagentDepth: 2,
    },
});
