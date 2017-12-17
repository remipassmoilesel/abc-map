import Component from 'vue-class-component';
import {Clients} from "../../lib/clients/Clients";
import * as _ from "lodash";
import * as path from "path";
import {Toaster} from "../../lib/Toaster";
import {AbstractUiComponent} from "../AbstractUiComponent";
import './style.scss';

const authorizedExtensions = ['.gpx', '.kml'];

@Component({
    template: require('./template.html'),
})
export class DataImporterComponent extends AbstractUiComponent {

    public componentName: string = "Data importer";
    public componentDescription: string = "Allow to import data from various sources.";
    public componentTagName: string = "data-importer";

    public clients: Clients;
    public files: File[] = [];

    public mounted() {
    }

    public onDragOver(event) {
        event.stopPropagation();
        event.preventDefault();

        console.log(event)
    }

    public onDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        this.checkAndRegisterFiles(event.dataTransfer.files);

        console.log(this.files);
        Toaster.info('Not implemented, coming soon...');
    }

    public selectFiles(event) {

        const filesToCheck: File[] = event.target.files;
        this.checkAndRegisterFiles(filesToCheck);
    }

    private checkAndRegisterFiles(filesToCheck: File[]) {
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
            this.files = [];
        }
    }

}
