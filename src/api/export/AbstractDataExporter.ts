import * as _ from 'lodash';
import {ExportFormat} from './ExportFormat';
import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';

export abstract class AbstractDataExporter extends AbstractServiceConsumer {

    public abstract getSupportedFormats(): ExportFormat[];

    public abstract exportCollection(collectionId: string, path: string, exportFormat: ExportFormat);

    public isSupported(format: ExportFormat): boolean {
        const supportedFormats = _.filter(this.getSupportedFormats(), (form: ExportFormat) => {
            return form.isSupported(format);
        });
        return supportedFormats.length > 0;
    }
}
