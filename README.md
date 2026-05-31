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

### TypeScript path alias

Card projects typically import via `@hass/*`. Add a path mapping in `tsconfig.json` (and `tsconfig.test.json` if you run Mocha with `tsconfig-paths`):

**From npm:**

```json
{
  "compilerOptions": {
    "paths": {
      "@hass/*": ["./node_modules/@homeassistant-extras/hass/src/*"]
    }
  }
}
```

**From a local checkout:**

```json
{
  "compilerOptions": {
    "paths": {
      "@hass/*": ["../hass/src/*"]
    }
  }
}
```

Ensure your test runner registers path aliases (e.g. `tsconfig-paths/register` in `.mocharc.json`).

### Import examples

```typescript
import type { HomeAssistant } from "@hass/types";
import type { DeviceRegistryEntry } from "@hass/data/device/device_registry";
import type { EntityRegistryDisplayEntry } from "@hass/data/entity/entity_registry";
import type { HassEntity } from "@hass/ws/types";
import { fireEvent } from "@hass/common/dom/fire_event";
import { computeTooltip } from "@hass/panels/lovelace/common/compute-tooltip";
import type { HaFormSchema } from "@hass/components/ha-form/types";
```

Side-effect imports (Lit element registration) work the same way:

```typescript
import "@hass/panels/lovelace/editor/hui-element-editor";
import "@hass/state/more-info-mixin";
```

### Package exports

`package.json` exposes source files directly:

```json
"exports": {
  "./*": "./src/*"
}
```

Subpaths resolve to TypeScript source under `src/` (e.g. `@homeassistant-extras/hass/types` → `src/types.ts`). Card repos usually prefer the `@hass/*` alias for shorter imports and parity with in-repo conventions.

## Package layout

```
hass/
├── src/
│   ├── types.ts                          # HomeAssistant, registries, connection
│   ├── common/
│   │   ├── dom/fire_event.ts             # fireEvent helper
│   │   ├── entity/
│   │   │   ├── compute_object_id.ts
│   │   │   └── compute_state_name.ts
│   │   └── translations/localize.ts      # LocalizeFunc
│   ├── components/
│   │   └── ha-form/types.ts              # HaFormSchema and related types
│   ├── data/
│   │   ├── device/device_registry.ts     # DeviceRegistryEntry
│   │   ├── entity/entity_registry.ts     # EntityRegistryDisplayEntry
│   │   ├── lovelace/config/action.ts     # ActionConfig, Lovelace actions
│   │   └── selector.ts
│   ├── dialogs/
│   │   └── more-info/ha-more-info-dialog.ts
│   ├── panels/lovelace/
│   │   ├── common/compute-tooltip.ts
│   │   ├── editor/hui-element-editor.ts  # Lovelace element editor (Lit)
│   │   ├── elements/types.ts             # LovelaceElementConfig
│   │   └── entity-rows/types.ts          # LovelaceRowConfig
│   ├── state/more-info-mixin.ts
│   └── ws/
│       ├── entities.ts                   # subscribeEntities, state updates
│       └── types.ts                      # HassEntity, Connection, etc.
├── test/                                 # Mocha specs (mirrors src/)
├── AGENTS.md                             # Upstream sync guidelines for contributors
└── package.json
```

Within this package, internal imports use `@hass/*` (see `tsconfig.json` `paths`).

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

| Command                       | Description                       |
| ----------------------------- | --------------------------------- |
| `yarn install`                | Install dependencies              |
| `yarn typecheck`              | TypeScript check (`src` + `test`) |
| `yarn test`                   | Run Mocha tests                   |
| `yarn ci`                     | CI gate: typecheck + test         |
| `yarn pass`                   | Format, typecheck, lint, test     |
| `yarn lint` / `yarn lint:fix` | ESLint                            |

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
