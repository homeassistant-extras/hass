# AGENTS.md - Home Assistant Code

This package contains copied or adapted Home Assistant frontend types, helpers, and integration glue.

- Treat these files as upstream Home Assistant frontend code unless clearly documented otherwise.
- Keep copied files matching upstream 100% when they are vendored from Home Assistant.
- If a local change is unavoidable, document why it diverges from upstream.
- Prefer copying the smallest needed upstream surface instead of inventing parallel types.
- Use relative imports within this package (`src/`).

## Package layout

| Path            | AGENTS                                                                         |
| --------------- | ------------------------------------------------------------------------------ |
| `src/mixins/`   | Lit mixins (`HassConfigMixin`, `HassUpdateMixin`, `SubscribeEntityStateMixin`) |
| `src/html/`     | DOM row helpers (`entityRow`)                                                  |
| `src/render/`   | State display / icon Lit templates                                             |
| `src/helpers/`  | `loadCardHelpers` cache                                                        |
| `src/localize/` | Card i18n engine (`createLocalize`)                                            |

## Upstream sources

- **Frontend**: `../frontend/` — path comments link to `https://github.com/home-assistant/frontend/blob/dev/src/...`
- **WebSocket**: `ws/` folder — from `https://github.com/home-assistant/home-assistant-js-websocket`
