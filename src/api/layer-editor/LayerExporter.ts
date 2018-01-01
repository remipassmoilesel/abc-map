import {LayerExportFormat} from './LayerExportFormat';
import {IServicesMap} from '../handlers/AbstractHandlersGroup';
import xlsx from 'node-xlsx';

interface ISheet {
    name: string;
    data: string[][];
}

export class LayerExporter {
    private services: IServicesMap;

    constructor(servicesMap: IServicesMap) {
        this.services = servicesMap;
    }

    public async exportLayer(layerId: string, destinationPath: string, format: LayerExportFormat) {
        const dataCursor = await this.services.db.getGeoJsonDao().queryAll(layerId);

        const workbook: ISheet[] = [];
        workbook.push({
            data: [['Modify data in this workbook and see modifications on map !']],
            name: 'Help',
        });

        const dataSheet: ISheet = {name: layerId, data: []};
        workbook.push(dataSheet);
        while (dataCursor.hasNext()) {
            const rowData = await dataCursor.next();
            dataSheet.data.push([JSON.stringify(rowData)]);
        }

        const buffer = xlsx.build(workbook);
        console.log(buffer.toString());
    }

}
