import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { type TemplateResult } from 'lit';
import { renderPersonBadge } from '../../../../../../src/panels/lovelace/cards/tile/badges/tile-badge-person';
import type { HomeAssistant } from '../../../../../../src/types';
import { createState as s } from '../../../../../test-helpers';

describe('tile-badge-person.ts', () => {
  let mockHass: HomeAssistant;

  beforeEach(() => {
    mockHass = {
      states: {
        'zone.living_room': s('zone.living_room', 'living_room', {
          friendly_name: 'Living Room',
          icon: 'mdi:sofa',
        }),
        'zone.not_home': s('zone.not_home', 'not_home', {
          friendly_name: 'Not Home',
          icon: 'mdi:home-export-outline',
        }),
      },
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

  describe('renderPersonBadge', () => {
    it('should render badge with zone icon when person is in a zone', async () => {
      const stateObj = s('person.test', 'living_room');
      const result = renderPersonBadge(stateObj, mockHass);
      expect(result).to.not.equal(undefined);

      const el = await fixture(result as TemplateResult);
      expect(el.tagName.toLowerCase()).to.equal('ha-tile-badge');
      expect(el.querySelector('ha-icon')).to.exist;
    });

    it('should render badge with home icon when person is at home', async () => {
      const stateObj = s('person.test', 'home');
      const result = renderPersonBadge(stateObj, mockHass);
      expect(result).to.not.equal(undefined);

      const el = await fixture(result as TemplateResult);
      expect(el.tagName.toLowerCase()).to.equal('ha-tile-badge');
      const icon = el.querySelector('ha-icon');
      expect(icon).to.exist;
      expect((icon as any).icon).to.equal('mdi:home');
    });

    it('should render badge with export icon when person is not home', async () => {
      const stateObj = s('person.test', 'not_home');
      const result = renderPersonBadge(stateObj, mockHass);
      expect(result).to.not.equal(undefined);

      const el = await fixture(result as TemplateResult);
      expect(el.tagName.toLowerCase()).to.equal('ha-tile-badge');
      const icon = el.querySelector('ha-icon');
      expect(icon).to.exist;
      expect((icon as any).icon).to.equal('mdi:home-export-outline');
    });
  });
});
