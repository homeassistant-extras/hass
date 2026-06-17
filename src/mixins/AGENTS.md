# AGENTS.md - Lit mixins

Shared Lit class mixins for custom Lovelace cards.

- **`constructor.ts`** — `Constructor<T>` type for mixin factories.
- **`hass-config-mixin.ts`** — `HassConfigMixin`. Plain `hass` and `config` fields (not `@property()`). Use on inner components that receive values from a parent template.
- **`hass-update-mixin.ts`** — `HassUpdateMixin`. Listens for `hass-update` on the component's shadow scope (`getRootNode()`, or `_host.shadowRoot` for portalled descendants). Does NOT listen on `globalThis` — the owning card must dispatch `hass-update` on its own `shadowRoot` so sibling cards stay isolated. Stacks on `HassConfigMixin` (which supplies `hass`/`config`). Exports `HassUpdateEvent`.
- **`subscribe-entity-state-mixin.ts`** — `SubscribeEntityStateMixin`. WebSocket `subscribe_entities` scoped to `config.entities`; stacks on `HassConfigMixin`.

## Conventions

- Prefer `HassConfigMixin` for presentational children; use `HassUpdateMixin` when the parent skips full Lit updates and children must react to `hass-update`.
- Do not add `@property()` to `hass`/`config` on `HassConfigMixin` unless you intentionally want attribute reflection and extra reactive churn.
