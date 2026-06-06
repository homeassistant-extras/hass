import type { HaFormSchema } from '../components/ha-form/types';
import type { HomeAssistant } from '../types';
import type { TranslationKeysFrom } from './types';

/** `HaFormSchema` whose `label` fields are keys from a translation JSON tree. */
export type HaFormSchemaFor<T extends Record<string, unknown>> = HaFormSchema<
  TranslationKeysFrom<T>
>;

export type LocalizeFn<K extends string> = (
  hass: HomeAssistant,
  key: K,
  search?: string,
  replace?: string,
) => string;

/**
 * Builds a ha-form `computeLabel` callback with typed translation keys on `schema.label`.
 */
export function createComputeLabel<K extends string>(localize: LocalizeFn<K>) {
  return (schema: HaFormSchema<K>, hass: HomeAssistant): string => {
    if (!schema.label) {
      return '';
    }

    return `${localize(hass, schema.label)} ${
      schema.required
        ? `(${hass.localize('ui.panel.lovelace.editor.card.config.required')})`
        : `(${hass.localize('ui.panel.lovelace.editor.card.config.optional')})`
    }`;
  };
}
