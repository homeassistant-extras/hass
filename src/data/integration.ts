/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/integration.ts
 *
 * Types only (runtime manifest helpers omitted).
 */

export type IntegrationType =
  | 'device'
  | 'helper'
  | 'hub'
  | 'service'
  | 'hardware'
  | 'entity'
  | 'system';

export interface IntegrationManifest {
  is_built_in: boolean;
  overwrites_built_in?: boolean;
  domain: string;
  name: string;
  config_flow: boolean;
  documentation: string;
  issue_tracker?: string;
  dependencies?: string[];
  after_dependencies?: string[];
  codeowners?: string[];
  requirements?: string[];
  ssdp?: { manufacturer?: string; modelName?: string; st?: string }[];
  zeroconf?: string[];
  homekit?: { models: string[] };
  integration_type?: IntegrationType;
  loggers?: string[];
  quality_scale?:
    | 'bronze'
    | 'silver'
    | 'gold'
    | 'platinum'
    | 'no_score'
    | 'internal'
    | 'legacy'
    | 'custom';
  iot_class:
    | 'assumed_state'
    | 'cloud_polling'
    | 'cloud_push'
    | 'local_polling'
    | 'local_push';
  single_config_entry?: boolean;
  version?: string;
}
