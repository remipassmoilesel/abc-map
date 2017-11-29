import {AbstractMapLayer} from "../entities/layers/AbstractMapLayer";

export abstract class AbstractDataImporter {
    public abstract getSupportedExtensions(): string[];

    public abstract getAsLayer(pathToSourceFile: string): Promise<AbstractMapLayer>;
}

