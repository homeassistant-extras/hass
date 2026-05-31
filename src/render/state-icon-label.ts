import { html, nothing, type TemplateResult } from 'lit';
import type { HomeAssistant } from '../types';
import { HOLD_AND_DOUBLE_TAP_NONE } from './constants';
import { stateIcon } from './state-icon';
import { stateLabel } from './state-label';

export interface StateIconLabelOptions {
  /** When true, tints the icon from the entity state. */
  state_color?: boolean;
  /** Override icon (e.g. `mdi:thermometer`). */
  icon?: string;
  /** Optional wrapper class for chip-style layouts. */
  wrapperClass?: string;
}

/**
 * Renders paired `hui-state-icon-element` and `hui-state-label-element` via HA's
 * `createHuiElement`, matching footer config slots and similar chip UIs.
 *
 * @param hass - Home Assistant instance
 * @param entityId - Entity to display
 * @param options - Optional icon styling and wrapper class
 */
export function stateIconLabel(
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
  options: StateIconLabelOptions = {},
): TemplateResult | typeof nothing {
  if (!hass || !entityId) {
    return nothing;
  }

  const { state_color, icon, wrapperClass } = options;

  const iconElement = stateIcon(hass, entityId, {
    state_color,
    icon,
    ...HOLD_AND_DOUBLE_TAP_NONE,
  });

  const labelElement = stateLabel(hass, entityId);

  if (iconElement === nothing || labelElement === nothing) {
    return nothing;
  }

  const content = html`${iconElement} ${labelElement}`;

  if (wrapperClass) {
    return html`
      <div class=${wrapperClass} part=${wrapperClass} role="presentation">
        ${content}
      </div>
    `;
  }

  return content;
}
