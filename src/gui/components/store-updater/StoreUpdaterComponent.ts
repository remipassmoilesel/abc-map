import Vue from 'vue';
import Component from 'vue-class-component';
import * as _ from 'lodash';
import {MainStore} from "../../lib/store/store";
import {IpcEvent} from "../../../api/ipc/IpcEvent";
import {Evt} from "../../../api/ipc/IpcEventTypes";
import {Ats} from "../../lib/store/mutationsAndActions";
import {Logger} from "../../../api/dev/Logger";
import {Clients} from "../../lib/clients/Clients";
import {Project} from "../../../api/entities/Project";

const logger = Logger.getLogger('StoreUpdaterComponent');

const updateEventsType = [
    Evt.PROJECT_NEW_CREATED,
    Evt.PROJECT_NEW_LAYER_ADDED,
    Evt.PROJECT_UPDATED,
];

@Component({
    template: "<div></div>",
})
export default class StoreUpdaterComponent extends Vue {

    public $store: MainStore;
    public clients: Clients;

    public mounted() {
        this.registerHandlers();
        this.initializeStore();
    }

    private registerHandlers() {
        this.clients.project.onProjectEvent((event: IpcEvent) => {

            logger.info('Receiving project event', event);

            // event should update project
            if (this.isEventShouldUpdateProject(event)) {
                this.$store.dispatch(Ats.PROJECT_UPDATE, event.data);
            }
            // unknown event
            else {
                logger.warning('Unknown event', event);
            }

            return Promise.resolve();
        });

        this.clients.map.onMapEvent((event: IpcEvent) => {

            logger.info('Receiving map event', event);

            return Promise.resolve();
        });


    }

    private initializeStore() {
        this.clients.project.getCurrentProject().then((project: Project) => {
            this.$store.dispatch(Ats.PROJECT_UPDATE, project);
        });
    }

    private isEventShouldUpdateProject(event: IpcEvent): boolean {
        const res = _.find(updateEventsType, (evt: Evt) => _.isEqual(evt, event.type))
        return res !== undefined;
    }
}
