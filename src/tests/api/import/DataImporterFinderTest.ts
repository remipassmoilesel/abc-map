import * as chai from 'chai';
import {GpxDataImporter} from "../../../api/import/GpxDataImporter";
import {DataImporterFinder} from "../../../api/import/DataImporterFinder";
import {KmlDataImporter} from "../../../api/import/KmlDataImporter";

const assert = chai.assert;

describe('DataImporterFinder', () => {

    it('Should find an importer for GPX data', () => {

        const file = 'test.gpx';
        const importerFinder = new DataImporterFinder();

        const importer = importerFinder.getInstanceForFile(file);
        assert.instanceOf(importer, GpxDataImporter);

    });

    it('Should find an importer for KML data', () => {

        const file = 'test.kml';
        const importerFinder = new DataImporterFinder();

        const importer = importerFinder.getInstanceForFile(file);
        assert.instanceOf(importer, KmlDataImporter);

    });

    it('Should return undefined if extension is unknown', () => {

        const file = 'test.xyza';
        const importerFinder = new DataImporterFinder();

        const importer = importerFinder.getInstanceForFile(file);
        assert.isUndefined(importer);

    });

});
