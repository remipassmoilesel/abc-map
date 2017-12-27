import * as chai from 'chai';
import * as _ from 'lodash';
import {TileLayer} from '../../entities/layers/TileLayer';
import {Project} from '../../entities/Project';
import {IpcEventImpl} from '../../ipc/IpcEvent';
import {EventType} from '../../ipc/IpcEventTypes';
import {EntitySerializerFactory} from '../../entities/serializer/EntitySerializerFactory';
import {GeoJsonLayer} from '../../entities/layers/GeoJsonLayer';
import {DefaultTileLayers} from '../../entities/layers/DefaultTileLayers';
import {GeocodingResult} from '../../entities/GeocodingResult';

const assert = chai.assert;

describe('AbcmapEntitiesTest', () => {

    const eu = EntitySerializerFactory.newInstance();

    // these objects will be serialized then deserialized
    const entitiesToTest: any[] = [];

    const project = new Project('name-name');
    project.layers = [
        new TileLayer('tile-layer-1', 'http://url2'),
        new GeoJsonLayer('geojson-layer-1'),
    ];
    entitiesToTest.push(project);

    entitiesToTest.push(new IpcEventImpl(EventType.PROJECT_NEW_CREATED, project));
    entitiesToTest.push(new DefaultTileLayers());
    entitiesToTest.push(EventType.PROJECT_ROOT);
    entitiesToTest.push(new GeocodingResult('resolvedName', 5, 5));
    entitiesToTest.push({data: new TileLayer('name', 'http://url')});

    it('Serialize then deserialize should succeed', () => {

        const serializedArray: any[] = [];

        _.forEach(entitiesToTest, (origin) => {
            const serialized = eu.serialize(origin);

            assert.isString(serialized);

            const deserialized = eu.deserialize(serialized);
            serializedArray.push(deserialized);

            assert.deepEqual(origin, deserialized, `Serialization failed for: ${JSON.stringify(origin)},`
                + ` ${JSON.stringify(deserialized)}`);
        });

        assert.instanceOf(serializedArray[5].data, TileLayer);

    });

    it('Serialize layer then deserialize should succeed', () => {

        const lay = new TileLayer('tile-layer-1', 'http://url2');
        assert.doesNotThrow(lay.generateId.bind(lay));

        const serialized = eu.serialize(lay);
        const deserialized = eu.deserialize(serialized);

        assert.doesNotThrow(deserialized.generateId.bind(deserialized));
    });

});
