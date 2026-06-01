# @homeassistant-extras/hass

_Shared Home Assistant frontend and websocket types for custom Lovelace cards_

![npm](https://img.shields.io/npm/v/@homeassistant-extras/hass?style=for-the-badge&logo=npm&logoColor=white)
![GitHub Release](https://img.shields.io/github/v/release/homeassistant-extras/hass?style=for-the-badge&logo=github)
![GitHub branch status](https://img.shields.io/github/checks-status/homeassistant-extras/hass/main?style=for-the-badge)
![license](https://img.shields.io/github/license/homeassistant-extras/hass?style=for-the-badge&logo=opensourceinitiative&logoColor=white&color=0080ff)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E.svg?style=for-the-badge&logo=Prettier&logoColor=black)
![GitHub Actions](https://img.shields.io/github/actions/workflow/status/homeassistant-extras/hass/release-cd.yaml?style=for-the-badge&logo=GitHub-Actions&logoColor=white)

## Overview

`@homeassistant-extras/hass` is a TypeScript library used by [homeassistant-extras](https://github.com/homeassistant-extras) custom cards. It vendors a minimal slice of the [Home Assistant frontend](https://github.com/home-assistant/frontend) and [home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket) — types, helpers, and a few Lit components — so card repos can share one maintained copy instead of duplicating `src/hass/` in every project.

Files are kept aligned with upstream where possible. Each vendored file links to its upstream source in a header comment.

## Installation

```bash
yarn add @homeassistant-extras/hass
# or
npm install @homeassistant-extras/hass
```

Published to [npm](https://www.npmjs.com/package/@homeassistant-extras/hass). No `.npmrc` or auth token is required for public installs.

### Local development (sibling checkout)

When developing a card alongside this repo in the same workspace:

```json
"@homeassistant-extras/hass": "file:../hass"
```

## Usage in a custom card

Import from the package name. Paths mirror the published `dist/` layout (same as `src/`):

```typescript
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { DeviceRegistryEntry } from '@homeassistant-extras/hass/data/device/device_registry';
import type { EntityRegistryDisplayEntry } from '@homeassistant-extras/hass/data/entity/entity_registry';
import type { HassEntity } from '@homeassistant-extras/hass/ws/types';
import { fireEvent } from '@homeassistant-extras/hass/common/dom/fire_event';
import { computeTooltip } from '@homeassistant-extras/hass/panels/lovelace/common/compute-tooltip';
import type { HaFormSchema } from '@homeassistant-extras/hass/components/ha-form/types';
import { getDevice } from '@homeassistant-extras/hass/delegates/retrievers/device';
import { getEntity } from '@homeassistant-extras/hass/delegates/retrievers/entity';
import { getState } from '@homeassistant-extras/hass/delegates/retrievers/state';
```

`getState` returns a narrowed `HassEntity` with only `entity_id`, `state`, `attributes`, and `last_changed` — extra runtime fields on `hass.states` are stripped.

Side-effect imports:

```typescript
import '@homeassistant-extras/hass/panels/lovelace/editor/hui-element-editor';
import '@homeassistant-extras/hass/state/more-info-mixin';
```

No `tsconfig` path alias is required. The package publishes compiled ESM (`.js`) and declarations (`.d.ts`) under `dist/`.

### Package exports

| Import                                                   | Resolves to                           |
| -------------------------------------------------------- | ------------------------------------- |
| `@homeassistant-extras/hass/types`                       | `dist/types.js` + `dist/types.d.ts`   |
| `@homeassistant-extras/hass/ws/types`                    | `dist/ws/types.js`                    |
| `@homeassistant-extras/hass/data/entity/entity_registry` | `dist/data/entity/entity_registry.js` |

## Package layout

```
hass/
├── src/                                  # TypeScript source (development)
├── dist/                                 # Published build output (ESM + .d.ts)
│   ├── types.js
│   ├── common/
│   ├── data/
│   ├── panels/lovelace/
│   └── ws/
├── test/                                 # Mocha specs (mirrors src/)
├── tsconfig.build.json                   # Build config → dist/
├── AGENTS.md
└── package.json
```

Source tree under `src/`:

```
src/
├── types.ts                              # HomeAssistant, registries, connection
├── common/
│   ├── config/feature.ts
│   ├── array/literal-includes.ts
│   ├── const.ts
│   ├── dom/fire_event.ts
│   ├── entity/compute_domain.ts
│   ├── entity/compute_object_id.ts
│   ├── entity/compute_state_name.ts
│   ├── entity/state_active.ts
│   ├── string/capitalize-first-letter.ts
│   └── translations/localize.ts
├── components/ha-form/types.ts
├── data/
│   ├── device/device_registry.ts
│   ├── entity/entity.ts
│   ├── entity/entity_registry.ts
│   ├── integration.ts
│   ├── lovelace/config/action.ts
│   ├── selector.ts
│   └── ws-templates.ts
├── delegates/
│   ├── entities/                         # entity-subscription core
│   │   ├── subscribe-entities.ts
│   │   └── subscriptions/                # per-connection subscribe_entities manager
│   └── retrievers/
│       ├── state.ts                      # getState
│       ├── device.ts                     # getDevice
│       └── entity.ts                     # getEntity
├── dialogs/more-info/ha-more-info-dialog.ts
├── helpers/card-helpers.ts               # cached loadCardHelpers() wrapper
├── html/                                 # DOM / row render helpers
│   └── entity-row.ts
├── mixins/                               # Lit class mixins for card elements
│   ├── constructor.ts
│   ├── hass-config-mixin.ts
│   ├── hass-update-mixin.ts
│   └── subscribe-entity-state-mixin.ts
├── panels/lovelace/
│   ├── common/compute-tooltip.ts
│   ├── editor/hui-element-editor.ts
│   ├── elements/types.ts
│   └── entity-rows/types.ts
├── render/                               # Lit render helpers for entity state
│   ├── state-display.ts
│   ├── state-icon.ts
│   ├── state-label.ts
│   ├── state-icon-label.ts
│   └── create-hui-element.ts
├── state/more-info-mixin.ts
└── ws/
    ├── entities.ts
    └── types.ts
```

Internal imports use relative paths within `src/`.

## Upstream sources

| Area                              | Upstream                                                                                                    |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Frontend types, helpers, panels   | [home-assistant/frontend](https://github.com/home-assistant/frontend) (`dev` branch)                        |
| WebSocket types and subscriptions | [home-assistant/home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket) |

When adding or updating vendored files, copy the smallest surface needed, preserve upstream file paths in comments, and avoid diverging unless necessary. See [AGENTS.md](AGENTS.md).

## Development

### Prerequisites

- Node.js 24+
- Yarn

### Scripts

| Command                       | Description                              |
| ----------------------------- | ---------------------------------------- |
| `yarn install`                | Install dependencies                     |
| `yarn build`                  | Compile `src/` → `dist/` (ESM + `.d.ts`) |
| `yarn typecheck`              | TypeScript check (`src` + `test`)        |
| `yarn test`                   | Run Mocha tests                          |
| `yarn ci`                     | CI gate: build + typecheck + test        |
| `yarn pass`                   | Format, CI, lint                         |
| `yarn lint` / `yarn lint:fix` | ESLint                                   |

### Tests

Tests live under `test/` and mirror `src/` layout. Run with:

```bash
yarn test
```

## Releases

Versions are published to [npm](https://www.npmjs.com/package/@homeassistant-extras/hass) when changes land on the `release` branch (automated bump, tag, and publish via GitHub Actions). CI uses [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) — no long-lived publish token required. Manual releases are also available from the **Manual Release** workflow.

## Contributing

- [Report issues](https://github.com/homeassistant-extras/hass/issues)
- [Open a pull request](https://github.com/homeassistant-extras/hass/pulls) — see [CONTRIBUTING.md](CONTRIBUTING.md)
- [Discussions](https://github.com/homeassistant-extras/hass/discussions)
- [Other homeassistant-extras projects](https://github.com/orgs/homeassistant-extras/repositories)

When vendoring new upstream code, follow [AGENTS.md](AGENTS.md) and add tests where behavior is non-trivial.

## Used by

- [whisker](https://github.com/homeassistant-extras/whisker) — Litter-Robot Lovelace card

More card repos in the org are migrating off local `src/hass/` copies to this package over time.

## License

See [LICENSE](LICENSE).

## Acknowledgments

- Types and helpers derived from [Home Assistant](https://www.home-assistant.io/) frontend and websocket client code.
- Maintained by [Patrick Masters](https://github.com/warmfire540) / [Curious Cat Consulting](https://curiouscat.consulting)
