/**
 * https://github.com/home-assistant/frontend/blob/dev/src/components/ha-form/types.ts
 */

import type { Selector } from '../../data/selector';

/**
 * @typeParam L - Translation key for `label` (use your card's `TranslationKeysFrom<typeof en>`).
 * Defaults to `string` so schemas can use HA core keys like `ui.panel...`.
 */
export type HaFormSchema<L extends string = string> =
  | HaFormSelector<L>
  | HaFormGridSchema<L>
  | HaFormExpandableSchema<L>;

export interface HaFormBaseSchema<L extends string = string> {
  name: string;
  required?: boolean;
  /** Translation key passed to the card's `localize()` function. */
  label?: L;
  context?: Record<string, string>;
}

export interface HaFormGridSchema<
  L extends string = string,
> extends HaFormBaseSchema<L> {
  type: 'grid';
  flatten?: boolean;
  column_min_width?: string;
  schema: readonly HaFormSchema<L>[];
}

export interface HaFormExpandableSchema<
  L extends string = string,
> extends HaFormBaseSchema<L> {
  type: 'expandable';
  flatten?: boolean;
  icon?: string;
  schema: readonly HaFormSchema<L>[];
}

export interface HaFormSelector<
  L extends string = string,
> extends HaFormBaseSchema<L> {
  selector: Selector;
}
