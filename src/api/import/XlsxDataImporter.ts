import * as path from 'path';
import {Document, DOMParser} from 'xmldom';
import {AbstractDataImporter} from './AbstractDataImporter';
import {FileFormat} from '../export/FileFormat';
import {Workbook} from 'exceljs';
import {XlsxHelper} from '../export/XlsxHelper';
import * as _ from 'lodash';
import {IGeoJsonFeature} from '../entities/geojson/IGeoJsonFeature';

export class XlsxDataImporter extends AbstractDataImporter {

    private xlsxHelper = new XlsxHelper();

    public getSupportedFormat(): FileFormat {
        return FileFormat.XLSX;
    }

    public async fileToCollection(pathToSourceFile: string, collectionName?: string): Promise<string> {

        const workbook = new Workbook();
        await workbook.xlsx.readFile(pathToSourceFile);

        const dataSheet = workbook.getWorksheet(1);

        const count = dataSheet.rowCount;
        const features: IGeoJsonFeature[] = [];
        _.times(count, (n) => {
            const feat = this.xlsxHelper.rowToFeature(dataSheet.getRow(n).values);
            features.push(feat);
        });

        const collectionId = collectionName || path.basename(pathToSourceFile);
        await this.services.db.getGeoJsonDao().insertMany(
            collectionId,
            features,
        );

        return collectionId;

    }

}
