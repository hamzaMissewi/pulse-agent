import { defineAgent } from 'eve';
import { z } from 'zod';

const investigatorOutputSchema = z.object({
    findings: z.array(
        z.object({
            metric: z.string(),
            severity: z.enum(['headline', 'notable', 'normal']),
            interpretation: z.string(),
            percentChange: z.number().nullable(),
        }),
    ),
    likelyDrivers: z.array(z.string()).optional(),
    watchouts: z.array(z.string()).optional(),
    parentNote: z.string().optional(),
});

export default defineAgent({
    description:
        'Investigate unusual DevScale business metric movement before the parent agent writes a final report.',
    // model: "anthropic/claude-sonnet-5",
    model: 'gemini/gemini-flash-2.5',
    reasoning: 'medium',
    outputSchema: investigatorOutputSchema,
    limits: {
        maxInputTokensPerSession: 120_000,
        maxOutputTokensPerSession: 8_000,
    },
});
