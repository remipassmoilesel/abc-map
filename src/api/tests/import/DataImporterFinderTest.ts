import * as chai from 'chai';
import {GpxDataImporter} from '../../import/GpxDataImporter';
import {DataImporterFinder} from '../../import/DataImporterFinder';
import {KmlDataImporter} from '../../import/KmlDataImporter';
import {XlsxDataImporter} from '../../import/XlsxDataImporter';

const assert = chai.assert;

describe('DataImporterFinder', () => {

    it('Should find an importer for GPX data', () => {

        const file = 'test.gpx';
        const importerFinder = new DataImporterFinder({} as any);

        const importer = importerFinder.getInstanceForFile(file);
        assert.instanceOf(importer, GpxDataImporter);

    });

    it('Should find an importer for KML data', () => {

        const file = 'test.kml';
        const importerFinder = new DataImporterFinder({} as any);

        const importer = importerFinder.getInstanceForFile(file);
        assert.instanceOf(importer, KmlDataImporter);

    });

    it('Should find an importer for XLSX data', () => {

        const file = 'test.xlsx';
        const importerFinder = new DataImporterFinder({} as any);

        const importer = importerFinder.getInstanceForFile(file);
        assert.instanceOf(importer, XlsxDataImporter);

    });

    it('Should return undefined if extension is unknown', () => {

        const file = 'test.xyza';
        const importerFinder = new DataImporterFinder({} as any);

        const importer = importerFinder.getInstanceForFile(file);
        assert.isUndefined(importer);

    });

});
