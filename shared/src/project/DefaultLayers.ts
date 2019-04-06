import {IPredefinedLayer, MapLayerType, PredefinedLayerPreset} from './IMapLayer';

export class DefaultLayers {

    public static readonly OSM_LAYER: IPredefinedLayer = {
        id: 'change-me',
        name: 'Couche OpenStreetMap',
        type: MapLayerType.Predefined,
        preset: PredefinedLayerPreset.OSM,
    };

}
