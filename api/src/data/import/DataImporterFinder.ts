import * as _ from 'lodash';
import {GpxDataImporter} from './GpxDataImporter';
import {KmlDataImporter} from './KmlDataImporter';
import {AbstractDataImporter} from './AbstractDataImporter';
import {ShapefileImporter} from './ShapefileImporter';
import {XlsxDataImporter} from './XlsxDataImporter';

export class DataImporterFinder {

    private instances?: AbstractDataImporter[];

    constructor() {
        this.buildInstances();
    }

    public getInstanceForFile(filePath: string): AbstractDataImporter | undefined {
        const importers = _.filter(this.instances, (inst: AbstractDataImporter) => {
            return inst.getSupportedFormat().isFileSupported(filePath);
        });

        return importers.length > 0 ? importers[0] : undefined;
    }

    public getInstanceForFileOrThrow(filePath: string): AbstractDataImporter {
        const importer = this.getInstanceForFile(filePath);
        if (!importer) {
            throw new Error('Unknown format: ' + filePath);
        }
        return importer;
    }

    private buildInstances() {
        this.instances = [
            new GpxDataImporter(),
            new KmlDataImporter(),
            new ShapefileImporter(),
            new XlsxDataImporter(),
        ];
    }
}
