import Vue from 'vue';
import Component from 'vue-class-component';
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import {Clients} from "../../lib/clients/Clients";
import './style.scss';

@Component({
    template: require('./template.html'),
})
export default class ImportDataSelectorComponent extends Vue {

    public clients: Clients;
    public fileList: any[] = [];

    public getLayers(): AbstractMapLayer[] {
        return this.$store.getters.projectLayers;
    }

    public uploadSelection(files, fileList) {
        console.log(this.fileList);
    }

    public handleExceed(files, fileList) {
        this.$message.warning(`The limit is 3, you selected ${files.length} files this time,`
            + ` add up to ${files.length + fileList.length} totally`);
    }

}
