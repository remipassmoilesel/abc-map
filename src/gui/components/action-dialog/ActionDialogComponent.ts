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

    public mounted() {

        this.clients.shortcuts.onEvent(EventType.SC_ACTION_MODAL, () => {
            const h = this.$createElement;
            this.$msgbox({
                title: 'Message',
                message: (h('p', null, [
                    h('span', null, 'Message can be '),
                    h('i', {style: 'color: teal'}, 'VNode')
                ]) as any),
                showCancelButton: true,
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = 'Loading...';
                        setTimeout(() => {
                            done();
                            setTimeout(() => {
                                instance.confirmButtonLoading = false;
                            }, 300);
                        }, 3000);
                    } else {
                        done();
                    }
                }
            }).then(action => {
                this.$message({
                    type: 'info',
                    message: 'action: ' + action
                });
            });
        })

    }


}
