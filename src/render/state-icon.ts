import type { nothing } from 'lit';
import type { ActionConfig } from '../data/lovelace/config/action';
import type { HomeAssistant } from '../types';
import { createHuiElement } from './create-hui-element';

export interface StateIconOptions {
  /** When true, tints the icon from the entity state. */
  state_color?: boolean;
  /** Override icon (e.g. `mdi:thermometer`). */
  icon?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

/**
 * Renders a `hui-state-icon-element` via HA's `createHuiElement`.
 *
 * @param hass - Home Assistant instance
 * @param entityId - Entity to display
 * @param options - Optional icon and action configuration
 */
export function stateIcon(
  hass: HomeAssistant,
  entityId: string,
  options: StateIconOptions = {},
): HTMLElement | typeof nothing {
  const { state_color, icon, tap_action, hold_action, double_tap_action } =
    options;

  return createHuiElement(hass, {
    type: 'state-icon',
    entity: entityId,
    ...(state_color !== undefined && { state_color }),
    ...(icon !== undefined && { icon }),
    ...(tap_action !== undefined && { tap_action }),
    ...(hold_action !== undefined && { hold_action }),
    ...(double_tap_action !== undefined && { double_tap_action }),
  });
}
