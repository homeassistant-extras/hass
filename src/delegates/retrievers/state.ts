import type { HomeAssistant } from '../../types';
import type { HassEntity } from '../../ws/types';

/**
 * Retrieves the state of an entity from `hass.states`.
 */
export const getState = (
  hass: HomeAssistant,
  entityId?: string,
): HassEntity | undefined => {
  if (!entityId) return undefined;

  const state = hass.states[entityId];
  if (!state) return undefined;

  return {
    entity_id: state.entity_id,
    state: state.state,
    attributes: state.attributes,
    last_changed: state.last_changed,
    last_updated: state.last_updated,
  };
};
