import {AbstractDataExporter} from './AbstractDataExporter';
import xlsx from 'node-xlsx';
import * as fs from 'fs-extra';
import {ExportFormat} from './ExportFormat';

export interface ISheet {
    name: string;
    data: string[][];
}


export class XlsxDataExporter extends AbstractDataExporter {

    public getSupportedFormats(): ExportFormat[] {
        return [ExportFormat.XLSX];
    }

    public async exportCollection(collectionId: string, destinationPath: string, format: ExportFormat) {
        const dataCursor = await this.services.db.getGeoJsonDao().queryAll(collectionId);

        const workbook: ISheet[] = [];
        workbook.push({
            data: [['Modify data in this workbook and see modifications on map !']],
            name: 'Help',
        });

        const dataSheet: ISheet = {name: collectionId, data: []};
        workbook.push(dataSheet);
        while (await dataCursor.hasNext()) {
            const rowData = await dataCursor.next();
            dataSheet.data.push([JSON.stringify(rowData)]);
        }

        const buffer = xlsx.build(workbook);
        const wstream = fs.createWriteStream(destinationPath);
        wstream.write(buffer);
        wstream.close();
    }

}
