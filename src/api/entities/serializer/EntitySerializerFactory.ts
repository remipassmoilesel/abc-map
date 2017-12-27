import {TileLayer} from '../layers/TileLayer';
import {Project} from '../Project';
import {EventType} from '../../ipc/IpcEventTypes';
import {IpcEventImpl} from '../../ipc/IpcEvent';
import {GeocodingResult} from '../GeocodingResult';
import {GeoJsonLayer} from '../layers/GeoJsonLayer';
import {EntitySerializer} from './EntitySerializer';
import {DefaultTileLayers} from '../layers/DefaultTileLayers';


// WARNING
// All constructors declared here are imported in browser

// List of constructors used to deserialize objects

const defaultConstructors: any = {};
defaultConstructors.TileLayer = TileLayer;
defaultConstructors.Project = Project;
defaultConstructors.IpcEventImpl = IpcEventImpl;
defaultConstructors.EventType = EventType;
defaultConstructors.GeoJsonLayer = GeoJsonLayer;
defaultConstructors.GeocodingResult = GeocodingResult;
defaultConstructors.DefaultTileLayers = DefaultTileLayers;

export class EntitySerializerFactory {

    public static newInstance(): EntitySerializer {
        return new EntitySerializer(defaultConstructors);
    }

}
