import { asNumberOrString, isNumeric } from './numbers';

describe('numbers', () => {
  it('isNumeric()', () => {
    expect(isNumeric('1')).toBeTruthy();
    expect(isNumeric('1.1')).toBeTruthy();
    expect(isNumeric('001')).toBeTruthy();
    expect(isNumeric('abcdef')).toBeFalsy();
  });

  it('asNumberOrString()', () => {
    expect(asNumberOrString('1')).toEqual(1);
    expect(asNumberOrString('1,1')).toEqual(1.1);
    expect(asNumberOrString('1.1')).toEqual(1.1);
    expect(asNumberOrString('001')).toEqual(1);
    expect(asNumberOrString('abcdef')).toEqual('abcdef');
    expect(asNumberOrString('abc,def')).toEqual('abc,def');
  });
});
