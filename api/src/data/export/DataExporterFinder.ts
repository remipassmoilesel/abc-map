import * as _ from 'lodash';
import {AbstractDataExporter} from './AbstractDataExporter';
import {XlsxDataExporter} from './XlsxDataExporter';
import {FileFormat} from './FileFormat';
import {IPostConstruct} from '../../lib/IPostConstruct';

export class DataExporterFinder implements IPostConstruct {

    private instances?: AbstractDataExporter[];

    public async postConstruct(): Promise<any> {
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
    }

}
