/**
 * https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/entity-rows/types.ts
 */

import type { HomeAssistant } from '@hass/types';

export type LovelaceRowConfig = {
  entity?: string;
};

export interface LovelaceRow extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceRowConfig): void;
}
