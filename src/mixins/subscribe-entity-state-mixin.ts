import type { LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { getEntitySubscriptionManager } from '../delegates/entities/subscriptions';
import type { HassEntity, SubscriptionUnsubscribe } from '../ws/types';
import type { Constructor } from './constructor';
import type { HassConfigInterface } from './hass-config-mixin';

export type SubscribeEntityStateElement<TConfig = unknown> =
  HassConfigInterface<TConfig>;

export interface SubscribeEntityStateInterface {
  /**
   * Convenience for the single-entity case. Set this to watch one entity and
   * read its value back from `state`. Composes with `entities`.
   */
  entity?: string;

  /**
   * The entity_ids to subscribe to. Set this property to specify which entities
   * to watch. Subscribing to one entity is just an array of length one.
   */
  entities?: string[];

  /**
   * The current state of the entity named by `entity` (the single-entity
   * convenience). Undefined when `entity` is unset or not yet received.
   */
  readonly state: HassEntity | undefined;

  /**
   * The current state of each subscribed entity, keyed by entity_id.
   * Read with `this.states[entityId]`. Updates cause a re-render.
   */
  states: Record<string, HassEntity | undefined>;
}

/**
 * Mixin that subscribes to entity state changes via subscribe_entities.
 * Only notifies on meaningful changes (state/attributes), not context/last_updated.
 *
 * Set `entities` to the list of entity_ids to watch; read `states[entityId]`
 * for the current state of each (undefined when not yet received). For the
 * common single-entity case, set `entity` and read `state` instead — e.g.
 * `<foo-element entity="light.bedroom">`.
 *
 * The underlying manager consolidates every entity into a single
 * subscribe_entities call per connection, so subscribing to N entities here is
 * cheap — it just registers N listeners.
 */
export const SubscribeEntityStateMixin = <
  T extends Constructor<LitElement & SubscribeEntityStateElement>,
>(
  superClass: T,
): T & Constructor<InstanceType<T> & SubscribeEntityStateInterface> => {
  class SubscribeEntityStateClass extends superClass {
    /**
     * Active subscriptions, keyed by entity_id. The keys of this map are the
     * set of entities we are currently subscribed to.
     */
    private readonly _unsubscribes = new Map<string, SubscriptionUnsubscribe>();

    /**
     * Single-entity convenience. When set, this entity is watched and its value
     * is exposed via the `state` getter. Composes with `entities`.
     */
    protected entity?: string;

    /**
     * The entity_ids to subscribe to. Set this property to specify which
     * entities to watch.
     */
    protected entities?: string[];

    /**
     * The current state of each subscribed entity, keyed by entity_id.
     * Reactive: reassigned (never mutated in place) so Lit re-renders.
     */
    @state()
    protected states: Record<string, HassEntity | undefined> = {};

    /**
     * Convenience accessor for the single-entity case. Derived from the
     * reactive `states` map, so it updates and re-renders automatically.
     */
    protected get state(): HassEntity | undefined {
      return this.entity ? this.states[this.entity] : undefined;
    }

    /**
     * Setup the entity subscriptions.
     */
    override connectedCallback(): void {
      super.connectedCallback();
      this._setupEntitySubscriptions();
    }

    /**
     * Teardown all entity subscriptions.
     */
    override disconnectedCallback(): void {
      this._teardownEntitySubscriptions();
      super.disconnectedCallback();
    }

    /**
     * Unsubscribe from everything and reset state. Used on disconnect and when
     * there is nothing valid to subscribe to.
     */
    private _teardownEntitySubscriptions(): void {
      for (const unsubscribe of this._unsubscribes.values()) {
        unsubscribe();
      }
      this._unsubscribes.clear();
      this.states = {};
    }

    /**
     * Reconcile active subscriptions against the desired `entities` list:
     * unsubscribe from entities that were dropped, subscribe to new ones, and
     * leave already-subscribed entities untouched (no churn).
     */
    private _setupEntitySubscriptions(): void {
      const hass = this.hass;

      // Combine the single-entity convenience with the array, de-duping so a
      // repeated id doesn't subscribe twice.
      const desired = new Set([
        ...(this.entity ? [this.entity] : []),
        ...(this.entities ?? []),
      ]);

      // Nothing to subscribe to — tear everything down.
      if (!hass || desired.size === 0) {
        this._teardownEntitySubscriptions();
        return;
      }

      // Remove subscriptions no longer desired, dropping their state keys.
      for (const [entityId, unsubscribe] of this._unsubscribes) {
        if (!desired.has(entityId)) {
          unsubscribe();
          this._unsubscribes.delete(entityId);
          // Reassign without the removed key so Lit picks up the change.
          const next = { ...this.states };
          delete next[entityId];
          this.states = next;
        }
      }

      // Add subscriptions for newly desired entities.
      const manager = getEntitySubscriptionManager(hass);
      for (const entityId of desired) {
        if (this._unsubscribes.has(entityId)) {
          continue;
        }
        const unsubscribe = manager.subscribe(entityId, (state) =>
          this._onState(entityId, state),
        );
        this._unsubscribes.set(entityId, unsubscribe);
      }
    }

    /**
     * Handle a state update for a single entity. Reassign `states` with a new
     * object reference so Lit detects the change and re-renders.
     */
    private _onState(entityId: string, state: HassEntity | undefined): void {
      this.states = { ...this.states, [entityId]: state };
    }
  }

  return SubscribeEntityStateClass as unknown as T &
    Constructor<InstanceType<T> & SubscribeEntityStateInterface>;
};
