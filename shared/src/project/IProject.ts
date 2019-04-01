import {IMapLayer} from './IMapLayer';


export interface IProject {
    id: string;
    activeLayer: IMapLayer | null;
    name: string;
    layers: IMapLayer[];
}
