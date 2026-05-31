# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@homeassistant-extras/hass` is a TypeScript library that vendors a minimal slice of the
[Home Assistant frontend](https://github.com/home-assistant/frontend) and
[home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket) —
types, helpers, and a few Lit components — so the org's custom Lovelace card repos share one
maintained copy instead of duplicating `src/hass/` in each project. It publishes compiled ESM
(`.js`) + declarations (`.d.ts`) under `dist/`; consumers import by subpath that mirrors `src/`
(e.g. `@homeassistant-extras/hass/types`).

## Commands

- `yarn build` — clean + compile `src/` → `dist/` via `tsconfig.build.json` (NodeNext, emits `.d.ts`)
- `yarn test` — Mocha + ts-node (`tsconfig.test.json`); specs are `test/**/*.spec.ts`
- Single test file: `TS_NODE_PROJECT='./tsconfig.test.json' yarn mocha test/render/state-display.spec.ts`
- Single test by name: `yarn test --grep "partial name"`
- `yarn typecheck` — `tsc --noEmit` for both `src` and `test`
- `yarn lint` / `yarn lint:fix` — ESLint
- `yarn ci` — build + typecheck + test (the gate CI runs)
- `yarn pass` — `format` + `ci` + `lint`; run this before considering work done

Requires Node 24+ and Yarn.

## Vendoring conventions (read AGENTS.md before editing vendored files)

Most files here are copied or adapted from upstream Home Assistant code. Treat them as upstream:

- Keep vendored files matching upstream **100%** unless a local change is unavoidable; if it
  diverges, document why in a comment.
- Each vendored file's header comment links its upstream source path. Preserve those.
- Copy the **smallest** surface needed — don't invent parallel types.
- Use **relative imports** within `src/` (no path aliases; none are configured).

Frontend types track the upstream `dev` branch; `ws/` tracks home-assistant-js-websocket.

## Architecture

The non-vendored / org-specific logic lives in a few layers:

- **`src/delegates/retrievers/`** — `getState`, `getDevice`, `getEntity`. `getState` deliberately
  returns a _narrowed_ `HassEntity` (`entity_id`, `state`, `attributes`, `last_changed` only);
  extra runtime fields on `hass.states` are stripped.

- **`src/delegates/entities/subscriptions/`** — the entity-subscription core. `EntitySubscriptionManager`
  is a **per-connection singleton** (keyed by `hass.connection` in a module-level `Map`) that
  consolidates every watched entity into a **single `subscribe_entities` websocket call**.
  Subscribing to N entities just registers N listeners; the `ResubscribeScheduler` batches
  resubscribes when the entity set changes, and a `_resubscribeVersion` counter guards against
  stale in-flight subscriptions. Subscribing to one more entity is cheap.

- **`src/mixins/`** — Lit class mixins composed onto card elements. `SubscribeEntityStateMixin`
  wraps the manager: set `entity` (single) or `entities` (array) on the element and read back
  `state` / `states[id]`. State is exposed via a reactive `@state()` map that is **reassigned, never
  mutated in place**, so Lit re-renders. It reconciles subscriptions on connect/disconnect and only
  notifies on meaningful changes (state/attributes), not context/last_updated.

- **`src/render/`** — Lit render helpers (`state-display`, `state-icon`, `state-label`,
  `state-icon-label`, `create-hui-element`) for rendering entity state in cards.

- **`src/helpers/card-helpers.ts`** — wraps HA's global `loadCardHelpers()` (`createRowElement` /
  `createHuiElement`) behind a cached singleton stored on `globalThis.poatCardHelpers`.

`test/` mirrors `src/` one-to-one. Tests use Mocha + chai + sinon, with `jsdom` set up in
`mocha.setup.ts` for the Lit/DOM-dependent code.

## Publishing

Published to npm on push to the `release` branch (automated bump/tag/publish via GitHub Actions,
using npm Trusted Publishing / OIDC — no long-lived token). A **Manual Release** workflow also
exists. The `files` allowlist in `package.json` publishes only `dist`, `README.md`, and `AGENTS.md`.
