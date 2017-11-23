import * as chai from 'chai';
import 'mocha';
import {Utils} from "../../../api/utils/Utils";

const assert = chai.assert;

describe('UtilsTest', () => {

    it('Safe stringify should not throw', () => {

        const object: any = {someVar: 'someVal'};
        object.object = object;

        assert.throws(() => {
            JSON.stringify(object);
        });

        assert.doesNotThrow(() => {
            Utils.safeStringify(object)
        });

    });

    it('With default values helper should be correct', () => {

        const parameters: any = {someVar: 'parametersVal'};
        const defaultValues: any = {someVar: 'defaultVal', someVar2: 'defaultVal2'};

        const withDefaults = Utils.withDefaultValues(parameters, defaultValues);
        const withDefaultsUndefined = Utils.withDefaultValues(undefined, defaultValues);

        assert.deepEqual(withDefaults, {someVar: 'parametersVal', someVar2: 'defaultVal2'});
        assert.deepEqual(withDefaultsUndefined, {someVar: 'defaultVal', someVar2: 'defaultVal2'});

    });

});
