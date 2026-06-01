/**
 * https://github.com/home-assistant/frontend/blob/dev/src/types.ts
 */

import type { LocalizeFunc } from './common/translations/localize';
import type { DeviceRegistryEntry } from './data/device/device_registry';
import type { EntityRegistryDisplayEntry } from './data/entity/entity_registry';
import type { Connection, HassEntities, MessageBase } from './ws/types';

export interface HomeAssistantRegistries {
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices: Record<string, DeviceRegistryEntry>;
}

export interface HomeAssistantInternationalization {
  // i18n
  // current effective language in that order:
  //   - backend saved user selected language
  //   - language in local app storage
  //   - browser language
  //   - english (en)
  language: string;
  localize: LocalizeFunc;
}

export type CallWS = <T>(msg: MessageBase) => Promise<T>;

export interface HomeAssistantApi {
  callWS: CallWS;
}

export interface HomeAssistantConnection {
  connection: Connection;
}

export interface HomeAssistant
  extends
    HomeAssistantRegistries,
    HomeAssistantInternationalization,
    HomeAssistantApi,
    HomeAssistantConnection {
  states: HassEntities;
}
