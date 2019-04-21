import {IPredefinedLayer, MapLayerType, PredefinedLayerPreset} from './IMapLayer';

// TODO: add bing and others

export class PredefinedLayers {

    public static readonly OSM_LAYER: IPredefinedLayer = {
        id: 'change-me',
        name: 'Couche OpenStreetMap',
        type: MapLayerType.Predefined,
        preset: PredefinedLayerPreset.OSM,
    };

    public static ALL = [
        PredefinedLayers.OSM_LAYER,
    ];

}
