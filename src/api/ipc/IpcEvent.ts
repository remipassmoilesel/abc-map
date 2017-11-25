import {Evt} from "./IpcEventTypes";

export interface IpcEvent {
    type?: Evt;
    data?: any;
}