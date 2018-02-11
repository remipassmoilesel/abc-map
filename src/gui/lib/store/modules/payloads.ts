
import {MapView} from '../../map/MapView';
import {Project} from '../../../../api/entities/Project';

export interface IMapViewPayload {
    view: MapView;
}

export interface IProjectPayload {
    project: Project;
}

export interface IActionDialogPayload {
    dialogIsVisible: boolean;
}
