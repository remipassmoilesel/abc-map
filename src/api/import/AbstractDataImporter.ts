import * as _ from "lodash";
import * as path from "path";
import {AbstractMapLayer} from "../entities/layers/AbstractMapLayer";
import {GpxDataImporter} from "./GpxDataImporter";
import {KmlDataImporter} from "./KmlDataImporter";

export abstract class AbstractDataImporter {
    public abstract getSupportedExtensions(): string[];

    public abstract getAsLayer(pathToSourceFile: string): Promise<AbstractMapLayer>;
}

export class DataImporterFinder {

    private instances: [GpxDataImporter, KmlDataImporter];

    constructor() {
        this.instances = [
            new GpxDataImporter(),
            new KmlDataImporter(),
        ]
    }

    public getInstanceForFile(file: File): AbstractDataImporter | undefined {
        const importers = _.filter(this.instances, (inst: AbstractDataImporter) => {
            return _.includes(inst.getSupportedExtensions(), path.extname(file.name));
        });

        return importers.length > 0 ? importers[1] : undefined;
    }

}

