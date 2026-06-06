/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/area/area_registry.ts
 */

export interface AreaRegistryEntry {
  area_id: string;
  humidity_entity_id?: string | null;
  icon: string | null;
  name: string;
  picture: string | null;
  temperature_entity_id?: string | null;
}
