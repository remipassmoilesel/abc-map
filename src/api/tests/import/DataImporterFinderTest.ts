import * as chai from 'chai';
import {GpxDataImporter} from "../../import/GpxDataImporter";
import {DataImporterFinder} from "../../import/DataImporterFinder";
import {KmlDataImporter} from "../../import/KmlDataImporter";

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
