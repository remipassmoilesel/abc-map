import { Errors } from './Errors';

describe('Errors', () => {
  it('wrongPassword()', () => {
    expect(() => Errors.wrongPassword()).toThrowError(/ABC_WrongPassword/);
  });

  it('wrongPassword()', async () => {
    expect(Errors.isWrongPassword(new Error())).toBe(false);

    const error: Error = await (async () => Errors.wrongPassword())().catch((err) => err);
    expect(Errors.isWrongPassword(error)).toBe(true);
  });
});
