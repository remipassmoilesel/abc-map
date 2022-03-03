import { PasswordCache } from './PasswordCache';
import { TestHelper } from '../utils/test/TestHelper';

describe('PasswordCache', function () {
  let cache: PasswordCache;
  beforeEach(() => {
    cache = new PasswordCache(10);
  });

  it('set() then get()', function () {
    cache.set('azerty1234');
    expect(cache.get()).toEqual('azerty1234');
  });

  it('when set(), value should be reset after XXms', async () => {
    // Act
    cache.set('azerty1234');
    await TestHelper.wait(20);

    // Assert
    expect(cache.get()).toEqual(undefined);
  });
});
