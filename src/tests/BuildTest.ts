import * as chai from 'chai';
import {spawnSync} from "child_process";

const assert = chai.assert;

describe('BuildTest', () => {

    it('Build api should return 0', () => {
        assert.doesNotThrow(() => {
            spawnSync('npm run build-gui');
        });
    });

});