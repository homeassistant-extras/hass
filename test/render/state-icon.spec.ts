import { expect } from 'chai';
import { stub } from 'sinon';
import {
  resetPoatCardHelpersForTests,
  setPoatCardHelpers,
} from '../../src/helpers/card-helpers';
import { stateIcon } from '../../src/render/state-icon';
import type { HomeAssistant } from '../../src/types';

describe('state-icon.ts', () => {
  let mockCreateHuiElement: sinon.SinonStub;

  beforeEach(() => {
    mockCreateHuiElement = stub().callsFake(() =>
      document.createElement('div'),
    );
    setPoatCardHelpers({
      createRowElement: stub(),
      createHuiElement: mockCreateHuiElement,
    });
  });

  afterEach(() => {
    resetPoatCardHelpersForTests();
  });

  it('passes icon options through to createHuiElement', () => {
    stateIcon({} as HomeAssistant, 'sensor.temp', {
      state_color: true,
      icon: 'mdi:thermometer',
      tap_action: { action: 'more-info' },
    });

    expect(mockCreateHuiElement.firstCall.args[0]).to.deep.include({
      type: 'state-icon',
      entity: 'sensor.temp',
      state_color: true,
      icon: 'mdi:thermometer',
      tap_action: { action: 'more-info' },
    });
  });

  it('omits unset optional fields', () => {
    stateIcon({} as HomeAssistant, 'sensor.temp');

    expect(mockCreateHuiElement.firstCall.args[0]).to.deep.equal({
      type: 'state-icon',
      entity: 'sensor.temp',
    });
  });
});
