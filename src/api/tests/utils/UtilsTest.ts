import * as chai from 'chai';
import * as sinon from 'sinon';
import {Utils} from "../../utils/Utils";

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

    it('Retry should fail after max number', () => {

        const promiseStub = sinon.stub();
        promiseStub.onCall(0).returns(Promise.reject(new Error()));
        promiseStub.onCall(1).returns(Promise.reject(new Error()));
        promiseStub.onCall(2).returns(Promise.reject(new Error()));
        promiseStub.onCall(3).returns(Promise.reject(new Error()));

        return Utils.retryUntilSuccess(promiseStub, 3, 10)
            .then(() => {
                throw new Error('Should fail');
            })
            .catch(() => {
                assert.equal(promiseStub.callCount, 4);
            });
    });

    it('Retry should succeed after max number', () => {

        const promiseStub = sinon.stub();
        promiseStub.onCall(0).returns(Promise.reject(new Error()));
        promiseStub.onCall(1).returns(Promise.reject(new Error()));
        promiseStub.onCall(2).returns(Promise.reject(new Error()));
        promiseStub.onCall(3).returns(Promise.resolve());

        return Utils.retryUntilSuccess(promiseStub, 3, 10)
            .then(() => {
                assert.equal(promiseStub.callCount, 4);
            })
            .catch(() => {
                throw new Error('Should resolve');
            });
    });

});
