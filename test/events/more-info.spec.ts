import { expect } from 'chai';
import { stub } from 'sinon';
import { moreInfo } from '../../src/events/more-info';

describe('more-info.ts', () => {
  let element: HTMLElement;
  let dispatchStub: sinon.SinonStub;

  beforeEach(() => {
    element = document.createElement('div');
    dispatchStub = stub(element, 'dispatchEvent');
  });

  afterEach(() => {
    dispatchStub.restore();
  });

  it('should fire a hass-more-info event with the entity id', () => {
    moreInfo(element, 'light.test');

    expect(dispatchStub.calledOnce).to.be.true;

    const event = dispatchStub.firstCall.args[0] as Event;
    expect(event.type).to.equal('hass-more-info');
    // @ts-ignore - detail added by fireEvent
    expect(event.detail.entityId).to.equal('light.test');
  });

  it('should not fire when entity id is missing', () => {
    moreInfo(element, null);
    moreInfo(element, undefined);
    moreInfo(element, '');

    expect(dispatchStub.called).to.be.false;
  });
});
