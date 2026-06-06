import { expect } from 'chai';
import { createComputeLabel } from '../../src/localize/ha-form';
import type { HomeAssistant } from '../../src/types';

describe('ha-form.ts', () => {
  describe('createComputeLabel', () => {
    const localize = (_hass: HomeAssistant, key: string) => `translated:${key}`;
    const computeLabel = createComputeLabel(localize);
    const hass = {
      localize: (key: string) => `ha:${key}`,
    } as unknown as HomeAssistant;
    const baseSchema = {
      name: 'title',
      selector: { text: {} },
    };

    it('returns empty string when schema has no label', () => {
      expect(computeLabel(baseSchema, hass)).to.equal('');
    });

    it('appends required marker when schema.required is true', () => {
      expect(
        computeLabel(
          { ...baseSchema, label: 'card.title', required: true },
          hass,
        ),
      ).to.equal(
        'translated:card.title (ha:ui.panel.lovelace.editor.card.config.required)',
      );
    });

    it('appends optional marker when schema.required is false', () => {
      expect(
        computeLabel(
          { ...baseSchema, label: 'card.title', required: false },
          hass,
        ),
      ).to.equal(
        'translated:card.title (ha:ui.panel.lovelace.editor.card.config.optional)',
      );
    });
  });
});
