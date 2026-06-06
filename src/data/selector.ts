/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/selector.ts
 *
 * Subset of HA selectors used by homeassistant-extras cards. Add selectors from
 * upstream when a card editor needs them.
 */

export type Selector =
  | AreaSelector
  | AttributeSelector
  | BooleanSelector
  | DeviceSelector
  | EntitySelector
  | IconSelector
  | MediaSelector
  | NumberSelector
  | ObjectSelector
  | SelectSelector
  | StringSelector
  | TemplateSelector
  | UiActionSelector
  | UiColorSelector
  | UiStateContentSelector;

export interface AreaSelector {
  area: {
    entity?: EntitySelectorFilter | readonly EntitySelectorFilter[];
    device?: DeviceSelectorFilter | readonly DeviceSelectorFilter[];
    multiple?: boolean;
    reorder?: boolean;
  } | null;
}

export interface AttributeSelector {
  attribute: {
    entity_id?: string | string[];
    hide_attributes?: readonly string[];
  } | null;
}

export interface BooleanSelector {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  boolean: {} | null;
}

export interface DeviceSelectorFilter {
  integration?: string;
  manufacturer?: string;
  model?: string;
  model_id?: string;
}

export interface DeviceSelector {
  device: {
    filter?: DeviceSelectorFilter | readonly DeviceSelectorFilter[];
    entity?: EntitySelectorFilter | readonly EntitySelectorFilter[];
    multiple?: boolean;
  } | null;
}

export interface EntitySelectorFilter {
  integration?: string;
  domain?: string | readonly string[];
  device_class?: string | readonly string[];
}

export interface EntitySelector {
  entity: {
    multiple?: boolean;
    include_entities?: string[];
    exclude_entities?: string[];
    filter?: EntitySelectorFilter | readonly EntitySelectorFilter[];
    reorder?: boolean;
  } | null;
}

export interface IconSelector {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  icon: {} | null;
}

export interface MediaSelector {
  media: {
    accept?: string[];
    image_upload?: boolean;
    clearable?: boolean;
    hide_content_type?: boolean;
    content_id_helper?: string;
  } | null;
}

export interface NumberSelector {
  number: {
    min?: number;
    max?: number;
    step?: number | 'any';
    mode?: 'box' | 'slider';
    unit_of_measurement?: string;
    slider_ticks?: boolean;
    translation_key?: string;
  } | null;
}

export interface ObjectSelector {
  object?: {
    label_field?: string;
    description_field?: string;
    translation_key?: string;
    fields?: Record<string, unknown>;
    multiple?: boolean;
  } | null;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectSelector {
  select: {
    multiple?: boolean;
    custom_value?: boolean;
    mode?: 'list' | 'dropdown' | 'box';
    options: readonly string[] | readonly SelectOption[];
    translation_key?: string;
    sort?: boolean;
    reorder?: boolean;
    box_max_columns?: number;
  } | null;
}

export interface StringSelector {
  text: {
    type?: string;
  } | null;
}

export interface TemplateSelector {
  template: {
    preview?: boolean;
  } | null;
}

export interface UiActionSelector {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ui_action: {} | null;
}

export interface UiColorExtraOption {
  value: string;
  label: string;
  icon?: string;
  display_color?: string;
}

export interface UiColorSelector {
  ui_color: {
    default_color?: string;
    include_none?: boolean;
    include_state?: boolean;
    extra_options?: UiColorExtraOption[];
  } | null;
}

export interface UiStateContentSelector {
  ui_state_content: {
    entity_id?: string;
    allow_name?: boolean;
    allow_context?: boolean;
  } | null;
}
