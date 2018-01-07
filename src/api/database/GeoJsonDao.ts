import * as turf from 'turf';
import {IGeoJsonFeature} from '../entities/geojson/IGeoJsonFeature';
import {Cursor, InsertWriteOpResult} from 'mongodb';
import {IGeoJsonGeometry} from '../entities/geojson/IGeoJsonGeometry';
import {GeoJsonLayer} from '../entities/layers/GeoJsonLayer';
import {AbstractDao} from './AbstractDao';

export class GeoJsonDao extends AbstractDao {

    public insert(collectionId: string, document: IGeoJsonFeature): Promise<InsertWriteOpResult> {
        return super.insertRaw(collectionId, document);
    }

    public insertMany(collectionId: string, dataArray: IGeoJsonFeature[]): Promise<InsertWriteOpResult> {
        return super.insertManyRaw(collectionId, dataArray);
    }

    public createGeoIndex(collectionId: string, field?: any): Promise<string> {
        return this.db.collection(collectionId).createIndex(field || {geometry: '2dsphere'});
    }

    public queryAll(collectionId: string) {
        return this.db.collection(collectionId).find({});
    }

    public queryForArea(collectionId: string, geometry: IGeoJsonGeometry): Cursor<IGeoJsonFeature> {
        return this.db.collection(collectionId).find({
            geometry: {
                $geoWithin: {
                    $geometry: geometry,
                },
            },
        });
    }

    public async queryForAreaAndFilter(collectionId: string,
                                       geometry: IGeoJsonGeometry, minArea: number): Promise<IGeoJsonFeature[]> {

        const result = [];
        const cursor = this.queryForArea(collectionId, geometry);
        while (cursor.hasNext()) {
            const feature = await cursor.next();
            const area = turf.area(feature);
            if (area > minArea) {
                result.push(feature);
            }
        }

        return result;
    }

    public saveLayer(layer: GeoJsonLayer, data: IGeoJsonFeature[]): Promise<InsertWriteOpResult> {
        return this.insertMany(layer.id, data);
    }

}
