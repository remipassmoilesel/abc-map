import * as chai from 'chai';
import {ExportFormat} from '../../export/ExportFormat';
import {LayerExporterFinder} from '../../export/LayerExporterFinder';
import {XlsxLayerExporter} from '../../export/XlsxLayerExporter';

const assert = chai.assert;

describe('ExporterFinderTest', () => {

    it('Finder should find XLSX exporter', async () => {
        const finder = new LayerExporterFinder();
        finder.setServiceMap({} as any);

        const exporter = finder.getInstanceForFormat(ExportFormat.XLSX);

        assert.isDefined(exporter);
        assert.instanceOf(exporter, XlsxLayerExporter);
    });

    it('Finder should return undefined if format is unknown', async () => {
        const finder = new LayerExporterFinder();
        finder.setServiceMap({} as any);

        const exporter = finder.getInstanceForFormat(new ExportFormat('xyz'));

        assert.isUndefined(exporter);
    });

});
