/**
 * https://github.com/home-assistant/frontend/blob/dev/src/components/ha-form/types.ts
 */

import type { Selector } from '../../data/selector';

export type HaFormSchema =
  | HaFormSelector
  | HaFormGridSchema
  | HaFormExpandableSchema;

export interface HaFormBaseSchema {
  name: string;
  required?: boolean;
  label: string;
}

export interface HaFormGridSchema extends HaFormBaseSchema {
  type: 'grid';
  schema: readonly HaFormSchema[];
}

export interface HaFormExpandableSchema extends HaFormBaseSchema {
  type: 'expandable';
  flatten?: boolean;
  icon?: string;
  schema: readonly HaFormSchema[];
}

export interface HaFormSelector extends HaFormBaseSchema {
  selector: Selector;
}
