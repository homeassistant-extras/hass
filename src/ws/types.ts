/**
 * https://github.com/home-assistant/home-assistant-js-websocket/blob/master/lib/types.ts
 */

export type UnsubscribeFunc = () => void;

export type MessageBase = {
  id?: number;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- upstream HA websocket
  [key: string]: any;
};

export type Context = {
  id: string;
  user_id: string | null;
  parent_id: string | null;
};

export type HassServiceTarget = {
  entity_id?: string | string[];
  device_id?: string | string[];
};

export type HassEntityBase = {
  entity_id: string;
  state: string;
  last_changed: string;
  last_updated: string;
  attributes: HassEntityAttributeBase;
};

export type HassEntityAttributeBase = {
  friendly_name?: string;
  unit_of_measurement?: string;
  device_class?: string;
  state_class?: string;
};

export type HassEntity = HassEntityBase & {
  attributes: { [key: string]: unknown };
};

export type HassEntities = { [entity_id: string]: HassEntity };

export interface Connection {
  subscribeMessage<Result>(
    callback: (result: Result) => void,
    subscribeMessage: MessageBase,
    options?: {
      resubscribe?: boolean;
      preCheck?: () => boolean | Promise<boolean>;
    },
  ): Promise<UnsubscribeFunc>;
}
