import { PasswordHasher } from './PasswordHasher';
import { assert } from 'chai';
import { Config } from '../config/Config';

describe('PasswordHasher', () => {
  it('hashPassword() should work', async () => {
    const config: Config = {
      authentication: {
        passwordSalt: 'ABCDFEG',
      },
    } as any;

    const hasher = new PasswordHasher(config);

    const hash = await hasher.hashPassword('azerty1234', 'user-test-id');
    assert.isAtLeast(hash.length, 50);
    assert.isTrue(await hasher.verifyPassword('azerty1234', 'user-test-id', hash));
  });
});
