import * as turf from "turf";
import {IGeoJsonFeature} from "../entities/geojson/IGeoJsonFeature";
import {Cursor, Db, InsertWriteOpResult} from "mongodb";
import {IGeoJsonGeometry} from "../entities/geojson/IGeoJsonGeometry";
import {GeoJsonLayer} from "../entities/layers/GeoJsonLayer";

export class GeoJsonDao {

    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    public createGeoIndex(collectionId: string, field?: any): Promise<string> {
        return this.db.collection(collectionId).createIndex(field || {geometry: "2dsphere"});
    }

    public insert(collectionId: string, document: IGeoJsonFeature): Promise<InsertWriteOpResult> {
        return this.insertMany(collectionId, [document]);
    }

    public insertMany(collectionId: string, geoJsonFeatures: IGeoJsonFeature[]): Promise<InsertWriteOpResult> {
        return this.db.collection(collectionId).insertMany(geoJsonFeatures);
    }

    public queryAll(collectionId: string) {
        return this.db.collection(collectionId).find({});
    }

    public queryForArea(collectionId: string, geometry: IGeoJsonGeometry): Cursor<IGeoJsonFeature> {
        return this.db.collection(collectionId).find({
            geometry: {
                $geoWithin: {
                    $geometry: geometry,
                }
            }
        });
    }

    public queryForAreaAndFilter(collectionId: string,
                                 geometry: IGeoJsonGeometry, minArea: number): Promise<IGeoJsonFeature[]> {

        return new Promise(async (resolve, reject) => {

            const result = [];
            const cursor = this.queryForArea(collectionId, geometry);
            while (cursor.hasNext()) {
                await cursor.next().then((feature) => {
                    const area = turf.area(feature);
                    if (area > minArea) {
                        result.push(feature);
                    }
                });
            }

        });

    }

    public saveLayer(layer: GeoJsonLayer, data: IGeoJsonFeature[]): Promise<InsertWriteOpResult> {
        return this.insertMany(layer.id, data);
    }
}