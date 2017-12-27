import * as chai from 'chai';
import {EntitySerializer} from '../../entities/serializer/EntitySerializer';
import {NestedTestClass, SimpleTestClass, SimpleTestClass2, SimpleTestClass3} from './SimpleTestClass';

const assert = chai.assert;

const constructors: any = {};
constructors.Object = Object;
constructors.SimpleTestClass = SimpleTestClass;
constructors.SimpleTestClass2 = SimpleTestClass2;
constructors.NestedTestClass = NestedTestClass;

describe.only('EntitySerializer', () => {

    it('Serialize then deserialize empty object should succeed', () => {

        const eu = new EntitySerializer(constructors);

        const origin = {};
        const serialized = eu.serialize(origin);

        const deserialized = eu.deserialize(serialized);

        assert.isTrue(serialized.length > 0);
        assert.deepEqual(deserialized, origin);
    });

    it('Serialize then deserialize object with undefined properties should succeed', () => {

        const eu = new EntitySerializer(constructors);

        const origin = new SimpleTestClass('test');
        origin.field1 = undefined;
        const serialized = eu.serialize(origin);

        const deserialized = eu.deserialize(serialized);

        assert.isTrue(serialized.length > 0);
        assert.deepEqual(deserialized, origin);
    });

    it('Serialize then deserialize object with null properties should succeed', () => {

        const eu = new EntitySerializer(constructors);

        const origin = new SimpleTestClass('test');
        origin.field1 = null;
        const serialized = eu.serialize(origin);

        const deserialized = eu.deserialize(serialized);

        assert.isTrue(serialized.length > 0);
        assert.deepEqual(deserialized, origin);
    });

    it('Serialize then deserialize simple object should be correct', () => {

        const eu = new EntitySerializer(constructors);

        const origin = new SimpleTestClass('value1');
        const serialized = eu.serialize(origin);

        const deserialized: SimpleTestClass = eu.deserialize(serialized);

        assert.isTrue(serialized.length > 0);
        assert.deepEqual(deserialized, origin);
        assert.instanceOf(deserialized, SimpleTestClass);
        assert.equal(deserialized.field1, 'value1');

        assert.isDefined(deserialized.generateDate());
    });

    it('Serialize forbidden constructor should throw', () => {

        const eu = new EntitySerializer(constructors);

        const origin = new SimpleTestClass3('value1');
        assert.throws(() => {
            eu.serialize(origin);
        });
    });

    it('Serialize then deserialize simple object with nested object should be correct', () => {

        const eu = new EntitySerializer(constructors);

        const origin = new SimpleTestClass('value1');
        origin.field2 = new NestedTestClass('value2');

        const serialized = eu.serialize(origin);

        const deserialized: SimpleTestClass = eu.deserialize(serialized);

        assert.isTrue(serialized.length > 0);
        assert.deepEqual(origin, deserialized);
        assert.instanceOf(deserialized, SimpleTestClass);
        assert.instanceOf(deserialized.field2, NestedTestClass);
    });

    it('Serialize then deserialize simple object with array of objects should be correct', () => {

        const eu = new EntitySerializer(constructors);

        const origin = new SimpleTestClass2('value1');
        origin.field2 = [
            new NestedTestClass('value2'),
            new NestedTestClass('value3'),
            new NestedTestClass('value4'),
        ];

        const serialized = eu.serialize(origin);

        const deserialized: SimpleTestClass2 = eu.deserialize(serialized);

        assert.isTrue(serialized.length > 0);
        assert.deepEqual(origin, deserialized);

        assert.instanceOf(deserialized, SimpleTestClass2);
        assert.instanceOf(deserialized.field2[0], NestedTestClass);
        assert.instanceOf(deserialized.field2[1], NestedTestClass);
        assert.instanceOf(deserialized.field2[2], NestedTestClass);

        assert.equal('value2', deserialized.field2[0].field3);
        assert.equal('value3', deserialized.field2[1].field3);
        assert.equal('value4', deserialized.field2[2].field3);
    });

    it('Serialize then deserialize array of simple objects should be correct', () => {

        const eu = new EntitySerializer(constructors);

        const origin = [
            new SimpleTestClass('value1'),
            new SimpleTestClass('value2'),
            new SimpleTestClass('value3'),
        ];

        const serialized = eu.serialize(origin);
        const deserialized = eu.deserialize(serialized);

        assert.isTrue(serialized.length > 0);
        assert.deepEqual(origin, deserialized);
        assert.instanceOf(deserialized[0], SimpleTestClass);
        assert.instanceOf(deserialized[1], SimpleTestClass);
        assert.instanceOf(deserialized[2], SimpleTestClass);
    });

});
