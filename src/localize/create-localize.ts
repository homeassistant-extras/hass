import type { HomeAssistant } from '../types';

export type TranslationTree = Record<string, unknown>;

/**
 * Create a localize function bound to a card's translation files.
 * It will first check if the string exists in the user's language.
 * If not, it will fall back to the fallback language (default: English).
 */
export function createLocalize<K extends string = string>(
  languages: Record<string, TranslationTree>,
  fallbackLanguage = 'en',
) {
  const fallback = languages[fallbackLanguage];

  return (hass: HomeAssistant, key: K, search = '', replace = ''): string => {
    let translated =
      getNestedTranslation(languages[hass.language], key) ??
      getNestedTranslation(fallback, key) ??
      key;

    if (search !== '' && replace !== '') {
      translated = translated.replace(search, replace);
    }

    return translated;
  };
}

function getNestedTranslation(
  obj: TranslationTree | undefined,
  path: string,
): string | undefined {
  if (!obj) return undefined;

  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result === undefined || result === null || typeof result !== 'object') {
      return undefined;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return typeof result === 'string' ? result : undefined;
}
