/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/lovelace_custom_cards.ts
 */

import type { HomeAssistant } from '../types';
import type { LovelaceCardConfig } from './lovelace/config/card';

export interface CustomCardSuggestion<
  T extends LovelaceCardConfig = LovelaceCardConfig,
> {
  label?: string;
  config: T;
}

export interface CustomCardEntry {
  type: string;
  name?: string;
  description?: string;
  preview?: boolean;
  documentationURL?: string;
  getEntitySuggestion?: (
    hass: HomeAssistant,
    entityId: string,
  ) => CustomCardSuggestion | CustomCardSuggestion[] | null;
}

export interface CustomCardsWindow {
  customCards?: CustomCardEntry[];
}

const customCardsWindow = globalThis as CustomCardsWindow;

if (!('customCards' in customCardsWindow)) {
  customCardsWindow.customCards = [];
}

export const customCards = customCardsWindow.customCards;
