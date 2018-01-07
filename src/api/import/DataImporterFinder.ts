import * as _ from 'lodash';
import {GpxDataImporter} from './GpxDataImporter';
import {KmlDataImporter} from './KmlDataImporter';
import {AbstractDataImporter} from './AbstractDataImporter';
import {ShapefileImporter} from './ShapefileImporter';
import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';
import {IServicesMap} from '../services/IServiceMap';

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

    private buildInstances() {
        this.instances = [
            new GpxDataImporter(),
            new KmlDataImporter(),
            new ShapefileImporter(),
        ];
        _.forEach(this.instances, (inst) => {
            inst.setServicesMap(this.services);
        });
    }
}
