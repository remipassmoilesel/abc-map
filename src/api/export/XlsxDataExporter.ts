import {AbstractDataExporter} from './AbstractDataExporter';
import xlsx from 'node-xlsx';
import * as fs from 'fs-extra';
import {ExportFormat} from './ExportFormat';
import {IGeoJsonFeature} from '../entities/geojson/IGeoJsonFeature';
import * as _ from 'lodash';

export interface ISheet {
    name: string;
    data: string[][];
}

const headers = {
    'Geometry type': 'Type of geometry',
    'Properties': 'Properties attached to feature',
    'Coordinates': 'Coordinates of geometry',
    'ID': 'Unique identifier of geometry. This should never change.',
};

export class XlsxDataExporter extends AbstractDataExporter {

    public getSupportedFormats(): ExportFormat[] {
        return [ExportFormat.XLSX];
    }

    public async exportCollection(collectionId: string, destinationPath: string, format: ExportFormat) {
        const dataCursor = await this.services.db.getGeoJsonDao().queryAll(collectionId);

        const workbook: ISheet[] = [];
        const helpPage = this.getHelpPage();
        workbook.push(helpPage);

        const dataSheet: ISheet = {name: collectionId, data: []};
        workbook.push(dataSheet);

        if (await dataCursor.next()) {

            // add headers
            dataSheet.data.push(Object.keys(headers));
            this.addHeadersDescription(headers, helpPage);

            while (await dataCursor.hasNext()) {
                const rowData = await dataCursor.next();
                this.addFeatureRow(rowData, dataSheet);
            }

        } else {
            dataSheet.data.push(['No data found in this collection']);
        }

        const buffer = xlsx.build(workbook);
        const wstream = fs.createWriteStream(destinationPath);
        wstream.write(buffer);
        wstream.close();
    }

    private getHelpPage(): ISheet {
        return {
            data: [
                ['Modify data in this workbook and see modifications on map !'],
                ['All data is available on the second sheet.'],
            ],
            name: 'Help',
        };
    }

    private addFeatureRow(feature: IGeoJsonFeature, dataSheet: ISheet) {
        dataSheet.data.push([
            feature.geometry.type,
            JSON.stringify(feature.properties),
            JSON.stringify(feature.geometry.coordinates),
            feature._id,
        ]);
    }

    private addHeadersDescription(headers: any, helpPage: ISheet) {
        helpPage.data.push([]);
        helpPage.data.push(['Field descriptions: ']);
        _.forEach(Object.keys(headers), (head) => {
            helpPage.data.push([head, headers[head]]);
        });
    }
}
