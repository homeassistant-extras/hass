/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/selector.ts
 */

export type Selector =
  | BooleanSelector
  | DeviceSelector
  | EntitySelector
  | IconSelector
  | NumberSelector
  | SelectSelector
  | StringSelector
  | UiActionSelector;

export interface BooleanSelector {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- upstream HA
  boolean: {} | null;
}

export interface DeviceSelector {
  device: {
    filter?: DeviceSelectorFilter | DeviceSelectorFilter[];
    entity?: EntitySelectorFilter | EntitySelectorFilter[];
    multiple?: boolean;
  } | null;
}

export interface DeviceSelectorFilter {
  integration?: string;
  manufacturer?: string;
  model?: string;
  model_id?: string;
}

export interface EntitySelectorFilter {
  integration?: string;
  domain?: string | string[];
  device_class?: string | string[];
}

export interface EntitySelector {
  entity: {
    multiple?: boolean;
    include_entities?: string[];
    filter?: EntitySelectorFilter | EntitySelectorFilter[];
  } | null;
}

export interface IconSelector {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- upstream HA
  icon: {} | null;
}

export interface NumberSelector {
  number: {
    min?: number;
    max?: number;
    mode?: 'box' | 'slider';
  } | null;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectSelector {
  select: {
    multiple?: boolean;
    mode?: 'list' | 'dropdown';
    options: readonly string[] | readonly SelectOption[];
  } | null;
}

export interface StringSelector {
  text: { type?: string };
}

export interface UiActionSelector {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- upstream HA
  ui_action: {} | null;
}
