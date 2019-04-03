import {AbcLocalStorageHelper} from '@/lib/utils/AbcLocalStorageHelper';
import {AbcStoreWrapper} from '@/lib/store/AbcStoreWrapper';
import {IAbcApiClientMap} from '@/lib/IAbcApiClientMap';
import {IProject} from "abcmap-shared/dist";
import {IPredefinedLayer, IRasterLayer, MapLayerType, PredefinedLayerPreset} from "abcmap-shared/dist";
import * as ol from 'openlayers';
import * as _ from 'lodash';
import * as loglevel from 'loglevel';

export class MapService {

    private logger = loglevel.getLogger('MapService');

    constructor(private clients: IAbcApiClientMap,
                private storew: AbcStoreWrapper,
                private abcLocalst: AbcLocalStorageHelper) {
    }

    public generateLayersFromProject(project: IProject): ol.layer.Base[] {
        return _.map(project.layers, abcLayer => {
            switch (abcLayer.type) {
                case MapLayerType.Predefined:
                    return this.toPredefinedLayer(abcLayer as IPredefinedLayer);
                case MapLayerType.Raster:
                    return this.toRasterLayer(abcLayer as IRasterLayer);
                default:
                    throw new Error("Unknown: " + abcLayer);
            }
        })
    }

    private toRasterLayer(abcLayer: IRasterLayer): ol.layer.Base {
        return new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: abcLayer.url,
                params: {}
            })
        });
    }

    private toPredefinedLayer(abcLayer: IPredefinedLayer): ol.layer.Base {
        switch (abcLayer.preset) {
            case PredefinedLayerPreset.OSM:
                return new ol.layer.Tile({
                    source: new ol.source.OSM()
                });
            default:
                throw new Error("Unknown: " + abcLayer);
        }
    }
}
