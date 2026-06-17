import { expect } from 'chai';
import { nothing } from 'lit';
import { stub } from 'sinon';
import type { CardHelpers } from '../../src/helpers/card-helpers';
import { entityRow } from '../../src/html/entity-row';
import type { HomeAssistant } from '../../src/types';

interface MockRowElement extends HTMLElement {
  hass?: unknown;
}

describe('entityRow', () => {
  let mockHass: HomeAssistant;
  let mockCreateRowElement: sinon.SinonStub;
  let mockElement: MockRowElement;

  beforeEach(() => {
    mockElement = document.createElement('div') as MockRowElement;
    mockCreateRowElement = stub().returns(mockElement);

    const helpers: CardHelpers = {
      createCardElement: stub(),
      createRowElement: mockCreateRowElement,
      createHuiElement: stub(),
    };
    globalThis.poatCardHelpers = helpers;

    mockHass = {} as HomeAssistant;
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'poatCardHelpers');
  });

  it('returns nothing when card helpers are not resolved', () => {
    Reflect.deleteProperty(globalThis, 'poatCardHelpers');

    const result = entityRow(mockHass, { entity: 'light.test' });

    expect(result).to.equal(nothing);
    expect(mockCreateRowElement.called).to.be.false;
  });

  it('creates a row element with hass and config', () => {
    const config = {
      entity: 'light.test_light',
      name: 'Test Light',
      tap_action: { action: 'none' },
    };

    const result = entityRow(mockHass, config, 'status-ok');

    expect(mockCreateRowElement.calledOnceWith(config)).to.be.true;
    expect(mockElement.hass).to.equal(mockHass);
    expect(mockElement.className).to.equal('status-ok');
    expect(result).to.equal(mockElement);
  });
});
