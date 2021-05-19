import { PasswordStrength, Strength } from './PasswordStrength';

describe('PasswordStrength', () => {
  it('check() should return Weak', () => {
    expect(PasswordStrength.check('azerty')).toEqual(Strength.Weak);
  });

  it('check() should return Correct', () => {
    expect(PasswordStrength.check('HeyBob123')).toEqual(Strength.Correct);
  });
});
