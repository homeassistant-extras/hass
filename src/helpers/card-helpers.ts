import type { LovelaceCardConfig } from '../data/lovelace/config/card';
import type {
  LovelaceElement,
  LovelaceElementConfig,
} from '../panels/lovelace/elements/types';
import type {
  LovelaceRow,
  LovelaceRowConfig,
} from '../panels/lovelace/entity-rows/types';
import type { LovelaceCard } from '../panels/lovelace/types';

declare global {
  var loadCardHelpers: (() => Promise<CardHelpers>) | undefined;
  var poatCardHelpers: CardHelpers | undefined;
}

export interface CardHelpers {
  createCardElement: (config: LovelaceCardConfig) => LovelaceCard;
  createRowElement: (config: LovelaceRowConfig) => LovelaceRow;
  createHuiElement: (config: LovelaceElementConfig) => LovelaceElement;
}

let _helpersPromise: Promise<CardHelpers> | undefined;

/** Clears singleton state (unit tests only). */
export function resetPoatCardHelpersForTests(): void {
  _helpersPromise = undefined;
  Reflect.deleteProperty(globalThis, 'poatCardHelpers');
}

export function setPoatCardHelpers(helpers: CardHelpers): void {
  globalThis.poatCardHelpers = helpers;
}

export function getPoatCardHelpers(): CardHelpers | undefined {
  return globalThis.poatCardHelpers;
}

export function resolvePoatCardHelpers(
  loader: (() => Promise<CardHelpers>) | undefined,
): Promise<CardHelpers> {
  const existing = getPoatCardHelpers();
  if (existing) {
    return Promise.resolve(existing);
  }

  if (_helpersPromise !== undefined) {
    return _helpersPromise;
  }

  if (!loader) {
    return Promise.reject(
      new Error('[custom-card] helpers: missing globalThis.loadCardHelpers'),
    );
  }

  _helpersPromise = loader().then((helpers) => {
    setPoatCardHelpers(helpers);
    return helpers;
  });

  return _helpersPromise;
}
