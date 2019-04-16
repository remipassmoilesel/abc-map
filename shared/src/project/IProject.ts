import {IMapLayer} from './IMapLayer';


export interface IProject {
    id: string;
    activeLayerId: string;
    name: string;
    layers: IMapLayer[];
}
