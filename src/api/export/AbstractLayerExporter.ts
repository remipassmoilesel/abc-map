import {IServicesMap} from '../handlers/AbstractHandlersGroup';
import {ExportFormat} from './ExportFormat';

export abstract class AbstractLayerExporter {

    protected services: IServicesMap;

    public abstract getSupportedFormats(): ExportFormat[];

    public abstract exportLayer(layerId: string, path: string, exportFormat: ExportFormat);

    public setServiceMap(services: IServicesMap){
        this.services = services;
    }
}
