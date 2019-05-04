import * as _ from 'lodash';
import {FeatureHelper} from '../FeatureUtils';
import {IAbcGeojsonFeature} from '../AbcGeojson';
import {CellValue, Row} from 'exceljs';

export class XlsxHelper {

    public getPropertiesHeadersFromFeature(feature: IAbcGeojsonFeature): string[] {
        FeatureHelper.ensureAbcmapPropertiesExists(feature);

        const headers: string[] = [];
        _.forEach(Object.keys(feature.properties), (key) => {
            headers.push(key);
        });

        return headers;
    }

    public featureToRow(feature: IAbcGeojsonFeature): string[] {

        let row: string[] = [];

        row.push(feature.id);
        row.push(feature.geometry.type);
        row.push(JSON.stringify(feature.geometry));
        row = row.concat(this.geojsonPropertiesToRow(feature));

        return row;
    }

    private geojsonPropertiesToRow(feature: IAbcGeojsonFeature): string[] {
        FeatureHelper.ensureAbcmapPropertiesExists(feature);

        const properties: string[] = [];
        _.forEach(Object.keys(feature.properties), (key) => {
            properties.push(JSON.stringify(feature.properties[key]));
        });

        return properties;
    }

    public rowToFeature(rowData: Row): IAbcGeojsonFeature | null {

        const cells: CellValue[] = rowData.values as CellValue[];

        const id = cells[1] as string;
        const geometryType = cells[2] as string;
        const geometry: IAbcGeojsonFeature = JSON.parse(cells[3] as string);
        const properties = this.rowToGeojsonProperties(cells.slice(3).map(cell => cell as string));

        return {
            id,
            type: 'Feature',
            geometry,
            properties,
        };
    }

    private rowToGeojsonProperties(data: string[]): any {
        return FeatureHelper.asAbcmapProperties(data);
    }
}
