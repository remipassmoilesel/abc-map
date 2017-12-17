import Component from 'vue-class-component';
import * as _ from 'lodash';
import {MainStore} from "../../lib/store/store";
import {IpcEvent} from "../../../api/ipc/IpcEvent";
import {EventType} from "../../../api/ipc/IpcEventTypes";
import {Logger} from "../../../api/dev/Logger";
import {Clients} from "../../lib/clients/Clients";
import {StoreWrapper} from "../../lib/store/StoreWrapper";
import {AbstractUiComponent} from "../AbstractUiComponent";

const logger = Logger.getLogger('StoreUpdaterComponent');

const updateEventsType = [
    EventType.PROJECT_NEW_CREATED,
    EventType.PROJECT_NEW_LAYER_ADDED,
    EventType.PROJECT_UPDATED,
];

@Component({
    template: "<div style='display: none'></div>",
})
export class StoreUpdaterComponent extends AbstractUiComponent {

    public componentName: string = "Vuex store updater";
    public componentDescription: string = "Component which update Vuex store from IPC messages";
    public componentTagName: string = 'store-updater';

    public $store: MainStore;
    public storeWrapper: StoreWrapper;
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
                this.storeWrapper.project.updateProject(this.$store);
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
        this.storeWrapper.project.updateProject(this.$store);
    }

    private isEventShouldUpdateProject(event: IpcEvent): boolean {
        const res = _.find(updateEventsType, (evt: EventType) => _.isEqual(evt, event.type));
        return res !== undefined;
    }
}
