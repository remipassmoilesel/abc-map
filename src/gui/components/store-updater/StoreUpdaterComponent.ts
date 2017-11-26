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
        this.clients.projectClient.onProjectEvent((event: IpcEvent) => {

            logger.info('Receiving project event', event);

            if (_.isEqual(event.type, Evt.PROJECT_NEW_CREATED)) {
                this.$store.dispatch(Ats.PROJECT_UPDATE, event.data);
            } else {
                logger.warning('Unknown event', event);
            }

            return Promise.resolve();
        });
    }

    private initializeStore() {
        this.clients.projectClient.getCurrentProject().then((project: Project) => {
            this.$store.dispatch(Ats.PROJECT_UPDATE, project);
        });
    }
}
