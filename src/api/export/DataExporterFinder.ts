import * as _ from 'lodash';
import {AbstractDataExporter} from './AbstractDataExporter';
import {IServicesMap} from '../services/IServiceMap';
import {XlsxDataExporter} from './XlsxDataExporter';
import {FileFormat} from './FileFormat';
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

    public getInstanceForFormat(format: FileFormat): AbstractDataExporter | undefined {
        const exporters = _.filter(this.instances, (inst: AbstractDataExporter) => {
            return inst.getSupportedFormat().isSupported(format);
        });

        return exporters.length > 0 ? exporters[0] : undefined;
    }

    public getInstanceForFormatOrThrow(exportFormat: FileFormat): AbstractDataExporter {
        const exporter = this.getInstanceForFormat(exportFormat);
        if (!exporter) {
            throw new Error('Unknown format: ' + exportFormat);
        }
        return exporter;
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
