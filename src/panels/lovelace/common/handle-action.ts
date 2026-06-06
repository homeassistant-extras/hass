/**
 * https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/common/handle-action.ts
 */

import type { ActionConfig } from '../../../data/lovelace/config/action';

export interface ActionConfigParams {
  entity?: string;
  camera_image?: string;
  image_entity?: string;
  hold_action?: ActionConfig;
  tap_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

declare global {
  // for fire event
  interface HASSDomEvents {
    'hass-action': { config: ActionConfigParams; action: string };
  }
}
