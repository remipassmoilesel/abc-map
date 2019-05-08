// tslint:disable:no-var-requires
const {DOMParser} = require('xmldom');

export class DataImporterHelper {

    public static getBufferAsDom(source: Buffer): Document {
        return new DOMParser().parseFromString(source.toString());
    }

}
