// tslint:disable:object-literal-sort-keys
import * as _ from 'lodash';
import {AbstractDataExporter} from './AbstractDataExporter';
import {Workbook, Worksheet} from 'exceljs';
import {FileFormat} from './FileFormat';
import {IGeoJsonFeature} from '../entities/geojson/IGeoJsonFeature';
import {FeatureUtils} from '../entities/geojson/FeatureUtils';
import {XlsxHelper} from './XlsxHelper';

export class XlsxDataExporter extends AbstractDataExporter {

    public static readonly XLSX_HEADERS = {
        'ID': 'Unique identifier of geometry. This should never change.',
        'Geometry type': 'Type of geometry',
        'Coordinates': 'Coordinates of geometry',
        'Properties': 'Properties attached to feature',
    };

    private xlsxHelper = new XlsxHelper();

    public getSupportedFormat(): FileFormat {
        return FileFormat.XLSX;
    }

    public async exportCollection(collectionId: string, destinationPath: string, format: FileFormat) {
        const dataCursor = await this.services.db.getGeoJsonDao().queryAll(collectionId);

        const workbook = new Workbook();
        this.setMetadata(workbook);

        const helpSheet: Worksheet = workbook.addWorksheet('Help');
        this.setupHelpSheet(helpSheet);

        const dataSheet: Worksheet = workbook.addWorksheet('Data');
        this.setupDataSheet(dataSheet);

        if (await dataCursor.hasNext()) {

            // add headers
            this.addHeadersToDataSheet(dataSheet);

            this.addHeadersDescription(XlsxDataExporter.XLSX_HEADERS, helpSheet);

            while (await dataCursor.hasNext()) {
                const rowData = await dataCursor.next();
                const row = this.xlsxHelper.featureToRow(rowData);
                dataSheet.addRow(row);
            }

        } else {
            dataSheet.addRow(['No data found in this collection']);
        }

        await dataCursor.close();
        await workbook.xlsx.writeFile(destinationPath);
    }

    private setupHelpSheet(helpSheet: Worksheet) {
        helpSheet.addRows([
            ['Modify data in this workbook and see modifications on map !'],
            ['All data is available on the second sheet.'],
        ]);
        helpSheet.getRow(1).font = {name: 'Comic Sans MS', family: 4, size: 12, bold: true};
    }


    private addHeadersDescription(headers: any, helpSheet: Worksheet) {
        helpSheet.addRow([]);
        helpSheet.addRow(['Field descriptions: ']);
        _.forEach(Object.keys(headers), (head) => {
            helpSheet.addRow(['', head, headers[head]]);
        });

        helpSheet.getRow(4).font = {name: 'Comic Sans MS', family: 4, size: 12, bold: true};
        const fieldNameCol = helpSheet.getColumn(2);
        fieldNameCol.width = 20;
    }

    private setMetadata(workbook: Workbook) {
        workbook.creator = 'Abc-Map';
        workbook.created = new Date();
    }


    private addHeadersToDataSheet(dataSheet: Worksheet) {
        dataSheet.addRow(Object.keys(XlsxDataExporter.XLSX_HEADERS));
        dataSheet.getRow(1).font = {name: 'Comic Sans MS', family: 4, size: 12, bold: true};
    }

    private setupDataSheet(dataSheet: Worksheet) {
        const geometryTypeCol = dataSheet.getColumn(2);
        geometryTypeCol.width = 20;
        const coordinatesCol = dataSheet.getColumn(3);
        coordinatesCol.width = 30;
        const propertiesCol = dataSheet.getColumn(4);
        propertiesCol.width = 30;
    }
}
