# AGENTS.md - Home Assistant Code

This package contains copied or adapted Home Assistant frontend types, helpers, and integration glue.

- Treat these files as upstream Home Assistant frontend code unless clearly documented otherwise.
- Keep copied files matching upstream 100% when they are vendored from Home Assistant.
- If a local change is unavoidable, document why it diverges from upstream.
- Prefer copying the smallest needed upstream surface instead of inventing parallel types.
- Use `@hass/*` import paths within this package.

## Upstream sources

- **Frontend**: `../frontend/` — path comments link to `https://github.com/home-assistant/frontend/blob/dev/src/...`
- **WebSocket**: `ws/` folder — from `https://github.com/home-assistant/home-assistant-js-websocket`
