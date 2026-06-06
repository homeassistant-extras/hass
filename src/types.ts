/**
 * https://github.com/home-assistant/frontend/blob/dev/src/types.ts
 */

import type { LocalizeFunc } from './common/translations/localize';
import type { AreaRegistryEntry } from './data/area/area_registry';
import type { DeviceRegistryEntry } from './data/device/device_registry';
import type { EntityRegistryDisplayEntry } from './data/entity/entity_registry';
import type { Themes } from './data/ws-themes';
import type {
  Connection,
  HassEntities,
  HassEntity,
  HassServiceTarget,
  MessageBase,
} from './ws/types';

export interface Context {
  id: string;
  parent_id?: string;
  user_id?: string | null;
}

export interface ServiceCallResponse<T = unknown> {
  context: Context;
  response?: T;
}

export interface ServiceCallRequest {
  domain: string;
  service: string;
  serviceData?: Record<string, unknown>;
  target?: HassServiceTarget;
}

export interface HomeAssistantRegistries {
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices: Record<string, DeviceRegistryEntry>;
  areas: Record<string, AreaRegistryEntry>;
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
  callService<T = unknown>(
    domain: ServiceCallRequest['domain'],
    service: ServiceCallRequest['service'],
    serviceData?: ServiceCallRequest['serviceData'],
    target?: ServiceCallRequest['target'],
    notifyOnError?: boolean,
    returnResponse?: boolean,
  ): Promise<ServiceCallResponse<T>>;
  callWS: CallWS;
}

export interface HomeAssistantFormatters {
  formatEntityState(stateObj: HassEntity, state?: string): string;
}

export interface HomeAssistantConnection {
  connection: Connection;
}

export interface HomeAssistantUI {
  themes: Themes;
}

export interface HomeAssistant
  extends
    HomeAssistantRegistries,
    HomeAssistantInternationalization,
    HomeAssistantApi,
    HomeAssistantFormatters,
    HomeAssistantConnection,
    HomeAssistantUI {
  states: HassEntities;
}
