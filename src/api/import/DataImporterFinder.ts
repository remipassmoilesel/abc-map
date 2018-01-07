import * as _ from 'lodash';
import * as path from 'path';
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
        this.buildInstances(services);
    }

    public getInstanceForFile(filePath: string): AbstractDataImporter | undefined {
        const importers = _.filter(this.instances, (inst: AbstractDataImporter) => {
            return _.includes(inst.getSupportedExtensions(), path.extname(filePath));
        });

        return importers.length > 0 ? importers[0] : undefined;
    }

    private buildInstances(services: IServicesMap) {
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
