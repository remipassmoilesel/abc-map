/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { PasswordStrength, ValidationHelper } from './ValidationHelper';
import sinon, { SinonStub } from 'sinon';

describe('ValidationHelper', () => {
  let isSecureContext: SinonStub;
  beforeEach(() => {
    isSecureContext = sinon.stub();
    sinon.stub(ValidationHelper, 'isSecureContext').callsFake(isSecureContext);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('email()', () => {
    expect(ValidationHelper.email('abcd')).toBe(false);
    expect(ValidationHelper.email('abcd@efgh.ijk')).toBe(true);
  });

  describe('secureUrl()', () => {
    it('in http context', () => {
      isSecureContext.returns(false);

      expect(ValidationHelper.secureUrl('abcd')).toBe(false);
      expect(ValidationHelper.secureUrl('http://abcdefgh.ijk')).toBe(true);
      expect(ValidationHelper.secureUrl('https://abcdefgh.ijk')).toBe(true);
      expect(ValidationHelper.secureUrl('https://abc.def-gh.ijk')).toBe(true);
    });

    it('in https context', () => {
      isSecureContext.returns(true);

      expect(ValidationHelper.secureUrl('abcd')).toBe(false);
      expect(ValidationHelper.secureUrl('http://abcdefgh.ijk')).toBe(false);
      expect(ValidationHelper.secureUrl('https://abcdefgh.ijk')).toBe(true);
      expect(ValidationHelper.secureUrl('https://abc.def-gh.ijk')).toBe(true);
    });
  });

  it('xyzUrl()', () => {
    expect(ValidationHelper.xyzUrl('abcd{x}/{y}/{z}')).toBe(false);
    expect(ValidationHelper.xyzUrl('https://abc.def-gh.ijk/{x}/{y}')).toBe(false);
    expect(ValidationHelper.xyzUrl('https://abc.def-gh.ijk/{x}/{z}')).toBe(false);
    expect(ValidationHelper.xyzUrl('https://abc.def-gh.ijk/{y}/{z}')).toBe(false);
    expect(ValidationHelper.xyzUrl('https://abc.def-gh.ijk/{x}/{y}/{z}')).toBe(true);
  });

  it('check() should return Weak', () => {
    expect(ValidationHelper.password('azerty')).toEqual(PasswordStrength.Weak);
  });

  it('check() should return Correct', () => {
    expect(ValidationHelper.password('HeyBob123')).toEqual(PasswordStrength.Correct);
  });
});
