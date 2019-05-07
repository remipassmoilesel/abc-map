import * as _ from 'lodash';
import {AbstractDataExporter} from './AbstractDataExporter';
import {XlsxDataExporter} from './XlsxDataExporter';
import {IPostConstruct} from '../../lib/IPostConstruct';
import {DataFormatHelper} from '../fileformat/DataFormatHelper';
import {IDataFormat} from '../fileformat/DataFormat';

export class DataExporterFinder implements IPostConstruct {

    private instances?: AbstractDataExporter[];

    public async postConstruct(): Promise<any> {
        this.buildInstances();
    }

    public getInstanceForFormat(format: IDataFormat): AbstractDataExporter | undefined {
        const exporters = _.filter(this.instances, (inst: AbstractDataExporter) => {
            return DataFormatHelper.isSupported(inst.getSupportedFormat(), format);
        });

        return exporters.length > 0 ? exporters[0] : undefined;
    }

    public getInstanceForFormatOrThrow(exportFormat: IDataFormat): AbstractDataExporter {
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
