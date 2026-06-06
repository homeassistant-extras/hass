import { expect } from 'chai';
import { getState } from '../../../src/delegates/retrievers/state';
import type { HomeAssistant } from '../../../src/types';
import { createState as s } from '../../test-helpers';

describe('state.ts', () => {
  let mockHass: HomeAssistant;

  beforeEach(() => {
    mockHass = {
      states: {
        'light.test': s('light.test', 'on'),
      },
      entities: {},
      devices: {},
      language: 'en',
      localize: () => '',
      callWS: () => undefined as never,
      connection: {} as HomeAssistant['connection'],
    } as unknown as HomeAssistant;
  });

  describe('getState', () => {
    it('returns undefined for missing entity', () => {
      expect(getState(mockHass, 'light.missing')).to.be.undefined;
    });

    it('returns undefined for missing entity id', () => {
      expect(getState(mockHass)).to.be.undefined;
    });

    it('returns narrowed state fields for a known entity', () => {
      expect(getState(mockHass, 'light.test')).to.deep.equal({
        entity_id: 'light.test',
        state: 'on',
        attributes: {},
        last_changed: mockHass.states['light.test']!.last_changed,
        last_updated: mockHass.states['light.test']!.last_updated,
      });
    });
  });
});
