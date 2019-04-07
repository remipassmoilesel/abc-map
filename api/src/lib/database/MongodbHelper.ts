import * as _ from 'lodash';

export class MongodbHelper {

    public static withoutMongoId<T>(object: T): T {
        const copy: any = _.cloneDeep(object);
        delete copy._id;
        return copy;
    }

}
