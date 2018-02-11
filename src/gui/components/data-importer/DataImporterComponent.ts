import Component from 'vue-class-component';
import {Toaster} from '../../lib/Toaster';
import {AbstractUiComponent} from '../AbstractUiComponent';
import * as $ from 'jquery';
import './style.scss';

@Component({
    template: require('./template.html'),
})
export class DataImporterComponent extends AbstractUiComponent {

    public componentName: string = 'Data importer';
    public componentDescription: string = 'Allow to import data from various sources.';
    public componentTagName: string = 'data-importer';
    public componentIsSearchable: boolean = true;

    public files: File[] = [];

    public onDragOver(event: any) {
        event.stopPropagation();
        event.preventDefault();

        // console.log(event)
    }

    public onDrop(event: any) {
        event.stopPropagation();
        event.preventDefault();

        this.checkAndRegisterFiles(event.dataTransfer.files);
    }

    public selectFiles(event: any) {
        const filesToCheck: File[] = event.target.files;
        this.checkAndRegisterFiles(filesToCheck);
    }

    private checkAndRegisterFiles(filesToCheck: File[]) {
        this.files = this.clients.map.checkFilesForImport(filesToCheck);
    }

    public async importFiles() {
        if (this.files.length < 1) {
            Toaster.warning('You must select valid files before');
            $('#data-importer-file').click();
        } else {
            await this.clients.map.importFiles(this.files);
            this.files = [];
        }
    }

}
