/**
 * This promise will execute an underlying promise, but will never resolve before the specified delay.
 *
 * This is useful to display a waiting screen that will be at list shown for delay seconds.
 */
export function delayedPromise<T>(promise: Promise<T>, delay = 1000): Promise<T> {
  const start = Date.now();
  return new Promise<T>((resolve, reject) => {
    promise
      .then((result) => {
        const took = Date.now() - start;
        if (took >= delay) {
          resolve(result);
        } else {
          const delta = delay - took;
          setTimeout(() => {
            resolve(result);
          }, delta);
        }
      })
      .catch(reject);
  });
}
