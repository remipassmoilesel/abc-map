export class ExportFormat {

    public static CSV = new ExportFormat('csv');
    public static XLSX = new ExportFormat('xlsx');

    public extension: string;

    constructor(id: string) {
        this.extension = id;
    }
}
