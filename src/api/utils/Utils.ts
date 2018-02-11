import * as _ from 'lodash';
const CircularJSON = require('circular-json');

export class Utils {

    public static withDefaultValues(parameters: any, defaults: any) {
        return _.assign({}, defaults, parameters);
    }

    public static safeStringify(data: any, indent = 2) {
        return CircularJSON.stringify(data, null, 2);
    }

    public static retryUntilSuccess(toRetry: () => Promise<any>, maxRetries = 5, retryIntervalMs = 100): Promise<any> {

        return new Promise((resolve, reject) => {

            const onError = (remainingTries: number, error: Error) => {
                if (remainingTries > 0) {
                    setTimeout(() => {
                        tryWrapper(remainingTries - 1);
                    }, retryIntervalMs);
                } else {
                    reject(new Error(`No remaining retries: ${JSON.stringify(error)}`));
                }
            };

            const tryWrapper = (remainingTries: number) => {
                try {
                    toRetry()
                        .then(resolve)
                        .catch(onError.bind(null, remainingTries));
                } catch (e) {
                    onError(remainingTries, e);
                }
            };

            tryWrapper(maxRetries);

        });
    }
}
