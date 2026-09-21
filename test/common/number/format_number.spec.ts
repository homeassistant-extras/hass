import { expect } from 'chai';
import {
  formatNumber,
  formatNumberToParts,
  getDefaultFormatOptions,
  isNumericFromAttributes,
  isNumericState,
  numberFormatToLocale,
} from '../../../src/common/number/format_number';
import {
  NumberFormat,
  type FrontendLocaleData,
} from '../../../src/data/translation';
import { createState as s } from '../../test-helpers';

const locale = (
  number_format: NumberFormat,
  language = 'en',
): FrontendLocaleData => ({
  language,
  number_format,
});

describe('format_number.ts', () => {
  describe('isNumericState', () => {
    it('should return true for entity with unit_of_measurement', () => {
      const stateObj = s('sensor.temperature', '72', {
        unit_of_measurement: '°F',
      });

      expect(isNumericState(stateObj)).to.be.true;
    });

    it('should return true for entity with state_class', () => {
      const stateObj = s('sensor.energy', '100', {
        state_class: 'total_increasing',
      });

      expect(isNumericState(stateObj)).to.be.true;
    });

    it('should return false for entity without numeric attributes', () => {
      const stateObj = s('light.living_room', 'on', {
        friendly_name: 'Living Room Light',
      });

      expect(isNumericState(stateObj)).to.be.false;
    });

    it('should return false for entity with empty attributes', () => {
      const stateObj = s('switch.test', 'off', {});

      expect(isNumericState(stateObj)).to.be.false;
    });
  });

  describe('isNumericFromAttributes', () => {
    it('should return true when unit_of_measurement is present', () => {
      const attributes = {
        unit_of_measurement: 'kWh',
        friendly_name: 'Energy Sensor',
      };

      expect(isNumericFromAttributes(attributes)).to.be.true;
    });

    it('should return true when state_class is present', () => {
      const attributes = {
        state_class: 'measurement',
        friendly_name: 'Power Sensor',
      };

      expect(isNumericFromAttributes(attributes)).to.be.true;
    });

    it('should return true when device_class matches numericDeviceClasses', () => {
      const attributes = {
        device_class: 'temperature',
        friendly_name: 'Temperature Sensor',
      };
      const numericDeviceClasses = ['temperature', 'humidity', 'pressure'];

      expect(isNumericFromAttributes(attributes, numericDeviceClasses)).to.be
        .true;
    });

    it('should return false when device_class does not match numericDeviceClasses', () => {
      const attributes = {
        device_class: 'motion',
        friendly_name: 'Motion Sensor',
      };
      const numericDeviceClasses = ['temperature', 'humidity'];

      expect(isNumericFromAttributes(attributes, numericDeviceClasses)).to.be
        .false;
    });

    it('should return false when no numeric attributes are present', () => {
      const attributes = {
        friendly_name: 'Binary Sensor',
        icon: 'mdi:motion-sensor',
      };

      expect(isNumericFromAttributes(attributes)).to.be.false;
    });

    it('should return false when device_class is undefined', () => {
      const attributes = {
        friendly_name: 'Test Sensor',
      };
      const numericDeviceClasses = ['temperature', 'humidity'];

      expect(isNumericFromAttributes(attributes, numericDeviceClasses)).to.be
        .false;
    });

    it('should handle multiple numeric indicators', () => {
      const attributes = {
        unit_of_measurement: '°C',
        state_class: 'measurement',
        device_class: 'temperature',
      };
      const numericDeviceClasses = ['temperature'];

      expect(isNumericFromAttributes(attributes, numericDeviceClasses)).to.be
        .true;
    });

    it('should handle empty numericDeviceClasses array', () => {
      const attributes = {
        device_class: 'temperature',
      };
      const numericDeviceClasses: string[] = [];

      expect(isNumericFromAttributes(attributes, numericDeviceClasses)).to.be
        .false;
    });

    it('should handle undefined numericDeviceClasses', () => {
      const attributes = {
        device_class: 'temperature',
      };

      expect(isNumericFromAttributes(attributes)).to.be.false;
    });
  });

  describe('numberFormatToLocale', () => {
    it('should map comma_decimal to en-US', () => {
      expect(
        numberFormatToLocale(locale(NumberFormat.comma_decimal)),
      ).to.deep.equal(['en-US', 'en']);
    });

    it('should map decimal_comma to de/es/it', () => {
      expect(
        numberFormatToLocale(locale(NumberFormat.decimal_comma)),
      ).to.deep.equal(['de', 'es', 'it']);
    });

    it('should map space_comma to fr/sv/cs', () => {
      expect(
        numberFormatToLocale(locale(NumberFormat.space_comma)),
      ).to.deep.equal(['fr', 'sv', 'cs']);
    });

    it('should map quote_decimal to de-CH', () => {
      expect(
        numberFormatToLocale(locale(NumberFormat.quote_decimal)),
      ).to.deep.equal(['de-CH']);
    });

    it('should return undefined for system', () => {
      expect(numberFormatToLocale(locale(NumberFormat.system))).to.be.undefined;
    });

    it('should return language for language format', () => {
      expect(
        numberFormatToLocale(locale(NumberFormat.language, 'fr')),
      ).to.equal('fr');
    });
  });

  describe('getDefaultFormatOptions', () => {
    it('should default maximumFractionDigits to 2 for numbers', () => {
      expect(getDefaultFormatOptions(12.345)).to.deep.equal({
        maximumFractionDigits: 2,
      });
    });

    it('should merge provided options for numbers', () => {
      expect(
        getDefaultFormatOptions(12.345, { maximumFractionDigits: 1 }),
      ).to.deep.equal({
        maximumFractionDigits: 1,
      });
    });

    it('should preserve trailing decimal digits from string values', () => {
      expect(getDefaultFormatOptions('12.50')).to.deep.equal({
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    });

    it('should not override explicit fraction digit options for strings', () => {
      expect(
        getDefaultFormatOptions('12.50', { maximumFractionDigits: 1 }),
      ).to.deep.equal({
        maximumFractionDigits: 1,
      });
    });
  });

  describe('formatNumber', () => {
    it('should format with comma_decimal locale', () => {
      expect(
        formatNumber('1234.5', locale(NumberFormat.comma_decimal), {
          maximumFractionDigits: 1,
        }),
      ).to.equal('1,234.5');
    });

    it('should format with decimal_comma locale', () => {
      expect(
        formatNumber('1234.5', locale(NumberFormat.decimal_comma), {
          maximumFractionDigits: 1,
        }),
      ).to.equal('1.234,5');
    });

    it('should format without grouping when number_format is none', () => {
      expect(
        formatNumber('1234.5', locale(NumberFormat.none), {
          maximumFractionDigits: 1,
        }),
      ).to.equal('1234.5');
    });

    it('should return the literal string when value is not numeric', () => {
      expect(formatNumber('n/a', locale(NumberFormat.comma_decimal))).to.equal(
        'n/a',
      );
    });

    it('should format numeric values without locale options', () => {
      expect(formatNumber(42)).to.match(/^42/);
    });
  });

  describe('formatNumberToParts', () => {
    it('should return Intl parts for a numeric value', () => {
      const parts = formatNumberToParts(
        '1234.5',
        locale(NumberFormat.comma_decimal),
        { maximumFractionDigits: 1 },
      );

      expect(parts.map((part) => part.value).join('')).to.equal('1,234.5');
      expect(parts.some((part) => part.type === 'group')).to.be.true;
      expect(parts.some((part) => part.type === 'integer')).to.be.true;
    });

    it('should return a literal part for non-numeric values', () => {
      expect(
        formatNumberToParts('n/a', locale(NumberFormat.comma_decimal)),
      ).to.deep.equal([{ type: 'literal', value: 'n/a' }]);
    });
  });
});
