import * as _ from 'lodash';
import {FeatureHelper} from '../FeatureUtils';
import {IAbcGeojsonFeature} from 'abcmap-shared';

export class XlsxHelper {

    public getPropertiesHeadersFromFeature(feature: IAbcGeojsonFeature): string[] {
        FeatureHelper.ensureAbcmapPropertiesExists(feature);

        const headers: string[] = [];
        _.forEach(Object.keys(feature.properties), (key) => {
            headers.push(key);
        });

        return headers;
    }

    public featureToRow(feature: IAbcGeojsonFeature): string[] {

        let row: string[] = [];

        row.push(feature.id);
        row.push(feature.geometry.type);
        row.push(JSON.stringify(feature.geometry));
        row = row.concat(this.geojsonPropertiesToRow(feature));

        return row;
    }

    private geojsonPropertiesToRow(feature: IAbcGeojsonFeature): string[] {
        FeatureHelper.ensureAbcmapPropertiesExists(feature);

        const properties: string[] = [];
        _.forEach(Object.keys(feature.properties), (key) => {
            properties.push(JSON.stringify(feature.properties[key]));
        });

        return properties;
    }

}
