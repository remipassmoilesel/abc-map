
import * as _ from 'lodash';

export class EntitiesUtils {

    public static parseFromRaw(prototype: any, data: any) {
        const obj = Object.create(prototype);
        _.assign(obj, data);
        return obj;
    }

    public static parseFromRawArray(prototype: any, dataArray: any) {
        return _.map(dataArray, (data) => {
           return EntitiesUtils.parseFromRaw(prototype, data);
        });
    }

}
