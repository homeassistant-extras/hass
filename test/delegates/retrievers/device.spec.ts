import { expect } from 'chai';
import { getDevice } from '../../../src/delegates/retrievers/device';
import type { HomeAssistant } from '../../../src/types';

describe('device.ts', () => {
  let mockHass: HomeAssistant;

  beforeEach(() => {
    mockHass = {
      devices: {
        'device-123': {
          id: 'device-123',
          config_entries: ['config-123'],
          identifiers: [['litterrobot', 'device-123']],
          manufacturer: 'Whisker',
          model: 'LR5',
          model_id: 'model-123',
          name: 'Living Room Light',
          name_by_user: 'user name',
          serial_number: 'LR5-12345',
        },
      },
      entities: {},
      states: {},
      language: 'en',
      localize: () => '',
      callWS: () => undefined as never,
      connection: {} as HomeAssistant['connection'],
    } as unknown as HomeAssistant;
  });

  describe('getDevice', () => {
    it('returns only DeviceRegistryEntry fields', () => {
      expect(getDevice(mockHass, 'device-123')).to.deep.equal({
        id: 'device-123',
        config_entries: ['config-123'],
        identifiers: [['litterrobot', 'device-123']],
        manufacturer: 'Whisker',
        model: 'LR5',
        model_id: 'model-123',
        name: 'Living Room Light',
        name_by_user: 'user name',
        serial_number: 'LR5-12345',
      });
    });

    it('returns undefined when not found', () => {
      expect(getDevice(mockHass, 'missing')).to.be.undefined;
    });
  });
});
