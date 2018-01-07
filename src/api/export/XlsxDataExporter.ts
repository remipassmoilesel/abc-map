// tslint:disable:object-literal-sort-keys
import {AbstractDataExporter} from './AbstractDataExporter';
import {Workbook, Worksheet} from 'exceljs';
import {ExportFormat} from './ExportFormat';
import {IGeoJsonFeature} from '../entities/geojson/IGeoJsonFeature';
import * as _ from 'lodash';
import {FeatureUtils} from '../entities/geojson/FeatureUtils';

export class XlsxDataExporter extends AbstractDataExporter {

    public static readonly XLSX_HEADERS = {
        'ID': 'Unique identifier of geometry. This should never change.',
        'Geometry type': 'Type of geometry',
        'Coordinates': 'Coordinates of geometry',
        'Properties': 'Properties attached to feature',
    };

    public getSupportedFormats(): ExportFormat[] {
        return [ExportFormat.XLSX];
    }

    public async exportCollection(collectionId: string, destinationPath: string, format: ExportFormat) {
        const dataCursor = await this.services.db.getGeoJsonDao().queryAll(collectionId);

        const workbook = new Workbook();
        this.setMetadata(workbook);

        const helpSheet: Worksheet = workbook.addWorksheet('Help');
        this.setupHelpSheet(helpSheet);

        const dataSheet: Worksheet = workbook.addWorksheet('Data');

        if (await dataCursor.hasNext()) {

            // add headers
            dataSheet.addRow(Object.keys(XlsxDataExporter.XLSX_HEADERS));
            this.addHeadersDescription(XlsxDataExporter.XLSX_HEADERS, helpSheet);

            while (await dataCursor.hasNext()) {
                const rowData = await dataCursor.next();
                this.addFeatureRow(rowData, dataSheet);
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
    }

    private addFeatureRow(feature: IGeoJsonFeature, dataSheet: Worksheet) {

        let row: string[] = [];

        row.push(feature._id);
        row.push(feature.geometry.type);
        row.push(JSON.stringify(feature.geometry.coordinates));
        row = row.concat(this.processProperties(feature));

        dataSheet.addRow(row);
    }

    private addHeadersDescription(headers: any, helpPage: Worksheet) {
        helpPage.addRow([]);
        helpPage.addRow(['Field descriptions: ']);
        _.forEach(Object.keys(headers), (head) => {
            helpPage.addRow([head, headers[head]]);
        });
    }

    private processProperties(feature: IGeoJsonFeature): string[] {
        FeatureUtils.ensureAbcmapPropertiesExists(feature);
        const properties = [];
        _.forEach(Object.keys(feature.properties), (key) => {
            properties.push(JSON.stringify(feature.properties[key]));
        });

        return properties;
    }

    private setMetadata(workbook: Workbook) {
        workbook.creator = 'Abc-Map';
        workbook.created = new Date();
    }


}
