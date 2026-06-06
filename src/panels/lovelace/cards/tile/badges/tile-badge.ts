/**
 * https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/tile/badges/tile-badge.ts
 */

import { html, nothing, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { computeDomain } from '../../../../../common/entity/compute_domain';
import { UNAVAILABLE, UNKNOWN } from '../../../../../data/entity';
import type { HomeAssistant } from '../../../../../types';
import type { HassEntity } from '../../../../../ws/types';
import { renderClimateBadge } from './tile-badge-climate';
import { renderHumidifierBadge } from './tile-badge-humidifier';
import { renderPersonBadge } from './tile-badge-person';

export type RenderBadgeFunction = (
  stateObj: HassEntity,
  hass: HomeAssistant,
) => TemplateResult | typeof nothing;

export const renderTileBadge: RenderBadgeFunction = (stateObj, hass) => {
  if (stateObj.state === UNKNOWN) {
    return nothing;
  }
  if (stateObj.state === UNAVAILABLE) {
    return html`
      <ha-tile-badge
        style=${styleMap({
          '--tile-badge-background-color': 'var(--orange-color)',
        })}
      >
        <ha-icon icon="mdi:exclamation-thick"></ha-icon>
      </ha-tile-badge>
    `;
  }
  const domain = computeDomain(stateObj.entity_id);
  switch (domain) {
    case 'person':
    case 'device_tracker':
      return renderPersonBadge(stateObj, hass);
    case 'climate':
      return renderClimateBadge(stateObj, hass);
    case 'humidifier':
      return renderHumidifierBadge(stateObj, hass);
    default:
      return nothing;
  }
};
