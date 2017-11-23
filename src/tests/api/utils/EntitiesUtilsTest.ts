import * as chai from 'chai';
import 'mocha';
import { WmsLayer } from '../../../api/entities/WmsLayer';
import { EntitiesUtils } from '../../../api/utils/EntitiesUtils';

const assert = chai.assert;

describe('EntitiesUtils', () => {

    it('Creation from raw should be correct', () => {
        const wms = new WmsLayer('name', 'http://url');
        const raw = JSON.parse(JSON.stringify(wms));

        const newWms = EntitiesUtils.parseFromRaw(WmsLayer.prototype, raw);

        assert.deepEqual(wms, newWms);
    });

    it('Creation from raw array should be correct', () => {
        const wms = [
            new WmsLayer('name1', 'http://url1'),
            new WmsLayer('name2', 'http://url2'),
            new WmsLayer('name3', 'http://url3'),
        ];

        const raws = [
            JSON.parse(JSON.stringify(wms[0])),
            JSON.parse(JSON.stringify(wms[1])),
            JSON.parse(JSON.stringify(wms[2])),
        ];

        const newWms = EntitiesUtils.parseFromRawArray(WmsLayer.prototype, raws);

        assert.deepEqual(wms, newWms);
    });

});
