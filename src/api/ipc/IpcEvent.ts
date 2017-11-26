import {Evt} from "./IpcEventTypes";

export interface IpcEvent {
    type?: Evt;
    data?: any;
}

export class IpcEventImpl implements IpcEvent {
    public type: Evt;
    public data: any;

    constructor(type, data?) {
        this.type = type;
        this.data = data;
    }

}