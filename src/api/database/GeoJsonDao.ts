import {GeoJsonFeature} from "../entities/geojson/GeoJsonFeature";
import {Db, InsertWriteOpResult} from "mongodb";

export class GeoJsonDao {

    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    public write(collectionId: string, document: GeoJsonFeature): Promise<InsertWriteOpResult> {
        return this.writeMany(collectionId, [document]);
    }

    private writeMany(collectionId: string, geoJsonFeatures: [GeoJsonFeature]): Promise<InsertWriteOpResult> {
        return this.db.collection(collectionId).insertMany(geoJsonFeatures);
    }
}