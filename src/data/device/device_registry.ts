/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/device/device_registry.ts
 */

export interface DeviceRegistryEntry {
  id: string;
  config_entries: string[];
  identifiers: [string, string][];
  manufacturer: string | null;
  model: string | null;
  model_id: string | null;
  name: string | null;
  name_by_user: string | null;
  serial_number: string | null;
}
