import Vue from 'vue';
import Component from 'vue-class-component';
import {Clients} from '../../lib/clients/Clients';
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import './style.scss';
import {EventType} from "../../../api/ipc/IpcEventTypes";

@Component({
    template: require('./template.html'),
})
export class ActionDialogComponent extends Vue {

    public clients: Clients;
    public layers: AbstractMapLayer[] = [];
    private dialogVisible: boolean = false;

    public mounted() {

        this.clients.shortcuts.onEvent(EventType.SC_ACTION_MODAL, () => {

            if (this.dialogVisible === true) {
                this.closeActionDialog();
            } else {
                this.openActionDialog();
            }
        })

    }

    private closeActionDialog() {
        this.dialogVisible = false;
    }

    private openActionDialog() {
        this.dialogVisible = true;
    }
}
