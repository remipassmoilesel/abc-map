import * as CircularJSON from 'circular-json';
import * as _ from 'lodash';

export class Utils {

    public static withDefaultValues(parameters, defaults) {
        return _.assign({}, defaults, parameters);
    }

    public static safeStringify(data: any, indent = 2) {
        return CircularJSON.stringify(data, null, 2);
    }

    public static retryUntilSuccess(toRetry: () => Promise<any>, maxRetries = 5, retryIntervalMs = 100): Promise<any> {

        return new Promise((resolve, reject) => {

            const tryWrapper = (remainingTries) => {

                toRetry()
                    .then(resolve)
                    .catch((error) => {
                        if (remainingTries > 0) {
                            setTimeout(() => {
                                tryWrapper(remainingTries - 1);
                            }, retryIntervalMs);
                        } else {
                            reject(new Error(`No remaining retries: ${JSON.stringify(error)}`))
                        }
                    });

            };

            tryWrapper(maxRetries);

        });
    }
}