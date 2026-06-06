import { expect } from 'chai';
import {
  climateHvacModeIcon,
  compareClimateHvacModes,
} from '../../src/data/climate';

describe('climate.ts', () => {
  describe('compareClimateHvacModes', () => {
    it('orders modes according to HVAC_MODES', () => {
      expect(compareClimateHvacModes('heat', 'cool')).to.be.lessThan(0);
      expect(compareClimateHvacModes('cool', 'heat')).to.be.greaterThan(0);
      expect(compareClimateHvacModes('auto', 'auto')).to.equal(0);
    });
  });

  describe('climateHvacModeIcon', () => {
    it('returns icon for known mode', () => {
      expect(climateHvacModeIcon('cool')).to.equal('mdi:snowflake');
    });

    it('returns fallback for unknown mode', () => {
      expect(climateHvacModeIcon('unknown')).to.equal('mdi:thermostat');
    });
  });
});
