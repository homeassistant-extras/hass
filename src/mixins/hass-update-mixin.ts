import type { LitElement } from 'lit';
import type { HomeAssistant } from '../types';
import type { Constructor } from './constructor';
import type { HassConfigInterface } from './hass-config-mixin';

export interface HassUpdateEvent {
  /**
   * The new Home Assistant instance.
   */
  hass: HomeAssistant;
}

export type HassUpdateElement<TConfig = unknown> = HassConfigInterface<TConfig>;

/**
 * Mixin that keeps `hass` in sync with the global `hass-update` event.
 *
 * Stacks on `HassConfigMixin`, so the superclass already provides the `hass`
 * and `config` fields; this mixin just reassigns `hass` whenever a
 * `hass-update` event is fired on `globalThis`. Use it on children whose parent
 * skips full Lit updates, so they can react to `hass` changes themselves.
 *
 * @param superClass - The base class to mixin
 */
export const HassUpdateMixin = <
  T extends Constructor<LitElement & HassUpdateElement>,
>(
  superClass: T,
): T => {
  class HassUpdateClass extends superClass {
    private readonly _boundHassUpdateHandler =
      this._handleHassUpdate.bind(this);

    override connectedCallback(): void {
      super.connectedCallback();
      globalThis.addEventListener('hass-update', this._boundHassUpdateHandler);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      globalThis.removeEventListener(
        'hass-update',
        this._boundHassUpdateHandler,
      );
    }

    private _handleHassUpdate(event: Event): void {
      const {
        detail: { hass },
      } = event as CustomEvent<HassUpdateEvent>;
      this.hass = hass;
    }
  }

  return HassUpdateClass;
};
