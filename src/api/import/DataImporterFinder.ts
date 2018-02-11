import * as _ from 'lodash';
import {GpxDataImporter} from './GpxDataImporter';
import {KmlDataImporter} from './KmlDataImporter';
import {AbstractDataImporter} from './AbstractDataImporter';
import {ShapefileImporter} from './ShapefileImporter';
import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';
import {IServicesMap} from '../services/IServiceMap';
import {XlsxDataImporter} from './XlsxDataImporter';

// TODO: use file format instead of file path
export class DataImporterFinder extends AbstractServiceConsumer {

    private instances: AbstractDataImporter[];

    constructor(services: IServicesMap) {
        super();
        this.setServicesMap(services);
    }

    public setServicesMap(services: IServicesMap): void {
        super.setServicesMap(services);
        this.buildInstances();
    }

    public getInstanceForFile(filePath: string): AbstractDataImporter | undefined {
        const importers = _.filter(this.instances, (inst: AbstractDataImporter) => {
            return inst.getSupportedFormat().isFileSupported(filePath);
        });

        return importers.length > 0 ? importers[0] : undefined;
    }

    public getInstanceForFileOrThrow(filePath: string): AbstractDataImporter {
        const importer = this.getInstanceForFile(filePath);
        if (!importer) {
            throw new Error('Unknown format: ' + filePath);
        }
        return importer;
    }

    private buildInstances() {
        this.instances = [
            new GpxDataImporter(),
            new KmlDataImporter(),
            new ShapefileImporter(),
            new XlsxDataImporter(),
        ];
        _.forEach(this.instances, (inst) => {
            inst.setServicesMap(this.services);
        });
    }
}
