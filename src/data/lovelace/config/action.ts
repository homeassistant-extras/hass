/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/lovelace/config/action.ts
 */

import type { HassServiceTarget } from '../../../ws/types';

export interface CallServiceActionConfig extends BaseActionConfig {
  action: 'call-service';
  service?: string;
  target?: HassServiceTarget;
  service_data?: Record<string, unknown>;
}

export interface MoreInfoActionConfig extends BaseActionConfig {
  action: 'more-info';
}

export interface NavigateActionConfig extends BaseActionConfig {
  action: 'navigate';
  navigation_path: string;
}

export interface UrlActionConfig extends BaseActionConfig {
  action: 'url';
  url_path: string;
}

export interface ToggleActionConfig extends BaseActionConfig {
  action: 'toggle';
}

export interface NoActionConfig extends BaseActionConfig {
  action: 'none';
}

export interface CustomActionConfig extends BaseActionConfig {
  action: 'fire-dom-event';
}

export interface BaseActionConfig {
  action: string;
}

export type ActionConfig =
  | CallServiceActionConfig
  | MoreInfoActionConfig
  | NavigateActionConfig
  | UrlActionConfig
  | ToggleActionConfig
  | NoActionConfig
  | CustomActionConfig;
