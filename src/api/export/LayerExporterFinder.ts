import * as _ from 'lodash';
import {AbstractLayerExporter} from './AbstractLayerExporter';
import {IServicesMap} from '../handlers/AbstractHandlersGroup';
import {XlsxLayerExporter} from './XlsxLayerExporter';
import {ExportFormat} from './ExportFormat';

export class LayerExporterFinder {

    private instances: AbstractLayerExporter[];
    private services: IServicesMap;

    public setServiceMap(services: IServicesMap) {
        this.services = services;
        this.buildInstances();
    }

    public getInstanceForFormat(format: ExportFormat): AbstractLayerExporter | undefined {
        const importers = _.filter(this.instances, (inst: AbstractLayerExporter) => {
            return _.includes(inst.getSupportedFormats(), format);
        });

        return importers.length > 0 ? importers[0] : undefined;
    }

    private buildInstances() {
        this.instances = [
            new XlsxLayerExporter(),
        ];
        _.forEach(this.instances, (inst) => {
            inst.setServiceMap(this.services);
        });
    }

}
