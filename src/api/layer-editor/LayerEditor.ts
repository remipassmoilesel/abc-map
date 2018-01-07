// tslint:disable:no-var-requires
import * as os from 'os';
import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs-extra';
import {Logger} from '../dev/Logger';
import {IServicesMap} from '../services/IServiceMap';
import {ExportFormat} from '../export/ExportFormat';
import {DataExporterFinder} from '../export/DataExporterFinder';
import {DataImporterFinder} from '../import/DataImporterFinder';
import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';

const opn = require('opn');
const logger = Logger.getLogger('LayerEditionManager');

interface IWatchedFile {
    path: string;
    watcher: any;
}

export class LayerEditor extends AbstractServiceConsumer {

    public static getTempPath(prefix: string, exportFormat: ExportFormat): string {
        return path.join(os.tmpdir(), `${prefix}_${uuid.v4()}.${exportFormat.extension}`);
    }

    private importerFinder: DataImporterFinder;
    private editedLayerIds: string[] = [];
    private watchers: IWatchedFile[] = [];
    private exporterFinder: DataExporterFinder;

    constructor(services: IServicesMap){
        super();
        this.setServicesMap(services);
    }

    public setServicesMap(services: IServicesMap) {
        super.setServicesMap(services);
        this.exporterFinder = new DataExporterFinder(services);
        this.importerFinder = new DataImporterFinder(services);
    }

    public isEdited(layerId: string) {
        return this.editedLayerIds.indexOf(layerId) !== -1;
    }

    public async edit(layerId: string, targetFormat: ExportFormat): Promise<void> {

        const exportFormat = targetFormat || ExportFormat.XLSX;

        const workbookPath = LayerEditor.getTempPath(layerId, exportFormat);
        const workbookExporter = this.exporterFinder.getInstanceForFormat(exportFormat);

        await workbookExporter.exportCollection(layerId, workbookPath, exportFormat);
        this.editedLayerIds.push(layerId);

        // open it with default application
        try {
            await opn(workbookPath);
        } catch (e) {
            // TODO: send a message to gui
            logger.error(e);
        }

        // watch spreadsheet and import modification
        this.watchFile(workbookPath);
    }

    private watchFile(workbookPath: string) {
        const watcher = fs.watchFile(workbookPath, (eventType, filename) => {
            console.log('eventType');
            console.log(eventType);
            console.log('filename');
            console.log(filename);
        });

        this.watchers.push({path: workbookPath, watcher});
    }
}
