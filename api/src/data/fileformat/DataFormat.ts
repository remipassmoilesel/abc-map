
export interface IDataFormat {
    name: string;
    extensions: string[];
    libmagic: string;
}

export class DataFormats {

    public static CSV: IDataFormat = {
        name: 'CSV',
        extensions: ['csv'],
        libmagic: '',
    };

    public static XLSX: IDataFormat = {
        name: 'XLSX',
        extensions: ['xlsx'],
        libmagic: '',
    };

    public static KML: IDataFormat = {
        name: 'KML',
        extensions: ['kml'],
        libmagic: '',
    };

    public static JSON: IDataFormat = {
        name: 'JSON',
        extensions: ['json'],
        libmagic: '',
    };

    public static GPX: IDataFormat = {
        name: 'GPX',
        extensions: ['gpx'],
        libmagic: '',
    };

    public static ALL = [
        DataFormats.CSV,
        DataFormats.XLSX,
        DataFormats.KML,
        DataFormats.JSON,
        DataFormats.GPX,
    ];

}
