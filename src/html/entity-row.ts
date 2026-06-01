import { nothing } from 'lit';
import { getPoatCardHelpers } from '../helpers/card-helpers';
import type { LovelaceRowConfig } from '../panels/lovelace/entity-rows/types';
import type { HomeAssistant } from '../types';

export type EntityRowConfig = LovelaceRowConfig & Record<string, unknown>;

/**
 * Renders a Lovelace entity row element via {@link getPoatCardHelpers}.
 * Returns `nothing` when card helpers are not resolved yet.
 */
export const entityRow = (
  hass: HomeAssistant,
  rowConfig: EntityRowConfig,
  className?: string,
) => {
  const helpers = getPoatCardHelpers();
  if (!helpers) {
    return nothing;
  }

  const element = helpers.createRowElement(rowConfig);
  element.hass = hass;

  if (className) {
    element.className = className;
  }

  return element;
};
