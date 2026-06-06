import { expect } from 'chai';
import { getSensorNumericDeviceClasses } from '../../src/data/sensor';
import type { HomeAssistant } from '../../src/types';

const numericDeviceClasses = {
  numeric_device_classes: [
    'temperature',
    'humidity',
    'pressure',
    'battery',
    'illuminance',
    'power',
    'energy',
  ],
};

describe('sensor.ts', () => {
  describe('getSensorNumericDeviceClasses', () => {
    it('should fetch once and reuse the cached promise', async () => {
      let callCount = 0;
      const mockHass = {
        callWS: () => {
          callCount++;
          return Promise.resolve(numericDeviceClasses);
        },
      } as unknown as HomeAssistant;

      const first = await getSensorNumericDeviceClasses(mockHass);
      const second = await getSensorNumericDeviceClasses(mockHass);

      expect(callCount).to.equal(1);
      expect(first).to.deep.equal(numericDeviceClasses);
      expect(second).to.equal(first);
    });
  });
});
