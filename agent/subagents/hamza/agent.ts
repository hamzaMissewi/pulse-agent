import { defineAgent } from 'eve';

export default defineAgent({
    description:
        'Investigate unusual D.S business metric movement before the parent agent writes a final report.',
    model: 'anthropic/claude-sonnet-5',
    reasoning: 'medium',
    limits: {
        maxInputTokensPerSession: 120_000,
        maxOutputTokensPerSession: 8_000,
    },
});
