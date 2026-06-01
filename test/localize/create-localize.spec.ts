import { expect } from 'chai';
import { createLocalize } from '../../src/localize/create-localize';
import type { HomeAssistant } from '../../src/types';

const languages = {
  en: {
    card: {
      device_name: 'Device Name',
      expand: 'Expand',
      collapse: 'Collapse',
      loading: 'Loading...',
      no_devices_found: 'No devices found for integration:',
      device_card_name: 'Device Card',
      device_card_description: 'A card to summarize the status of a Device.',
      integration_card_name: 'Integration Card',
      integration_card_description:
        'A card to display all devices from a specific integration.',
    },
    sections: {
      controls: 'Controls',
      configuration: 'Configuration',
      sensors: 'Sensors',
      diagnostic: 'Diagnostic',
    },
  },
  fr: {
    card: {
      device_name: 'Nom de l appareil',
      loading: 'Chargement...',
    },
  },
};

const localize = createLocalize(languages);

const VALID_KEYS = [
  'card.device_name',
  'card.expand',
  'card.collapse',
  'card.loading',
  'card.no_devices_found',
  'card.device_card_name',
  'card.device_card_description',
  'card.integration_card_name',
  'card.integration_card_description',
  'sections.controls',
  'sections.configuration',
  'sections.sensors',
  'sections.diagnostic',
];

const INVALID_KEY = 'this.key.does.not.exist';

describe('create-localize.ts', () => {
  let mockHass: HomeAssistant;

  beforeEach(() => {
    mockHass = {
      language: 'en',
    } as HomeAssistant;
  });

  describe('language selection', () => {
    it('should use the language specified in hass object', () => {
      mockHass.language = 'fr';
      const result = localize(mockHass, 'card.loading', '', '');
      expect(result).to.equal('Chargement...');
    });

    it('should fall back to English when specified language is not supported', () => {
      mockHass.language = 'unsupported-language';

      const result = localize(mockHass, VALID_KEYS[0]!, '', '');
      expect(result).to.be.a('string');
      expect(result).to.not.equal(VALID_KEYS[0]!);
    });

    it('should fall back to English when no language is specified', () => {
      // @ts-ignore
      mockHass.language = undefined;

      const result = localize(mockHass, VALID_KEYS[0]!, '', '');
      expect(result).to.be.a('string');
      expect(result).to.not.equal(VALID_KEYS[0]!);
    });
  });

  describe('key resolution', () => {
    it('should correctly resolve various translation keys', () => {
      for (const key of VALID_KEYS) {
        const result = localize(mockHass, key, '', '');
        expect(result).to.be.a('string');
        expect(result).to.not.equal(key);
      }
    });

    it('should return the key itself when the key does not exist', () => {
      const result = localize(mockHass, INVALID_KEY, '', '');
      expect(result).to.equal(INVALID_KEY);
    });

    it('should handle partial path resolution', () => {
      const partialKey = 'card.stats.non_existent_subkey';
      const result = localize(mockHass, partialKey, '', '');
      expect(result).to.equal(partialKey);
    });
  });

  describe('string replacement', () => {
    it('should replace placeholders in the localized string', () => {
      const key = 'card.no_devices_found';
      const originalText = localize(mockHass, key, '', '');

      const result = localize(mockHass, key, 'integration', 'test integration');

      expect(result).to.not.equal(originalText);
      expect(result).to.include('test integration');
    });

    it('should not modify the string when search parameter is empty', () => {
      const result = localize(mockHass, VALID_KEYS[0]!, '', 'replacement');
      const original = localize(mockHass, VALID_KEYS[0]!, '', '');
      expect(result).to.equal(original);
    });

    it('should not modify the string when replace parameter is empty', () => {
      const result = localize(mockHass, VALID_KEYS[0]!, 'search', '');
      const original = localize(mockHass, VALID_KEYS[0]!, '', '');
      expect(result).to.equal(original);
    });

    it('should not modify the string when the search term is not found', () => {
      const original = localize(mockHass, VALID_KEYS[0]!, '', '');
      const result = localize(
        mockHass,
        VALID_KEYS[0]!,
        'non-existent-term',
        'replacement',
      );
      expect(result).to.equal(original);
    });
  });

  describe('edge cases', () => {
    it('should handle empty keys gracefully', () => {
      const result = localize(mockHass, '', '', '');
      expect(result).to.equal('');
    });
  });
});
