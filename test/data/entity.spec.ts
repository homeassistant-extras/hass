import { expect } from 'chai';
import {
  OFF,
  OFF_STATES,
  ON,
  UNAVAILABLE,
  UNKNOWN,
  isOffState,
} from '../../src/data/entity/entity';

describe('entity.ts', () => {
  describe('Constants', () => {
    it('should have the correct state constants', () => {
      expect(UNAVAILABLE).to.equal('unavailable');
      expect(UNKNOWN).to.equal('unknown');
      expect(ON).to.equal('on');
      expect(OFF).to.equal('off');
    });

    it('should define OFF_STATES correctly', () => {
      expect(OFF_STATES).to.deep.equal(['unavailable', 'unknown', 'off']);
    });
  });

  describe('isOffState', () => {
    it('should return true for off states', () => {
      expect(isOffState(UNAVAILABLE)).to.be.true;
      expect(isOffState(UNKNOWN)).to.be.true;
      expect(isOffState(OFF)).to.be.true;
    });

    it('should return false for on states', () => {
      expect(isOffState(ON)).to.be.false;
      expect(isOffState('any_other_state')).to.be.false;
    });

    it('should handle edge cases', () => {
      expect(isOffState('')).to.be.false;
      expect(isOffState(null)).to.be.false;
      expect(isOffState(undefined)).to.be.false;
    });
  });
});
