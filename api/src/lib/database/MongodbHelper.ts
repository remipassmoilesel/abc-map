export class MongodbHelper {

    public static removeMongoId(object: any): void {
        delete object._id;
    }

}
