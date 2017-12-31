export class LayerExportFormat {

    public static CSV = new LayerExportFormat('csv');
    public static XLSX = new LayerExportFormat('xslx');

    public id: string;

    constructor(id: string){
        this.id = id;
    }
}
