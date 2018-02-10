import * as uuid from 'uuid';
import {TestData} from '../tests/TestData';
import {GeoJsonLayer} from '../entities/layers/GeoJsonLayer';
import {IServicesMap} from '../services/IServiceMap';
import {AbstractMapLayer} from '../entities/layers/AbstractMapLayer';
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer';
import {Logger} from './Logger';

const logger = Logger.getLogger('ApiDevUtilities');

export class ApiDevUtilities {

    private static NODE_ENV_DEV = 'dev';
    private static NODE_ENV_TEST = 'test';
    private static NODE_ENV_PROD = 'prod';

    public static isDevMode() {
        return process.env.NODE_ENV !== ApiDevUtilities.NODE_ENV_PROD;
    }

    public static setupDevTools() {
        // install VueJS dev tools
        installExtension(VUEJS_DEVTOOLS)
            .then((name) => logger.info(`Added Extension:  ${name}`))
            .catch((err) => logger.error('An error occurred: ', err));
    }

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
