import type { DeviceRegistryEntry } from "../../data/device/device_registry";
import type { HomeAssistant } from "../../types";

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
    identifiers: device.identifiers,
    model: device.model,
    name: device.name,
    serial_number: device.serial_number,
  };
};
