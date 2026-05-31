import { nothing } from 'lit';
import type { HomeAssistant } from '../types';
import { HOLD_AND_DOUBLE_TAP_NONE } from './constants';
import { createHuiElement } from './create-hui-element';

/**
 * Renders a `hui-state-label-element` via HA's `createHuiElement`.
 *
 * @param hass - Home Assistant instance
 * @param entityId - Entity whose state label is shown
 */
export function stateLabel(
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
): HTMLElement | typeof nothing {
  if (!hass || !entityId) {
    return nothing;
  }

  return createHuiElement(hass, {
    type: 'state-label',
    entity: entityId,
    ...HOLD_AND_DOUBLE_TAP_NONE,
  });
}
