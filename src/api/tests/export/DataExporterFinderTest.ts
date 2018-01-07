import * as chai from 'chai';
import {ExportFormat} from '../../export/ExportFormat';
import {DataExporterFinder} from '../../export/DataExporterFinder';
import {XlsxDataExporter} from '../../export/XlsxDataExporter';

const assert = chai.assert;

describe('DataExporterFinderTest', () => {

    it('Finder should find XLSX exporter', async () => {
        const finder = new DataExporterFinder({} as any);
        const exporter = finder.getInstanceForFormat(ExportFormat.XLSX);

        assert.isDefined(exporter);
        assert.instanceOf(exporter, XlsxDataExporter);
    });

    it('Finder should return undefined if format is unknown', async () => {
        const finder = new DataExporterFinder({} as any);
        const exporter = finder.getInstanceForFormat(new ExportFormat(['xyz']));

        assert.isUndefined(exporter);
    });

});
