import * as uuid from "uuid";
import {MapLayerType} from "../../../shared/dist";

export class ProjectHelper {

    public static generateProjectId(): string {
        return `project-${uuid.v4()}`.toLocaleLowerCase();
    }

    public static generateLayerId(layer: MapLayerType): string {
        return `${layer}-${uuid.v4()}`.toLocaleLowerCase();
    }
}
