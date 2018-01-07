import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';
import {FileFormat} from '../export/FileFormat';

export abstract class AbstractDataImporter extends AbstractServiceConsumer {

    public abstract getSupportedFormat(): FileFormat;

    public abstract fileToCollection(pathToSourceFile: string, collectionName?: string): Promise<string>;

}

