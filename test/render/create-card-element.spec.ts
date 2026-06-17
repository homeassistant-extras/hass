import { expect } from 'chai';
import { nothing } from 'lit';
import { stub } from 'sinon';
import {
  resetPoatCardHelpersForTests,
  setPoatCardHelpers,
  type CardHelpers,
} from '../../src/helpers/card-helpers';
import { createCardElement } from '../../src/render/create-card-element';
import type { HomeAssistant } from '../../src/types';

describe('create-card-element.ts', () => {
  afterEach(() => {
    resetPoatCardHelpersForTests();
  });

  it('returns nothing when card helpers are unavailable', () => {
    const result = createCardElement({} as HomeAssistant, {
      type: 'entities',
    });

    expect(result).to.equal(nothing);
  });

  it('creates element and assigns hass', () => {
    interface MockCardElement extends HTMLElement {
      hass?: HomeAssistant;
    }

    const mockCreate = stub().callsFake(() => document.createElement('div'));
    setPoatCardHelpers({
      createCardElement: mockCreate,
      createRowElement: stub(),
      createHuiElement: stub(),
    } as CardHelpers);

    const hass = {} as HomeAssistant;
    const config = { type: 'entities' };

    const element = createCardElement(hass, config) as MockCardElement;

    expect(mockCreate.calledOnceWith(config)).to.be.true;
    expect(element.hass).to.equal(hass);
  });
});
