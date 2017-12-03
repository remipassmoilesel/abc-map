
import {MapView} from "../../map/MapView";
import {Project} from "../../../../api/entities/Project";

export interface MapViewPayload {
    view: MapView;
}

export interface ProjectPayload {
    project: Project;
}