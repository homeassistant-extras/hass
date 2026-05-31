/**
 * Minimal config shape for cards that use a `features` string array.
 */
export type ConfigWithFeatures<TFeature extends string = string> = {
  features?: readonly TFeature[];
};

/**
 * Determines if a specified feature is enabled in the provided configuration.
 *
 * @param config - The configuration object containing feature flags
 * @param feature - The specific feature to check for
 * @returns True if the feature is enabled, false otherwise
 */
export const hasFeature = <TFeature extends string>(
  config: ConfigWithFeatures<TFeature> | null | undefined,
  feature: TFeature,
): boolean => !config || config.features?.includes(feature) || false;
