import { expect } from 'chai';
import { getEntity } from '../../../src/delegates/retrievers/entity';
import type { HomeAssistant } from '../../../src/types';

describe('entity.ts', () => {
  let mockHass: HomeAssistant;

  beforeEach(() => {
    mockHass = {
      entities: {
        'sensor.status': {
          entity_id: 'sensor.status',
          device_id: 'device-123',
          translation_key: 'status_code',
        },
      },
      devices: {},
      states: {},
      language: 'en',
      localize: () => '',
      callWS: () => undefined as never,
      connection: {} as HomeAssistant['connection'],
    } as unknown as HomeAssistant;
  });

  describe('getEntity', () => {
    it('returns only EntityRegistryDisplayEntry fields', () => {
      expect(getEntity(mockHass, 'sensor.status')).to.deep.equal({
        entity_id: 'sensor.status',
        name: undefined,
        device_id: 'device-123',
        area_id: undefined,
        labels: undefined,
        hidden: undefined,
        entity_category: undefined,
        translation_key: 'status_code',
        platform: undefined,
      });
    });

    it('returns undefined when not found', () => {
      expect(getEntity(mockHass, 'sensor.missing')).to.be.undefined;
    });
  });
});
