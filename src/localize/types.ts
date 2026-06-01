/**
 * Dot-joined keys for nested translation JSON (leaf string values only).
 *
 * @example
 * type Keys = TranslationKeysFrom<{ card: { loading: string } }>;
 * // 'card.loading'
 */
export type TranslationKeysFrom<T> =
  T extends Record<string, unknown>
    ? {
        [K in keyof T & string]: T[K] extends string
          ? K
          : T[K] extends Record<string, unknown>
            ? `${K}.${TranslationKeysFrom<T[K]>}`
            : never;
      }[keyof T & string]
    : never;
