import {IServicesMap} from '../services/IServiceMap';
import {ExportFormat} from './ExportFormat';
import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';

export abstract class AbstractLayerExporter extends AbstractServiceConsumer{

    public abstract getSupportedFormats(): ExportFormat[];

    public abstract exportLayer(layerId: string, path: string, exportFormat: ExportFormat);

}
