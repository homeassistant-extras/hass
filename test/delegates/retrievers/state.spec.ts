import { expect } from 'chai';
import { getState } from '../../../src/delegates/retrievers/state';
import type { HomeAssistant } from '../../../src/types';
import type { HassEntity } from '../../../src/ws/types';

const entity = (
  domain: string,
  name: string,
  state = 'on',
  attributes: Record<string, unknown> = {},
  extra: Partial<HassEntity> = {},
): HassEntity & Record<string, unknown> => ({
  entity_id: `${domain}.${name}`,
  state,
  attributes,
  last_changed: new Date().toISOString(),
  last_updated: 'ignored',
  context: { id: '1', user_id: null, parent_id: null },
  ...extra,
});

describe('state.ts', () => {
  let mockHass: HomeAssistant;

  beforeEach(() => {
    mockHass = {
      states: {
        'light.test': entity('light', 'test'),
      },
      entities: {},
      devices: {},
      localize: () => '',
      connection: {} as HomeAssistant['connection'],
    };
  });

  describe('getState', () => {
    it('returns undefined for missing entity', () => {
      expect(getState(mockHass, 'light.missing')).to.be.undefined;
    });

    it('returns undefined for missing entity id', () => {
      expect(getState(mockHass, undefined)).to.be.undefined;
    });

    it('returns only HassEntity fields', () => {
      expect(getState(mockHass, 'light.test')).to.deep.equal({
        entity_id: 'light.test',
        state: 'on',
        attributes: {},
        last_changed: mockHass.states['light.test']!.last_changed,
      });
    });

    it('strips extra runtime properties from hass.states', () => {
      const result = getState(mockHass, 'light.test');
      expect(result).to.not.have.property('last_updated');
      expect(result).to.not.have.property('context');
    });
  });
});
