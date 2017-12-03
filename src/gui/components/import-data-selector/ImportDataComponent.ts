import Vue from 'vue';
import Component from 'vue-class-component';
import {Clients} from "../../lib/clients/Clients";
import * as _ from "lodash";
import * as path from "path";
import {Toaster} from "../../lib/Toaster";
import './style.scss';

const authorizedExtensions = ['.gpx', '.kml'];

@Component({
    template: require('./template.html'),
})
export default class ImportDataSelectorComponent extends Vue {

    public clients: Clients;
    public files: File[] = [];

    public selectFiles(event) {

        const filesToCheck: File[] = event.target.files;
        const validFiles: File[] = [];
        _.forEach(filesToCheck, (file: File) => {
            if (_.includes(authorizedExtensions, path.extname(file.name))) {
                validFiles.push(file);
            }
        });

        if (filesToCheck.length > validFiles.length) {
            Toaster.error(`Some files where not imported because they are invalid`);
        }

        this.files = validFiles;

    }

    public importFiles() {
        if (this.files.length < 1) {
            Toaster.warning('You must select valid files before');
        } else {

            const paths = _.map(this.files, (file: File) => {
                return (file as any).path; // FIXME
            });

            this.clients.map.importFiles(paths);
        }
    }

}
