import * as _ from 'lodash';
import {AbstractDataExporter} from './AbstractDataExporter';
import {IServicesMap} from '../services/IServiceMap';
import {XlsxDataExporter} from './XlsxDataExporter';
import {ExportFormat} from './ExportFormat';
import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';

export class DataExporterFinder extends AbstractServiceConsumer {

    private instances: AbstractDataExporter[];

    constructor(services: IServicesMap) {
        super();
        this.setServiceMap(services);
    }

    public setServiceMap(services: IServicesMap) {
        this.services = services;
        this.buildInstances();
    }

    public getInstanceForFormat(format: ExportFormat): AbstractDataExporter | undefined {
        const exporters = _.filter(this.instances, (inst: AbstractDataExporter) => {
            return inst.isSupported(format);
        });

        return exporters.length > 0 ? exporters[0] : undefined;
    }

    private buildInstances() {
        this.instances = [
            new XlsxDataExporter(),
        ];
        _.forEach(this.instances, (inst) => {
            inst.setServicesMap(this.services);
        });
    }

}
