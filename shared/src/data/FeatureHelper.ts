import * as _ from 'lodash';
import {Feature} from 'geojson';
import {DEFAULT_STYLE, IAbcGeojsonFeature} from './AbcGeoJSON';


export class FeatureHelper {

    public static toAbcFeature(feature: Feature<any, any>): IAbcGeojsonFeature {
        const newFeature = _.cloneDeep(feature);
        this.ensureAbcmapPropertiesExists(newFeature);
        return newFeature as IAbcGeojsonFeature;
    }

    public static ensureAbcmapPropertiesExists(feature: any): void {
        if (!feature.properties) {
            feature.properties = {abcmap: {style: DEFAULT_STYLE}};
        }
        if (!feature.properties.abcmap) {
            feature.properties.abcmap = {style: DEFAULT_STYLE};
        }
    }

}
