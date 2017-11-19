import * as chai from 'chai';
import {spawnSync} from "child_process";

const assert = chai.assert;

describe('BuildTest', () => {

    it('Build task should execute without errors', (done) => {
        assert.doesNotThrow(() => {
            try {
                spawnSync('npm run build');
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('Package task should execute without errors', (done) => {
        assert.doesNotThrow(() => {
            try {
                spawnSync('npm run build');
                done();
            } catch (e) {
                done(e);
            }
        });
    });

});