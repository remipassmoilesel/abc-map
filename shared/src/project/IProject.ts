import {IMapLayer} from './IMapLayer';


export interface IProject {
    id: string;
    activeLayerId: string | null;
    name: string;
    layers: IMapLayer[];
}
