import Vue from 'vue';
import Component from 'vue-class-component';
import {Clients} from "../../lib/clients/Clients";

const authorizedExtensions = ['.gpx', '.kml'];

@Component({
    template: require('./template.html'),
})
export class DragNDropComponent extends Vue {

    public clients: Clients;
    public files: File[] = [];

    public mounted() {

    }

    public handleDrop(ev) {
        console.log(ev.dataTransfer);
        ev.preventDefault();
    }

}
