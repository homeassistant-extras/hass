import type { HomeAssistant } from "../types";
import type { LitElement } from "lit";
import type { Constructor } from "./constructor";

export interface HassConfigInterface<TConfig = unknown> {
  hass: HomeAssistant;
  config: TConfig;
}

/**
 * Provides non-decorated `hass` and `config` fields.
 *
 * These are intentionally NOT `@property()` to avoid Lit reactive property
 * plumbing/attribute semantics.
 */
export const HassConfigMixin = <
  T extends Constructor<LitElement>,
  TConfig = unknown,
>(
  superClass: T,
): T & Constructor<InstanceType<T> & HassConfigInterface<TConfig>> => {
  class HassConfigClass extends superClass {
    public hass!: HomeAssistant;
    public config!: TConfig;
  }

  return HassConfigClass as unknown as T &
    Constructor<InstanceType<T> & HassConfigInterface<TConfig>>;
};
