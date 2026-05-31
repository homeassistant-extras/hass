import { nothing } from 'lit';
import { getPoatCardHelpers } from '../helpers/card-helpers';
import type {
  LovelaceElement,
  LovelaceElementConfig,
} from '../panels/lovelace/elements/types';
import type { HomeAssistant } from '../types';

/**
 * Creates a Lovelace HUI element via HA's loaded card helpers.
 *
 * @param hass - Home Assistant instance assigned to the element
 * @param config - Lovelace element configuration
 * @returns The configured element, or `nothing` when helpers are unavailable
 */
export function createHuiElement(
  hass: HomeAssistant,
  config: LovelaceElementConfig,
): LovelaceElement | typeof nothing {
  const helpers = getPoatCardHelpers();
  if (!helpers) {
    return nothing;
  }

  const element = helpers.createHuiElement(config);
  element.hass = hass;
  return element;
}
