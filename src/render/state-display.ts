import { html, type TemplateResult } from 'lit';
import type { HomeAssistant } from '../types';
import type { HassEntity } from '../ws/types';

/**
 * Renders a state display for a given entity.
 */
export const stateDisplay = (
  hass: HomeAssistant,
  entity: HassEntity,
  content?: string | string[],
): TemplateResult =>
  html`<state-display
    .hass=${hass}
    .stateObj=${entity}
    .content=${content}
  ></state-display>`;
