/**
 * https://github.com/home-assistant/frontend/blob/dev/src/types.ts
 */

import type { LocalizeFunc } from "./common/translations/localize";
import type { DeviceRegistryEntry } from "./data/device/device_registry";
import type { EntityRegistryDisplayEntry } from "./data/entity/entity_registry";
import type { Connection, HassEntities } from "./ws/types";

export interface HomeAssistantRegistries {
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices: Record<string, DeviceRegistryEntry>;
}

export interface HomeAssistantInternationalization {
  localize: LocalizeFunc;
}

export interface HomeAssistantConnection {
  connection: Connection;
}

export interface HomeAssistant
  extends
    HomeAssistantRegistries,
    HomeAssistantInternationalization,
    HomeAssistantConnection {
  states: HassEntities;
}
