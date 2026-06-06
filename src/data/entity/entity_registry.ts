/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/entity/entity_registry.ts
 */

export type EntityCategory = 'config' | 'diagnostic';

export interface EntityRegistryDisplayEntry {
  entity_id: string;
  name?: string;
  device_id?: string;
  area_id?: string;
  labels?: string[];
  hidden?: boolean;
  entity_category?: EntityCategory;
  translation_key?: string;
  platform?: string;
}

export interface EntityRegistryEntry {
  entity_id: string;
  name: string | null;
  device_id: string | null;
  original_name?: string;
}
