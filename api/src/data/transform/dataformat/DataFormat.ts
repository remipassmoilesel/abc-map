
export interface IDataFormat {
    name: string;
    extensions: string[];
}

export const DATA_FORMAT_WHITELIST = [
    'ASCII text',
    'XML 1.0 document',
    'Zip archive data',
];

export class DataFormats {

    public static CSV: IDataFormat = {
        name: 'CSV',
        extensions: ['csv'],
    };

    public static XLSX: IDataFormat = {
        name: 'XLSX',
        extensions: ['xlsx'],
    };

    public static KML: IDataFormat = {
        name: 'KML',
        extensions: ['kml'],
    };

    public static JSON: IDataFormat = {
        name: 'JSON',
        extensions: ['json'],
    };

    public static GPX: IDataFormat = {
        name: 'GPX',
        extensions: ['gpx'],
    };

    public static SHP: IDataFormat = {
        name: 'SHP',
        extensions: ['zip'],
    };

    public static ALL = [
        DataFormats.CSV,
        DataFormats.XLSX,
        DataFormats.KML,
        DataFormats.JSON,
        DataFormats.GPX,
        DataFormats.SHP,
    ];

}
