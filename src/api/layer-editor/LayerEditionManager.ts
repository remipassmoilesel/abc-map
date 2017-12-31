import * as os from 'os';
import * as uuid from 'uuid';
import * as path from 'path';
import {LayerExporter} from './LayerExporter';
import {LayerExportFormat} from './LayerExportFormat';
import {Logger} from '../dev/Logger';

const logger = Logger.getLogger('LayerEditionManager');

export class LayerEditionManager {

    public editedLayerIds: string[] = [];
    private layerExporter: LayerExporter;

    constructor() {
        this.layerExporter = new LayerExporter();
    }

    public isEdited(layerId: string) {
        return this.editedLayerIds.indexOf(layerId) !== -1;
    }

    public async edit(layerId: string, targetFormat: LayerExportFormat): Promise<void> {

        // TODO:
        // export layer as a spreadsheet in tmp dir
        const spreadsheetPath = path.join(os.tmpdir(), layerId + uuid.v4() + '.xslx');
        await this.layerExporter.exportLayer(layerId, spreadsheetPath, targetFormat);

        // open it with default application
        // watch spreadsheet and import modification
        // REMINDER: several layers can be modified at the same time

    }
}
