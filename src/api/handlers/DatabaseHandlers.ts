import {Ipc} from '../ipc/Ipc';
import {DbSubjects} from '../ipc/IpcSubject';
import {AbstractHandlersGroup, IServicesMap} from './AbstractHandlersGroup';
import {IpcEvent} from '../ipc/IpcEvent';
import {Cursor} from 'mongodb';

export class DatabaseHandlers extends AbstractHandlersGroup {

    constructor(ipc: Ipc, services: IServicesMap) {
        super(ipc, services);

        this.registerHandler(DbSubjects.START_DB, this.startDb.bind(this));
        this.registerHandler(DbSubjects.STOP_DB, this.stopDb.bind(this));
        this.registerHandler(DbSubjects.RESTART_DB, this.restartDb.bind(this));
        this.registerHandler(DbSubjects.GET_LAYER_GEOJSON_DATA, this.getLayerData.bind(this));
    }

    public startDb() {
        this.services.db.startDatabase();
    }

    public stopDb() {
        this.services.db.stopDatabase();
    }

    public restartDb() {
        this.services.db.stopDatabase();
    }

    public getLayerData(event: IpcEvent) {
        return new Promise((resolve, reject) => {
            try {
                const dao = this.services.db.getGeoJsonDao();
                const cursor = dao.queryAll(event.data);

                this.cursorToArrayWithoutId(cursor)
                    .then(resolve)
                    .catch(reject);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * We need to delete id of entities because we can not import MongoDB ObjectID in browser
     * TODO: find a way to serialize ids
     * @param {Cursor} cursor
     * @returns {Promise<any>}
     */
    private cursorToArrayWithoutId(cursor: Cursor): Promise<any[]> {

        return cursor.toArray()
            .then((data: any[]) => {

                const res = [];
                for (let i = 0; i < data.length; i++) {
                    const entity = data[i];
                    this.deleteIdForEntity(entity);
                    res.push(entity);
                }
                return res;

            });

    }

    private deleteIdForEntity(entity: any) {
        delete entity._id;
    }
}
