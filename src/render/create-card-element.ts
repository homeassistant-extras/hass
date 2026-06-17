import { nothing } from 'lit';
import type { LovelaceCardConfig } from '../data/lovelace/config/card';
import { getPoatCardHelpers } from '../helpers/card-helpers';
import type { LovelaceCard } from '../panels/lovelace/types';
import type { HomeAssistant } from '../types';

/**
 * Creates a Lovelace card element via HA's loaded card helpers.
 *
 * @param hass - Home Assistant instance assigned to the element
 * @param config - Lovelace card configuration
 * @returns The configured card, or `nothing` when helpers are unavailable
 */
export function createCardElement(
  hass: HomeAssistant,
  config: LovelaceCardConfig,
): LovelaceCard | typeof nothing {
  const helpers = getPoatCardHelpers();
  if (!helpers) {
    return nothing;
  }

  const element = helpers.createCardElement(config);
  element.hass = hass;
  return element;
}
