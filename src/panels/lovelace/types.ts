/**
 * https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/types.ts
 */

import type { LovelaceCardConfig } from '../../data/lovelace/config/card';
import type { HomeAssistant } from '../../types';

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
}
