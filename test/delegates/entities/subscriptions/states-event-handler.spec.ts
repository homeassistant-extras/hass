import { expect } from 'chai';
import { StatesEventHandler } from '../../../../src/delegates/entities/subscriptions';
import type { HomeAssistant } from '../../../../src/types';
import type { StatesUpdates } from '../../../../src/ws/entities';
import type { HassEntity } from '../../../../src/ws/types';

describe('StatesEventHandler', () => {
  it('processes ev.a (add) and ev.r (remove) for subscribed entities', () => {
    const listeners = new Map<
      string,
      Set<(s: HassEntity | undefined) => void>
    >();
    const state = new Map<string, HassEntity>();
    const calls: Array<HassEntity | undefined> = [];

    const set = new Set<(s: HassEntity | undefined) => void>();
    set.add((s) => calls.push(s));
    listeners.set('light.a', set);

    const hass = { states: {} } as unknown as HomeAssistant;
    const handler = new StatesEventHandler(listeners, state, hass);

    // Add: ev.a
    const evAdd: StatesUpdates = {
      a: {
        'light.a': {
          s: 'on',
          a: { brightness: 255 },
          c: '',
          lc: 0,
          lu: 0,
        },
      },
      c: {},
    };
    handler.handle(evAdd);
    expect(state.get('light.a')).to.deep.include({
      entity_id: 'light.a',
      state: 'on',
      attributes: { brightness: 255 },
    });
    expect(calls).to.have.length(1);
    expect(calls[0]).to.deep.include({ state: 'on' });

    // Remove: ev.r
    calls.length = 0;
    const evRemove: StatesUpdates = { r: ['light.a'], c: {} };
    handler.handle(evRemove);
    expect(state.has('light.a')).to.be.false;
    expect(calls).to.have.length(1);
    expect(calls[0]).to.be.undefined;
  });
});
