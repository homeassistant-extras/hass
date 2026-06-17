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
 * Public surface the mixin adds on top of its superclass: the `_host` escape
 * hatch and the (re-)bind hooks portalled descendants use after `_host` is set.
 */
export interface HassUpdateInterface {
  /**
   * Optional escape hatch for portalled descendants (e.g. a dialog HA's
   * dialog manager moves out of the card's shadow tree). When set, the mixin
   * listens on `_host.shadowRoot` instead of `getRootNode()`.
   */
  _host?: Element;
  _bindHassUpdateListener(): void;
  _unbindHassUpdateListener(): void;
}

/**
 * Mixin that keeps `hass` in sync with a scoped `hass-update` event.
 *
 * Stacks on `HassConfigMixin`, so the superclass already provides the `hass`
 * and `config` fields; this mixin just reassigns `hass` whenever a
 * `hass-update` event is fired on its scope. Use it on children whose parent
 * skips full Lit updates, so they can react to `hass` changes themselves.
 *
 * The listener is attached to the element's own root node (the parent card's
 * shadow tree) rather than `globalThis`, so each card's events stay isolated
 * from sibling cards on the same dashboard. The owning card should dispatch
 * `hass-update` on its own `shadowRoot`. A `_host` escape hatch handles
 * portalled descendants (e.g. dialogs HA's dialog manager moves out of the
 * tree).
 *
 * @param superClass - The base class to mixin
 */
export const HassUpdateMixin = <
  T extends Constructor<LitElement & HassUpdateElement>,
>(
  superClass: T,
): T & Constructor<HassUpdateInterface> => {
  class HassUpdateClass extends superClass {
    private _listenerTarget?: EventTarget;

    /**
     * Optional escape hatch for portalled descendants (e.g. a dialog HA's
     * dialog manager moves out of the card's shadow tree). When set, the mixin
     * listens on `_host.shadowRoot` instead of `getRootNode()`, routing events
     * back to the original card.
     */
    _host?: Element;

    private readonly _boundHassUpdateHandler =
      this._handleHassUpdate.bind(this);

    override connectedCallback(): void {
      super.connectedCallback();
      this._bindHassUpdateListener();
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this._unbindHassUpdateListener();
    }

    /**
     * Attaches the listener to the closest scope: an explicit `_host`'s
     * shadow root if set (for portalled descendants), otherwise the
     * component's own root node (the parent shadow tree). Each card has a
     * distinct shadow root, so this naturally isolates events per card.
     *
     * Exposed so portalled descendants can re-bind after `_host` is supplied,
     * since their `connectedCallback` runs before the property is set.
     */
    _bindHassUpdateListener(): void {
      if (this._listenerTarget) return;
      const target = this._resolveListenerTarget();
      if (target) {
        this._listenerTarget = target;
        target.addEventListener('hass-update', this._boundHassUpdateHandler);
      }
    }

    _unbindHassUpdateListener(): void {
      if (this._listenerTarget) {
        this._listenerTarget.removeEventListener(
          'hass-update',
          this._boundHassUpdateHandler,
        );
        this._listenerTarget = undefined;
      }
    }

    private _resolveListenerTarget(): EventTarget | undefined {
      if (this._host?.shadowRoot) {
        return this._host.shadowRoot;
      }
      const getRootNode = (this as unknown as { getRootNode?: () => unknown })
        .getRootNode;
      if (typeof getRootNode !== 'function') return undefined;
      const root = getRootNode.call(this) as EventTarget;
      return root && root !== (this as unknown as EventTarget)
        ? root
        : undefined;
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
