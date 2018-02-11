import * as path from 'path';
import {AbstractDataImporter} from './AbstractDataImporter';
import {FileFormat} from '../export/FileFormat';
import {Workbook} from 'exceljs';
import {XlsxHelper} from '../export/XlsxHelper';
import {IGeoJsonFeature} from '../entities/geojson/IGeoJsonFeature';

export class XlsxDataImporter extends AbstractDataImporter {

    private xlsxHelper = new XlsxHelper();

    public getSupportedFormat(): FileFormat {
        return FileFormat.XLSX;
    }

    public async fileToCollection(pathToSourceFile: string, collectionName?: string): Promise<string> {

        const workbook = new Workbook();
        await workbook.xlsx.readFile(pathToSourceFile);

        const dataSheet = workbook.getWorksheet(2);

        const count = dataSheet.rowCount;
        const features: IGeoJsonFeature[] = [];
        for (let i = 2; i <= count; i++) {
            const feat = this.xlsxHelper.rowToFeature(dataSheet.getRow(i).values);
            if (feat) {
                features.push(feat);
            }
        }

        const collectionId = collectionName || path.basename(pathToSourceFile);
        await this.services.db.getGeoJsonDao().insertMany(
            collectionId,
            features,
        );

        return collectionId;

    }

}
