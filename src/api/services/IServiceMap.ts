import {ProjectService} from './ProjectService';
import {MapService} from './MapService';
import {DatabaseService} from './DatabaseService';
import {GlobalShortcutsService} from '../utils/GlobalShortcutsService';
import {AbstractService} from './AbstractService';

export interface IServicesMap {
    [key: string]: AbstractService;

    project: ProjectService;
    map: MapService;
    db: DatabaseService;
    shortcuts: GlobalShortcutsService;
}
