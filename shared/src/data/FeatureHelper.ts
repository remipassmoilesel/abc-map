import * as _ from 'lodash';
import {Feature} from 'geojson';
import {DEFAULT_STYLE, IAbcGeojsonFeature} from './AbcGeoJSON';


export class FeatureHelper {

    public static readonly ABCMAP_PROP = 'abcmap';

    public static toAbcFeature(feature: Feature<any, any>): IAbcGeojsonFeature {
        const newFeature = _.cloneDeep(feature);
        this.ensureAbcmapPropertiesExists(newFeature);
        return newFeature as IAbcGeojsonFeature;
    }

    public static ensureAbcmapPropertiesExists(feature: any): void {
        if (!feature.properties) {
            feature.properties = {};
        }
        if (!feature.properties[this.ABCMAP_PROP]) {
            feature.properties[this.ABCMAP_PROP] = {style: DEFAULT_STYLE};
        }
    }

}
