/**
 * https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/elements/types.ts
 */

import type { ActionConfig } from "@hass/data/lovelace/config/action";
import type { HomeAssistant } from "@hass/types";

export interface LovelaceElementConfig {
  type: string;
  entity?: string;
  state_color?: boolean;
  icon?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface LovelaceElement extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceElementConfig): void;
}
