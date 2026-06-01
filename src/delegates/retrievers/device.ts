import type { DeviceRegistryEntry } from '../../data/device/device_registry';
import type { HomeAssistant } from '../../types';

/**
 * Retrieves a device from `hass.devices`.
 */
export const getDevice = (
  hass: HomeAssistant,
  deviceId: string,
): DeviceRegistryEntry | undefined => {
  const device = hass.devices[deviceId];
  if (!device) return undefined;

  return {
    id: device.id,
    config_entries: device.config_entries,
    identifiers: device.identifiers,
    manufacturer: device.manufacturer,
    model: device.model,
    model_id: device.model_id,
    name: device.name,
    name_by_user: device.name_by_user,
    serial_number: device.serial_number,
  };
};
