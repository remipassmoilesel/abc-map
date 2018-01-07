import * as _ from 'lodash';
import * as path from 'path';

export class FileFormat {

    public static CSV = new FileFormat(['csv']);
    public static XLSX = new FileFormat(['xlsx']);
    public static KML = new FileFormat(['kml']);
    public static JSON = new FileFormat(['json']);
    public static GPX = new FileFormat(['gpx']);

    public extensions: string[];

    constructor(extensions: string[]) {
        this.extensions = extensions;
    }

    public isSupported(format: FileFormat): boolean {
        return _.intersection(this.extensions, format.extensions).length > 0;
    }

    public isFileSupported(filePath: string): boolean {
        const normalizedExtension = path.extname(filePath).substr(1).toLowerCase();
        return _.includes(this.extensions, normalizedExtension);
    }
}
