/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/device/device_registry.ts
 */

export interface DeviceRegistryEntry {
  id: string;
  identifiers: [string, string][];
  model: string | null;
  name: string | null;
  serial_number: string | null;
}
