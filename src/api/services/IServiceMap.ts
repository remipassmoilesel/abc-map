import {ProjectService} from './ProjectService';
import {MapService} from './MapService';
import {DatabaseService} from './DatabaseService';
import {GlobalShortcutsService} from '../utils/GlobalShortcutsService';

export interface IServicesMap {
    project: ProjectService;
    map: MapService;
    db: DatabaseService;
    shortcuts: GlobalShortcutsService;
}
