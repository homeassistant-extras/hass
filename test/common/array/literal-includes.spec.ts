import { expect } from 'chai';
import { arrayLiteralIncludes } from '../../../src/common/array/literal-includes';

describe('literal-includes.ts', () => {
  describe('arrayLiteralIncludes', () => {
    it('should return true when the element exists in the array', () => {
      const fruits = ['apple', 'banana', 'orange'] as const;
      const includesFruit = arrayLiteralIncludes(fruits);

      expect(includesFruit('banana')).to.be.true;
    });

    it('should return false when the element does not exist in the array', () => {
      const numbers = [1, 2, 3, 4, 5] as const;
      const includesNumber = arrayLiteralIncludes(numbers);

      expect(includesNumber(6)).to.be.false;
    });

    it('should work with mixed type arrays', () => {
      const mixed = [1, 'two', true, null, undefined] as const;
      const includesMixed = arrayLiteralIncludes(mixed);

      expect(includesMixed('two')).to.be.true;
      expect(includesMixed(true)).to.be.true;
      expect(includesMixed(null)).to.be.true;
      expect(includesMixed(undefined)).to.be.true;
      expect(includesMixed(2)).to.be.false;
      expect(includesMixed('one')).to.be.false;
    });

    it('should respect the fromIndex parameter', () => {
      const letters = ['a', 'b', 'c', 'd', 'a'] as const;
      const includesLetter = arrayLiteralIncludes(letters);

      expect(includesLetter('a')).to.be.true;
      expect(includesLetter('a', 0)).to.be.true;
      expect(includesLetter('a', 1)).to.be.true;
      expect(includesLetter('b', 2)).to.be.false;
    });

    it('should work with empty arrays', () => {
      const emptyArray = [] as const;
      const includesInEmpty = arrayLiteralIncludes(emptyArray);

      expect(includesInEmpty('anything')).to.be.false;
    });

    it('should work with object arrays', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };
      const objects = [obj1, obj2] as const;
      const includesObject = arrayLiteralIncludes(objects);

      expect(includesObject(obj1)).to.be.true;
      expect(includesObject(obj2)).to.be.true;
      expect(includesObject(obj3)).to.be.false;
      expect(includesObject({ id: 1 })).to.be.false;
    });

    it('should handle negative fromIndex', () => {
      const values = [10, 20, 30, 40, 50] as const;
      const includesValue = arrayLiteralIncludes(values);

      expect(includesValue(30, -3)).to.be.true;
      expect(includesValue(20, -3)).to.be.false;
      expect(includesValue(50, -1)).to.be.true;
    });

    it('should support type narrowing in conditional blocks', () => {
      const possibleValues = ['low', 'medium', 'high'] as const;
      const includesValue = arrayLiteralIncludes(possibleValues);
      const someValue: unknown = 'medium';

      if (includesValue(someValue)) {
        const validValue: (typeof possibleValues)[number] = someValue;
        expect(validValue).to.equal('medium');
      } else {
        expect.fail('Type guard should have passed');
      }
    });
  });
});
