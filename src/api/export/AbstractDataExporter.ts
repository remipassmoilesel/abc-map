import {ExportFormat} from './ExportFormat';
import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';

export abstract class AbstractDataExporter extends AbstractServiceConsumer {

    public abstract getSupportedFormats(): ExportFormat[];

    public abstract exportCollection(collectionId: string, path: string, exportFormat: ExportFormat);

}
