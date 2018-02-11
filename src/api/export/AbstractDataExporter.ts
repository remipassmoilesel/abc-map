import {FileFormat} from './FileFormat';
import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';

export abstract class AbstractDataExporter extends AbstractServiceConsumer {

    public abstract getSupportedFormat(): FileFormat;

    public abstract exportCollection(collectionId: string, path: string, exportFormat: FileFormat): void;

}
