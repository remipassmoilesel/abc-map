import * as _ from 'lodash';
import {IGeoJsonFeature} from '../entities/geojson/IGeoJsonFeature';
import {FeatureUtils} from '../entities/geojson/FeatureUtils';
import {IGeoJsonGeometry} from '../entities/geojson/IGeoJsonGeometry';

export class XlsxHelper {

    public getPropertiesHeadersFromFeature(feature: IGeoJsonFeature): string[] {
        FeatureUtils.ensureAbcmapPropertiesExists(feature.properties);

        const headers: string[] = [];
        _.forEach(Object.keys(feature.properties), (key) => {
            headers.push(key);
        });

        return headers;
    }

    public featureToRow(feature: IGeoJsonFeature): string[] {

        let row: string[] = [];

        row.push(feature._id);
        row.push(feature.geometry.type);
        row.push(JSON.stringify(feature.geometry));
        row = row.concat(this.geojsonPropertiesToRow(feature));

        return row;
    }

    private geojsonPropertiesToRow(feature: IGeoJsonFeature): string[] {
        FeatureUtils.ensureAbcmapPropertiesExists(feature);

        const properties: string[] = [];
        _.forEach(Object.keys(feature.properties), (key) => {
            properties.push(JSON.stringify(feature.properties[key]));
        });

        return properties;
    }

    public rowToFeature(data: string[]): IGeoJsonFeature | null {

        if (!data || data.length < 4){
            return null;
        }

        const id = data[1];
        const geometryType = data[2];
        const geometry: IGeoJsonGeometry = JSON.parse(data[3]);
        const properties = this.rowToGeojsonProperties(data.slice(3));

        return {
            _id: id,
            geometry,
            properties,
            type: 'Feature',
        };
    }

    private rowToGeojsonProperties(data: string[]): any {
        return FeatureUtils.asAbcmapProperties(data);
    }
}
