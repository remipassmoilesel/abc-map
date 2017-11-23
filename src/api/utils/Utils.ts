import * as CircularJSON from 'circular-json';
import * as _ from 'lodash';

export class Utils {

    public static withDefaultValues(parameters, defaults) {
        return _.assign({}, defaults, parameters);
    }

    public static safeStringify(data: any) {
        return CircularJSON.stringify(data);
    }
}