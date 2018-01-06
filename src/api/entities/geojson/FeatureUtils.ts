import {IGeoJsonFeature} from './IGeoJsonFeature';

export class FeatureUtils {

    public static ensureAbcmapPropertiesExists(feature: IGeoJsonFeature) {
        if (!feature.properties) {
            feature.properties = {};
        }
        if (!feature.properties.abcmap) {
            feature.properties.abcmap = {};
        }
    }

    public static setDefaultStyle(feature: IGeoJsonFeature) {
        FeatureUtils.ensureAbcmapPropertiesExists(feature);
        feature.properties.abcmap.style = {color: '#000000'};
    }

}
