import {AbstractDataImporter} from './import/AbstractDataImporter';
import * as _ from 'lodash';
import {DataFormatHelper} from './dataformat/DataFormatHelper';
import {GpxDataImporter} from './import/GpxDataImporter';
import {KmlDataImporter} from './import/KmlDataImporter';
import {ShapefileImporter} from './import/ShapefileImporter';
import {XlsxDataExporter} from './export/XlsxDataExporter';
import {AbstractDataExporter} from './export/AbstractDataExporter';

export class TransformationTools {

    private importers: AbstractDataImporter[] = [
        new GpxDataImporter(),
        new KmlDataImporter(),
        new ShapefileImporter(),
    ];

    private exporters: AbstractDataExporter[] = [
        new XlsxDataExporter(),
    ];

    public getImporterForPath(filePath: string): AbstractDataImporter | undefined {
        return _.find(this.importers, (inst: AbstractDataImporter) => {
            return DataFormatHelper.isFileSupported(inst.getSupportedFormat(), filePath);
        });
    }

    public getExporterForPath(filePath: string): AbstractDataExporter | undefined {
        return _.find(this.exporters, (inst: AbstractDataExporter) => {
            return DataFormatHelper.isFileSupported(inst.getSupportedFormat(), filePath);
        });
    }
}
