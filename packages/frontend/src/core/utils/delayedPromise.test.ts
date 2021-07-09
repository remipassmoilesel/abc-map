import { delayedPromise } from './delayedPromise';

describe('delayedPromise.ts()', () => {
  it('should resolve now', async () => {
    const result = await delayedPromise(Promise.resolve('value'), 0);

    expect(result).toEqual('value');
  });

  it('should resolve later', async () => {
    const start = Date.now();

    const result = await delayedPromise(Promise.resolve('value 2'), 500);

    const took = Date.now() - start;
    expect(result).toEqual('value 2');
    expect(took).toBeGreaterThan(400); // Margins to prevent flickering test
  });

  it('should reject now', async () => {
    const result: Error = await delayedPromise(Promise.reject(new Error('Test')), 500).catch((err) => err);

    expect(result).toEqual(new Error('Test'));
  });
});
