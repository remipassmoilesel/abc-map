import * as _ from 'lodash';
import * as path from 'path';
import {GpxDataImporter} from './GpxDataImporter';
import {KmlDataImporter} from './KmlDataImporter';
import {AbstractDataImporter} from './AbstractDataImporter';
import {ShapefileImporter} from './ShapefileImporter';

export class DataImporterFinder {

    private instances: AbstractDataImporter[];

    constructor() {
        this.instances = [
            new GpxDataImporter(),
            new KmlDataImporter(),
            new ShapefileImporter(),
        ];
    }

    public getInstanceForFile(filePath: string): AbstractDataImporter | undefined {
        const importers = _.filter(this.instances, (inst: AbstractDataImporter) => {
            return _.includes(inst.getSupportedExtensions(), path.extname(filePath));
        });

        return importers.length > 0 ? importers[0] : undefined;
    }

}
