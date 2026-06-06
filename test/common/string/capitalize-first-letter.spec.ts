import { expect } from 'chai';
import { capitalizeFirstLetter } from '../../../src/common/string/capitalize-first-letter';

describe('capitalize-first-letter.ts', () => {
  it('capitalizes the first character', () => {
    expect(capitalizeFirstLetter('hello')).to.equal('Hello');
    expect(capitalizeFirstLetter('already Capitalized')).to.equal(
      'Already Capitalized',
    );
  });
});
