import { expect } from 'chai';
import { stateActive } from '../../../src/common/entity/state_active';
import { OFF, UNAVAILABLE, UNKNOWN } from '../../../src/data/entity/entity';
import type { HassEntity } from '../../../src/ws/types';

describe('state_active.ts', () => {
  const createStateObj = (entityId: string, state: string): HassEntity => ({
    entity_id: entityId,
    state,
    attributes: {},
    last_changed: '',
  });

  describe('Generic state behavior', () => {
    it('should return false for unavailable states', () => {
      expect(stateActive(createStateObj('light.test', UNAVAILABLE))).to.be
        .false;
    });

    it('should return false for unknown states', () => {
      expect(stateActive(createStateObj('light.test', UNKNOWN))).to.be.false;
    });

    it('should return false for "off" state in most domains', () => {
      expect(stateActive(createStateObj('light.test', OFF))).to.be.false;
    });

    it('should return true for other standard states', () => {
      expect(stateActive(createStateObj('light.test', 'on'))).to.be.true;
    });

    it('should use provided state instead of state object when available', () => {
      const stateObj = createStateObj('light.test', 'on');
      expect(stateActive(stateObj, OFF)).to.be.false;
      expect(stateActive(stateObj, 'on')).to.be.true;
    });
  });

  describe('Button-like domains', () => {
    const buttonLikeDomains = [
      'button',
      'event',
      'infrared',
      'input_button',
      'radio_frequency',
      'scene',
    ];

    buttonLikeDomains.forEach((domain) => {
      it(`should return true for ${domain} when not unavailable`, () => {
        expect(stateActive(createStateObj(`${domain}.test`, 'pressed'))).to.be
          .true;
      });

      it(`should return false for ${domain} when unavailable`, () => {
        expect(stateActive(createStateObj(`${domain}.test`, UNAVAILABLE))).to.be
          .false;
      });
    });
  });

  describe('Domain-specific behavior', () => {
    it('should handle alarm_control_panel domain', () => {
      const domain = 'alarm_control_panel';
      expect(stateActive(createStateObj(`${domain}.test`, 'disarmed'))).to.be
        .false;
      expect(stateActive(createStateObj(`${domain}.test`, 'armed_home'))).to.be
        .true;
    });

    it('should handle alert domain', () => {
      const domain = 'alert';
      expect(stateActive(createStateObj(`${domain}.test`, 'idle'))).to.be.false;
      expect(stateActive(createStateObj(`${domain}.test`, OFF))).to.be.true;
      expect(stateActive(createStateObj(`${domain}.test`, 'on'))).to.be.true;
    });

    it('should handle cover domain', () => {
      const domain = 'cover';
      expect(stateActive(createStateObj(`${domain}.test`, 'closed'))).to.be
        .false;
      expect(stateActive(createStateObj(`${domain}.test`, 'open'))).to.be.true;
    });

    it('should handle person and device_tracker domains', () => {
      ['person', 'device_tracker'].forEach((domain) => {
        expect(stateActive(createStateObj(`${domain}.test`, 'not_home'))).to.be
          .false;
        expect(stateActive(createStateObj(`${domain}.test`, 'home'))).to.be
          .true;
      });
    });

    it('should handle lawn_mower domain', () => {
      const domain = 'lawn_mower';
      expect(stateActive(createStateObj(`${domain}.test`, 'mowing'))).to.be
        .true;
      expect(stateActive(createStateObj(`${domain}.test`, 'error'))).to.be.true;
      expect(stateActive(createStateObj(`${domain}.test`, 'idle'))).to.be.true;
      expect(stateActive(createStateObj(`${domain}.test`, 'docked'))).to.be
        .false;
      expect(stateActive(createStateObj(`${domain}.test`, 'paused'))).to.be
        .false;
    });

    it('should handle lock domain', () => {
      const domain = 'lock';
      expect(stateActive(createStateObj(`${domain}.test`, 'locked'))).to.be
        .false;
      expect(stateActive(createStateObj(`${domain}.test`, 'unlocked'))).to.be
        .true;
    });

    it('should handle media_player domain', () => {
      const domain = 'media_player';
      expect(stateActive(createStateObj(`${domain}.test`, 'standby'))).to.be
        .false;
      expect(stateActive(createStateObj(`${domain}.test`, 'playing'))).to.be
        .true;
    });

    it('should handle vacuum domain', () => {
      const domain = 'vacuum';
      expect(stateActive(createStateObj(`${domain}.test`, 'idle'))).to.be.false;
      expect(stateActive(createStateObj(`${domain}.test`, 'docked'))).to.be
        .false;
      expect(stateActive(createStateObj(`${domain}.test`, 'paused'))).to.be
        .false;
      expect(stateActive(createStateObj(`${domain}.test`, 'cleaning'))).to.be
        .true;
    });

    it('should handle valve domain', () => {
      const domain = 'valve';
      expect(stateActive(createStateObj(`${domain}.test`, 'closed'))).to.be
        .false;
      expect(stateActive(createStateObj(`${domain}.test`, 'open'))).to.be.true;
    });

    it('should handle plant domain', () => {
      const domain = 'plant';
      expect(stateActive(createStateObj(`${domain}.test`, 'ok'))).to.be.false;
      expect(stateActive(createStateObj(`${domain}.test`, 'problem'))).to.be
        .true;
    });

    it('should handle group domain', () => {
      const domain = 'group';
      expect(stateActive(createStateObj(`${domain}.test`, 'on'))).to.be.true;
      expect(stateActive(createStateObj(`${domain}.test`, 'off'))).to.be.false;
    });

    it('should handle timer domain', () => {
      const domain = 'timer';
      expect(stateActive(createStateObj(`${domain}.test`, 'active'))).to.be
        .true;
      expect(stateActive(createStateObj(`${domain}.test`, 'idle'))).to.be.false;
    });

    it('should handle camera domain', () => {
      const domain = 'camera';
      expect(stateActive(createStateObj(`${domain}.test`, 'streaming'))).to.be
        .true;
      expect(stateActive(createStateObj(`${domain}.test`, 'idle'))).to.be.false;
    });
  });

  describe('Default behavior', () => {
    it('should return true for domains not explicitly handled', () => {
      expect(stateActive(createStateObj('custom_domain.test', 'any_state'))).to
        .be.true;
    });
  });
});
