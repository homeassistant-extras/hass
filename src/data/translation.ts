/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/translation.ts
 */

export enum NumberFormat {
  language = 'language',
  system = 'system',
  comma_decimal = 'comma_decimal',
  decimal_comma = 'decimal_comma',
  quote_decimal = 'quote_decimal',
  space_comma = 'space_comma',
  none = 'none',
}

export interface FrontendLocaleData {
  language: string;
  number_format: NumberFormat;
}
