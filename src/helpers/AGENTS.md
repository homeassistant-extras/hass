# AGENTS.md - Card helpers

- **`card-helpers.ts`** — Cached `loadCardHelpers()` wrapper (`resolvePoatCardHelpers`, `getPoatCardHelpers`, `setPoatCardHelpers`). Required before {@link ../html/entity-row.ts} or {@link ../render/create-hui-element.ts} can create Lovelace rows/elements.

Call `resolvePoatCardHelpers(globalThis.loadCardHelpers)` once from the card's `connectedCallback` (or equivalent) before rendering rows or HUI elements.
