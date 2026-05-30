/**
 * https://github.com/home-assistant/frontend/blob/dev/src/common/translations/localize.ts
 */

export type LocalizeFunc = (
  key: string,
  values?: Record<string, string | number | null | undefined>,
) => string;
