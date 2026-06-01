import { expect } from 'chai';
import { getState } from '../../../src/delegates/retrievers/state';
import type { HomeAssistant } from '../../../src/types';
import type { HassEntity } from '../../../src/ws/types';

const entity = (
  domain: string,
  name: string,
  state = 'on',
  attributes: Record<string, unknown> = {},
): HassEntity => ({
  entity_id: `${domain}.${name}`,
  state,
  attributes,
  last_changed: new Date().toISOString(),
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
      language: 'en',
      localize: () => '',
      callWS: () => undefined as never,
      connection: {} as HomeAssistant['connection'],
    };
  });

  describe('getState', () => {
    it('returns undefined for missing entity', () => {
      expect(getState(mockHass, 'light.missing')).to.be.undefined;
    });

    it('returns undefined for missing entity id', () => {
      expect(getState(mockHass)).to.be.undefined;
    });
  });
});
