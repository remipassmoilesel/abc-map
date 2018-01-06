import * as os from 'os';
import * as uuid from 'uuid';
import * as path from 'path';
import {Logger} from '../dev/Logger';
import {IServicesMap} from '../services/IServiceMap';
import {ExportFormat} from '../export/ExportFormat';
import {LayerExporterFinder} from '../export/LayerExporterFinder';

const logger = Logger.getLogger('LayerEditionManager');

export class LayerEditionService {

    public editedLayerIds: string[] = [];
    private services: IServicesMap;
    private exporterFinder: LayerExporterFinder;

    public setServiceMap(services: IServicesMap) {
        this.services = services;
        this.exporterFinder = new LayerExporterFinder();
        this.exporterFinder.setServiceMap(services);
    }

    public isEdited(layerId: string) {
        return this.editedLayerIds.indexOf(layerId) !== -1;
    }

    public async edit(layerId: string, targetFormat: ExportFormat): Promise<void> {

        // TODO:
        // export layer as a spreadsheet in tmp dir

        const exportFormat = targetFormat || ExportFormat.XLSX;

        const spreadsheetPath = path.join(os.tmpdir(), `${layerId + uuid.v4()}.${exportFormat.extension}`);
        const workbookExporter = this.exporterFinder.getInstanceForFormat(exportFormat);
        await workbookExporter.exportLayer(layerId, spreadsheetPath, exportFormat);

        // open it with default application
        // watch spreadsheet and import modification
        // REMINDER: several layers can be modified at the same time

    }
}
