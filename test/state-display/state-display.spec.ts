import { expect } from 'chai';
import {
  DEFAULT_STATE_CONTENT_DOMAINS,
  HIDDEN_ZERO_ATTRIBUTES_DOMAINS,
} from '../../src/state-display/state-display';

describe('state-display.ts', () => {
  it('defines zero-hidden attributes per domain', () => {
    expect(HIDDEN_ZERO_ATTRIBUTES_DOMAINS.light).to.deep.equal(['brightness']);
    expect(HIDDEN_ZERO_ATTRIBUTES_DOMAINS.cover).to.deep.equal([
      'current_position',
    ]);
  });

  it('defines default state content per domain', () => {
    expect(DEFAULT_STATE_CONTENT_DOMAINS.fan).to.equal('percentage');
    expect(DEFAULT_STATE_CONTENT_DOMAINS.climate).to.deep.equal([
      'state',
      'current_temperature',
    ]);
  });
});
