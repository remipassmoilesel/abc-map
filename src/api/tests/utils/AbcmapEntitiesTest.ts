import * as chai from 'chai';
import * as _ from 'lodash';
import {TileLayer} from '../../entities/layers/TileLayer';
import {Project} from '../../entities/Project';
import {IpcEventImpl} from '../../ipc/IpcEvent';
import {EventType} from '../../ipc/IpcEventTypes';
import {EntitySerializerFactory} from '../../entities/serializer/EntitySerializerFactory';
import {GeoJsonLayer} from '../../entities/layers/GeoJsonLayer';
import {DefaultTileLayers} from '../../entities/layers/DefaultTileLayers';
import {GeocodingResult} from "../../entities/GeocodingResult";

const assert = chai.assert;

describe.only('AbcmapEntitiesTest', () => {

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

    it('Serialize then deserialize should be correct', () => {

        _.forEach(entitiesToTest, (obj, index) => {
            const raw = eu.serialize(obj);

            assert.isString(raw);

            const newObj = eu.deserialize(raw);
            assert.deepEqual(obj, newObj, `Serialization failed for: ${obj}, ${newObj}`);
        });
    });

});
