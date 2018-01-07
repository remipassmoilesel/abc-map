import * as uuid from 'uuid';
import {TestData} from '../tests/TestData';
import {GeoJsonLayer} from '../entities/layers/GeoJsonLayer';
import {IServicesMap} from '../services/IServiceMap';
import {AbstractMapLayer} from '../entities/layers/AbstractMapLayer';

export class DevUtilities {

    public static async setupDevProject(services: IServicesMap) {
        await services.map.importFilesAsLayers([
            TestData.KML_GRENOBLE_SHAPES,
            TestData.KML_GRENOBLE_SHAPES_FILTER1,
        ]);
    }

    public static async createGeojsonTestLayer(services: IServicesMap): Promise<GeoJsonLayer> {
        const layers: AbstractMapLayer[] = await services.map.importFilesAsLayers(
            [TestData.KML_GRENOBLE_SHAPES],
            [`test-layer-${uuid.v4()}`],
        );

        return layers[0];
    }

}
