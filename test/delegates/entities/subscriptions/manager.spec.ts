import { expect } from 'chai';
import { useFakeTimers } from 'sinon';
import { getEntitySubscriptionManager } from '../../../../src/delegates/entities/subscriptions';
import type { HomeAssistant } from '../../../../src/types';

const RESUBSCRIBE_DEBOUNCE_MS = 50;

describe('EntitySubscriptionManager', () => {
  it('returns same manager for same connection', () => {
    const conn = { subscribeMessage: () => Promise.resolve(() => {}) };
    const hass = {
      connection: conn,
      states: {},
    } as unknown as HomeAssistant;

    const m1 = getEntitySubscriptionManager(hass);
    const m2 = getEntitySubscriptionManager(hass);

    expect(m1).to.equal(m2);
  });

  it('returns different managers for different connections', () => {
    const hass1 = {
      connection: { subscribeMessage: () => Promise.resolve(() => {}) },
      states: {},
    } as unknown as HomeAssistant;
    const hass2 = {
      connection: { subscribeMessage: () => Promise.resolve(() => {}) },
      states: {},
    } as unknown as HomeAssistant;

    const m1 = getEntitySubscriptionManager(hass1);
    const m2 = getEntitySubscriptionManager(hass2);

    expect(m1).to.not.equal(m2);
  });

  it('batches multiple entities into one subscription', async () => {
    const clock = useFakeTimers();
    let capturedMsg: unknown = null;
    const subscribeMessage = (_cb: (ev: unknown) => void, msg: unknown) => {
      capturedMsg = msg;
      return Promise.resolve(() => {});
    };
    const hass = {
      connection: { subscribeMessage },
      states: {
        'light.a': { entity_id: 'light.a', state: 'on', attributes: {} },
        'light.b': { entity_id: 'light.b', state: 'off', attributes: {} },
      },
    } as unknown as HomeAssistant;

    const manager = getEntitySubscriptionManager(hass);
    const unsub1 = manager.subscribe('light.a', () => {});
    clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
    await Promise.resolve();

    expect(capturedMsg).to.deep.equal({
      type: 'subscribe_entities',
      entity_ids: ['light.a'],
    });

    const unsub2 = manager.subscribe('light.b', () => {});
    clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
    await Promise.resolve();

    expect(capturedMsg).to.deep.equal({
      type: 'subscribe_entities',
      entity_ids: ['light.a', 'light.b'],
    });

    unsub1();
    unsub2();
    clock.restore();
  });

  it('deduplicates listeners for same entity', async () => {
    const clock = useFakeTimers();
    let capturedMsg: unknown = null;
    const subscribeMessage = (_cb: (ev: unknown) => void, msg: unknown) => {
      capturedMsg = msg;
      return Promise.resolve(() => {});
    };
    const hass = {
      connection: { subscribeMessage },
      states: {
        'light.x': { entity_id: 'light.x', state: 'on', attributes: {} },
      },
    } as unknown as HomeAssistant;

    const manager = getEntitySubscriptionManager(hass);
    manager.subscribe('light.x', () => {});
    manager.subscribe('light.x', () => {});
    clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
    await Promise.resolve();

    expect(capturedMsg).to.deep.equal({
      type: 'subscribe_entities',
      entity_ids: ['light.x'],
    });
    clock.restore();
  });

  it('delivers current state immediately to every new listener (multi-element)', () => {
    const hass = {
      connection: { subscribeMessage: () => Promise.resolve(() => {}) },
      states: {
        'light.x': {
          entity_id: 'light.x',
          state: 'on',
          attributes: {},
          last_changed: '',
          last_updated: '',
        },
      },
    } as unknown as HomeAssistant;

    const manager = getEntitySubscriptionManager(hass);
    const statesA: string[] = [];
    const statesB: string[] = [];

    // Only the first subscription triggers subscribe_entities; the second
    // listener must still get the cached state synchronously, not stay empty
    // until the next websocket push.
    manager.subscribe('light.x', (s) => statesA.push(s?.state ?? 'undefined'));
    manager.subscribe('light.x', (s) => statesB.push(s?.state ?? 'undefined'));

    expect(statesA).to.deep.equal(['on']);
    expect(statesB).to.deep.equal(['on']);
  });

  it('delivers undefined initially when the entity is unknown', () => {
    const hass = {
      connection: { subscribeMessage: () => Promise.resolve(() => {}) },
      states: {},
    } as unknown as HomeAssistant;

    const manager = getEntitySubscriptionManager(hass);
    const received: (string | undefined)[] = [];

    manager.subscribe('light.missing', (s) => received.push(s?.state));

    expect(received).to.deep.equal([undefined]);
  });
});
