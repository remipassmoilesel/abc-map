import * as chai from 'chai';
import {FileFormat} from '../../export/FileFormat';
import {DataExporterFinder} from '../../export/DataExporterFinder';
import {XlsxDataExporter} from '../../export/XlsxDataExporter';

const assert = chai.assert;

describe('DataExporterFinderTest', () => {

    it('Finder should find XLSX exporter', async () => {
        const finder = new DataExporterFinder({} as any);
        const exporter = finder.getInstanceForFormat(FileFormat.XLSX);

        assert.isDefined(exporter);
        assert.instanceOf(exporter, XlsxDataExporter);
    });

    it('Finder should return undefined if format is unknown', async () => {
        const finder = new DataExporterFinder({} as any);
        const exporter = finder.getInstanceForFormat(new FileFormat(['xyz']));

        assert.isUndefined(exporter);
    });

});
