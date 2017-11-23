import * as chai from 'chai';
import {spawn, spawnSync} from 'child_process';
import 'mocha';

const assert = chai.assert;

describe('BuildTest', () => {

    it.skip('Package task should execute without errors', (done) => {
        assert.doesNotThrow(() => {
            try {
                spawn('npm run package');
                done();
            } catch (e) {
                done(e);
            }
        });
    });

});
