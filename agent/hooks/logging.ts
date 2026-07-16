import { defineHook } from "eve/hooks";

export default defineHook({
  events: {
    async "session.started"(_event, ctx) {
      console.info("[devscale] session started", { sessionId: ctx.session.id });
    },

    async "turn.completed"(_event, ctx) {
      console.info("[devscale] turn completed", { sessionId: ctx.session.id });
    },

    async "message.completed"(event, ctx) {
      const length = event.data.message?.length ?? 0;
      console.info("[devscale] message completed", {
        sessionId: ctx.session.id,
        length,
      });
    },

    async "action.result"(event, ctx) {
      const result = event.data.result as any;
      const toolName = result?.toolName ?? result?.subagentName ?? "unknown";
      console.info("[devscale] action result", {
        sessionId: ctx.session.id,
        tool: toolName,
      });
    },

    async "turn.failed"(event, ctx) {
      const turnError = (event.data as any)?.errorText ?? "unknown error";
      console.error("[devscale] turn failed", {
        sessionId: ctx.session.id,
        error: turnError,
      });
    },

    async "session.failed"(event, ctx) {
      const sessionError = (event.data as any)?.errorText ?? "unknown error";
      console.error("[devscale] session failed", {
        sessionId: ctx.session.id,
        error: sessionError,
      });
    },
  },
});
