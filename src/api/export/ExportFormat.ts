import * as _ from 'lodash';

export class ExportFormat {

    public static CSV = new ExportFormat(['csv']);
    public static XLSX = new ExportFormat(['xlsx']);

    public extensions: string[];

    constructor(extensions: string[]) {
        this.extensions = extensions;
    }

    public isSupported(format: ExportFormat): boolean {
        return _.intersection(this.extensions, format.extensions).length > 0;
    }
}
