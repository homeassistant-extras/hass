# AGENTS.md - HTML / DOM render helpers

Small functions that return Lit templates or DOM nodes for Lovelace cards.

- **`entity-row.ts`** — `entityRow(hass, rowConfig, className?)`. Builds a HA entity row via `createRowElement` from {@link ../helpers/card-helpers.ts}. Returns `nothing` until `poatCardHelpers` are available.
- For state text/icons without a full row, use {@link ../render/AGENTS.md} (`state-display`, `state-icon`, etc.).

## Conventions

- Keep helpers side-effect free; callers gate on resolved card helpers where needed.
- Pass fully-built `LovelaceRowConfig` objects; entity-specific naming belongs in the card layer.
