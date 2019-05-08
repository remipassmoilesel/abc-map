import {AbstractDataImporter} from './AbstractDataImporter';
import {Workbook} from 'exceljs';
import {XlsxHelper} from '../export/XlsxHelper';
import {FeatureHelper} from '../FeatureUtils';
import {IAbcGeojsonFeature, IAbcGeojsonFeatureCollection} from '../../AbcGeojson';
import {DataFormats, IDataFormat} from '../fileformat/DataFormat';
import * as _ from 'lodash';
import uuid = require('uuid');

export class XlsxDataImporter extends AbstractDataImporter {

    private xlsxHelper = new XlsxHelper();

    public getSupportedFormat(): IDataFormat {
        return DataFormats.XLSX;
    }

    public async toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection> {

        const workbook = new Workbook();
        await workbook.xlsx.read(source);

        const dataSheet = workbook.getWorksheet(2);

        // TODO: finalize
        const count = dataSheet.rowCount;
        const features: IAbcGeojsonFeature[] = [];
        // const features: IAbcGeojsonFeature[] = flow(
        //     map((num: number) => this.xlsxHelper.rowToFeature(dataSheet.getRow(num))),
        //     filter((feature: IAbcGeojsonFeature | null) => feature !== null),
        // )(_.range(2, count));

        return {
            id: uuid.v4(),
            type: 'FeatureCollection',
            features: _.map(features, (feature) => FeatureHelper.toAbcFeature(feature)),
        };
    }

}
