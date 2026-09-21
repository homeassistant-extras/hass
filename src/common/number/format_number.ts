/**
 * https://github.com/home-assistant/frontend/blob/dev/src/common/number/format_number.ts
 */

import { NumberFormat, type FrontendLocaleData } from '../../data/translation';
import type { HassEntity, HassEntityAttributeBase } from '../../ws/types';

/**
 * Returns true if the entity is considered numeric based on the attributes it has
 * @param stateObj The entity state object
 */
export const isNumericState = (stateObj: HassEntity): boolean =>
  isNumericFromAttributes(stateObj.attributes);

export const isNumericFromAttributes = (
  attributes: HassEntityAttributeBase,
  // Local extension: HA upstream only checks unit_of_measurement / state_class.
  numericDeviceClasses?: string[],
): boolean =>
  !!attributes.unit_of_measurement ||
  !!attributes.state_class ||
  (numericDeviceClasses || []).includes(attributes.device_class ?? '');

export const numberFormatToLocale = (
  localeOptions: FrontendLocaleData,
): string | string[] | undefined => {
  switch (localeOptions.number_format) {
    case NumberFormat.comma_decimal:
      return ['en-US', 'en']; // Use United States with fallback to English formatting 1,234,567.89
    case NumberFormat.decimal_comma:
      return ['de', 'es', 'it']; // Use German with fallback to Spanish then Italian formatting 1.234.567,89
    case NumberFormat.space_comma:
      return ['fr', 'sv', 'cs']; // Use French with fallback to Swedish and Czech formatting 1 234 567,89
    case NumberFormat.quote_decimal:
      return ['de-CH']; // Use German (Switzerland) formatting 1'234'567.89
    case NumberFormat.system:
      return undefined;
    default:
      return localeOptions.language;
  }
};

// Constructing an Intl.NumberFormat is comparatively expensive, and these
// formatters are created on every numeric state render. The number of distinct
// (locale, options) combinations is small and bounded in practice, so cache the
// instances instead of rebuilding them on every call.
const numberFormatCache = new Map<string, Intl.NumberFormat>();

const getNumberFormatter = (
  locale: string | string[] | undefined,
  options: Intl.NumberFormatOptions,
): Intl.NumberFormat => {
  const key = JSON.stringify([locale, options]);
  let formatter = numberFormatCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    numberFormatCache.set(key, formatter);
  }
  return formatter;
};

/**
 * Formats a number based on the user's preference with thousands separator(s) and decimal character for better legibility.
 *
 * @param num The number to format
 * @param localeOptions The user-selected language and formatting, from `hass.locale`
 * @param options Intl.NumberFormatOptions to use
 */
export const formatNumber = (
  num: string | number,
  localeOptions?: FrontendLocaleData,
  options?: Intl.NumberFormatOptions,
): string =>
  formatNumberToParts(num, localeOptions, options)
    .map((part) => part.value)
    .join('');

/**
 * Returns an array of objects containing the formatted number in parts
 * Similar to Intl.NumberFormat.prototype.formatToParts()
 *
 * Input params - same as for formatNumber()
 */
export const formatNumberToParts = (
  num: string | number,
  localeOptions?: FrontendLocaleData,
  options?: Intl.NumberFormatOptions,
): { type: string; value: string | number }[] => {
  const locale = localeOptions
    ? numberFormatToLocale(localeOptions)
    : undefined;

  if (
    localeOptions?.number_format !== NumberFormat.none &&
    !Number.isNaN(Number(num))
  ) {
    return getNumberFormatter(
      locale,
      getDefaultFormatOptions(num, options),
    ).formatToParts(Number(num));
  }

  if (
    !Number.isNaN(Number(num)) &&
    num !== '' &&
    localeOptions?.number_format === NumberFormat.none
  ) {
    // If NumberFormat is none, use en-US format without grouping.
    return getNumberFormatter(
      'en-US',
      getDefaultFormatOptions(num, {
        ...options,
        useGrouping: false,
      }),
    ).formatToParts(Number(num));
  }

  return [{ type: 'literal', value: num }];
};

/**
 * Generates default options for Intl.NumberFormat
 * @param num The number to be formatted
 * @param options The Intl.NumberFormatOptions that should be included in the returned options
 */
export const getDefaultFormatOptions = (
  num: string | number,
  options?: Intl.NumberFormatOptions,
): Intl.NumberFormatOptions => {
  const defaultOptions: Intl.NumberFormatOptions = {
    maximumFractionDigits: 2,
    ...options,
  };

  if (typeof num !== 'string') {
    return defaultOptions;
  }

  // Keep decimal trailing zeros if they are present in a string numeric value
  if (
    !options ||
    (options.minimumFractionDigits === undefined &&
      options.maximumFractionDigits === undefined)
  ) {
    const digits = num.includes('.') ? (num.split('.')[1]?.length ?? 0) : 0;
    defaultOptions.minimumFractionDigits = digits;
    defaultOptions.maximumFractionDigits = digits;
  }

  return defaultOptions;
};
