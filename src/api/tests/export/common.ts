import {XlsxDataExporter} from '../../export/XlsxDataExporter';
import {Row, Worksheet} from 'exceljs';

export function getAllIds(dataSheet: Worksheet): Promise<string[]> {
    const idHeader = Object.keys(XlsxDataExporter.XLSX_HEADERS)[0];
    const sheetFeatureIds: string[] = [];

    let i = 1;
    const end = dataSheet.rowCount - 1;

    return new Promise((resolve, reject) => {
        dataSheet.eachRow((row: Row) => {
            const id = row.getCell(1).value.toString();

            if (id === idHeader) {
                return;
            }

            sheetFeatureIds.push(id);
            if (i >= end - 1) {
                resolve(sheetFeatureIds);
            }
            i++;
        });
    });
}
