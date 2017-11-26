import * as Resurrect from 'resurrect-js';
import {Project} from "../entities/Project";
import {WmsLayer} from "../entities/WmsLayer";
import {IpcEvent, IpcEventImpl} from "../ipc/IpcEvent";
import {Evt} from "../ipc/IpcEventTypes";

const prototypes: any = {};
prototypes.WmsLayer = WmsLayer;
prototypes.Project = Project;
prototypes.IpcEventImpl = IpcEventImpl;
prototypes.Evt = Evt;

export class EntitiesUtils {

    private necromancer: any;

    constructor() {
        this.necromancer = new Resurrect({
            resolver: new Resurrect.NamespaceResolver(prototypes), // resolve constructors from list above
            cleanup: true, // remove special fields from created objects
        });
    }

    public serialize(data: any): string {
        return this.necromancer.stringify(data);
    }

    public deserialize(data: string): any {
        return this.necromancer.resurrect(data);
    }

    public deserializeProject(data: string): Project {
        return this.deserialize(data);
    }

    public deserializeIpcEvent(data: string): IpcEvent {
        return this.deserialize(data);
    }

}
