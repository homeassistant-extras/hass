import { expect } from 'chai';
import { nothing } from 'lit';
import { stub } from 'sinon';
import {
  resetPoatCardHelpersForTests,
  setPoatCardHelpers,
  type CardHelpers,
} from '../../src/helpers/card-helpers';
import { createHuiElement } from '../../src/render/create-hui-element';
import type { HomeAssistant } from '../../src/types';

describe('create-hui-element.ts', () => {
  afterEach(() => {
    resetPoatCardHelpersForTests();
  });

  it('returns nothing when card helpers are unavailable', () => {
    const result = createHuiElement({} as HomeAssistant, {
      type: 'state-icon',
      entity: 'light.foo',
    });

    expect(result).to.equal(nothing);
  });

  it('creates element and assigns hass', () => {
    interface MockHuiElement extends HTMLElement {
      hass?: HomeAssistant;
    }

    const mockCreate = stub().callsFake(() => document.createElement('div'));
    setPoatCardHelpers({
      createRowElement: stub(),
      createHuiElement: mockCreate,
    } as CardHelpers);

    const hass = {} as HomeAssistant;
    const config = { type: 'state-icon' as const, entity: 'light.foo' };

    const element = createHuiElement(hass, config) as MockHuiElement;

    expect(mockCreate.calledOnceWith(config)).to.be.true;
    expect(element.hass).to.equal(hass);
  });
});
