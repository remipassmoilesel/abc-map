import * as _ from 'lodash';
import {Feature} from 'geojson';
import {DEFAULT_STYLE, IAbcFeatureProperties, IAbcGeojsonFeature} from 'abcmap-shared';
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
            feature.properties = {abcmap: {style: DEFAULT_STYLE}};
        }
        if (!feature.properties.abcmap) {
            feature.properties.abcmap = {style: DEFAULT_STYLE};
        }
    }

    public static asAbcmapProperties(data: any): IAbcFeatureProperties {
        return {abcmap: data};
    }

}
