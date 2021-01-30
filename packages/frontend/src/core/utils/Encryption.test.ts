import { Encryption } from './Encryption';

/**
 * Warning: changes on encryption will require a data migration
 */
describe('Encryption', () => {
  it('encrypt()', async () => {
    const result = await Encryption.encrypt('test', 'secret');
    expect(result).not.toEqual('test');
    expect(result).toMatch('encrypted:');
  });

  it('decrypt() with correct secret', async () => {
    const encrypted = await Encryption.encrypt('test', 'secret');
    const result = await Encryption.decrypt(encrypted, 'secret');
    expect(result).toEqual('test');
  });

  it('decrypt() with incorrect secret', async () => {
    expect.assertions(1);
    const encrypted = await Encryption.encrypt('test', 'secret');
    return Encryption.decrypt(encrypted, 'not-the-secret').catch((err) => {
      expect(err.message).toMatch('Invalid password');
    });
  });
});
