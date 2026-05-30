/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/entity/entity_registry.ts
 */

export interface EntityRegistryDisplayEntry {
  entity_id: string;
  device_id?: string;
  translation_key?: string;
}
