import type { EntityRegistryDisplayEntry } from '../../data/entity/entity_registry';
import type { HomeAssistant } from '../../types';

/**
 * Retrieves an entity registry entry from `hass.entities`.
 */
export const getEntity = (
  hass: HomeAssistant,
  entityId: string,
): EntityRegistryDisplayEntry | undefined => {
  const entity = hass.entities[entityId];
  if (!entity) return undefined;

  return {
    entity_id: entity.entity_id,
    name: entity.name,
    device_id: entity.device_id,
    area_id: entity.area_id,
    labels: entity.labels,
    hidden: entity.hidden,
    entity_category: entity.entity_category,
    translation_key: entity.translation_key,
    platform: entity.platform,
  };
};
