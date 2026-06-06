import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';
import { UNAVAILABLE, UNKNOWN } from '../../../../../../src/data/entity';
import { renderTileBadge } from '../../../../../../src/panels/lovelace/cards/tile/badges/tile-badge';
import { createState as s } from '../../../../../test-helpers';

describe('tile-badge.ts', () => {
  let mockHass: HomeAssistant;

  beforeEach(() => {
    mockHass = {
      states: {},
      entities: {},
      devices: {},
      areas: {},
      themes: {},
      localize: () => '',
      language: 'en',
      callService: () => ({}),
      callWS: () => ({}),
      formatEntityState: () => '',
    } as any as HomeAssistant;
  });

  describe('renderTileBadge', () => {
    it('should return nothing when state is UNKNOWN', () => {
      const stateObj = s('sensor.test', UNKNOWN);
      const result = renderTileBadge(stateObj, mockHass);
      expect(result).to.equal(nothing);
    });

    it('should render unavailable badge when state is UNAVAILABLE', async () => {
      const stateObj = s('sensor.test', UNAVAILABLE);
      const result = renderTileBadge(stateObj, mockHass);
      expect(result).to.not.equal(nothing);

      const el = await fixture(result as TemplateResult);
      expect(el.tagName.toLowerCase()).to.equal('ha-tile-badge');
      const icon = el.querySelector('ha-icon');
      expect(icon).to.exist;
      expect(icon?.getAttribute('icon')).to.equal('mdi:exclamation-thick');
    });

    it('should route person entities to renderPersonBadge', () => {
      const stateObj = s('person.test', 'home');
      const result = renderTileBadge(stateObj, mockHass);
      expect(result).to.not.equal(nothing);
    });

    it('should route climate entities to renderClimateBadge', () => {
      const stateObj = s('climate.test', 'heat', {
        hvac_action: 'heating',
      });
      const result = renderTileBadge(stateObj, mockHass);
      expect(result).to.not.equal(nothing);
    });

    it('should route humidifier entities to renderHumidifierBadge', () => {
      const stateObj = s('humidifier.test', 'on', {
        action: 'humidifying',
      });
      const result = renderTileBadge(stateObj, mockHass);
      expect(result).to.not.equal(nothing);
    });

    it('should return nothing for unknown domains', () => {
      const stateObj = s('sensor.test', 'on');
      const result = renderTileBadge(stateObj, mockHass);
      expect(result).to.equal(nothing);
    });
  });
});
