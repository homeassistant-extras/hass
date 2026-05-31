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
          name: 'Status',
          icon: 'mdi:information',
          hidden: false,
        } as HomeAssistant['entities'][string] & {
          name: string;
          icon: string;
          hidden: boolean;
        },
      },
      devices: {},
      states: {},
      localize: () => '',
      connection: {} as HomeAssistant['connection'],
    };
  });

  describe('getEntity', () => {
    it('returns only EntityRegistryDisplayEntry fields', () => {
      expect(getEntity(mockHass, 'sensor.status')).to.deep.equal({
        entity_id: 'sensor.status',
        device_id: 'device-123',
        translation_key: 'status_code',
      });
    });

    it('strips extra runtime properties from hass.entities', () => {
      const result = getEntity(mockHass, 'sensor.status');
      expect(result).to.not.have.property('name');
      expect(result).to.not.have.property('icon');
      expect(result).to.not.have.property('hidden');
    });

    it('returns undefined when not found', () => {
      expect(getEntity(mockHass, 'sensor.missing')).to.be.undefined;
    });
  });
});
