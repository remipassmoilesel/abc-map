import * as _ from 'lodash';
import {IAbcFeatureProperties, IAbcGeojsonFeature} from './AbcGeojson';
import {Feature} from 'geojson';
import uuid = require('uuid');

export class FeatureHelper {

    public static toAbcFeature(feature: Feature<any, any>): IAbcGeojsonFeature {
        const newFeature = _.cloneDeep(feature);

        if (!newFeature.properties) {
            newFeature.properties = {abcmap: {style: {}}};
        }
        if (!newFeature.properties.abcmap) {
            newFeature.properties.abcmap = {style: {}};
        }
        if (newFeature.id) {
            newFeature.id = uuid.v4();
        }

        return newFeature as IAbcGeojsonFeature;
    }

    public static ensureAbcmapPropertiesExists(feature: IAbcGeojsonFeature): void {
        if (!feature.properties) {
            feature.properties = {abcmap: {style: {}}};
        }
        if (!feature.properties.abcmap) {
            feature.properties.abcmap = {style: {}};
        }
    }

    public static setDefaultStyle(feature: IAbcGeojsonFeature) {
        FeatureHelper.ensureAbcmapPropertiesExists(feature);
        feature.properties.abcmap.style = {color: '#000000'};
    }

    public static asAbcmapProperties(data: any): IAbcFeatureProperties {
        return {abcmap: data};
    }

}
