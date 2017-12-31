import * as _ from 'lodash';
import * as path from 'path';
import {Ipc, IpcHandler} from '../../../api/ipc/Ipc';
import {TileLayer} from '../../../api/entities/layers/TileLayer';
import {DbSubjects, IpcEventBus, MapSubjects} from '../../../api/ipc/IpcSubject';
import {handleRejection} from './clientUtils';
import {GeocodingResult} from '../../../api/entities/GeocodingResult';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';
import {Toaster} from '../Toaster';


const authorizedImportExtensions = ['.shp', '.gpx', '.kml'];


export class MapClient {

    private ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
    }

    public onMapEvent(handler: IpcHandler): void {
        return this.ipc.listen(IpcEventBus.MAP, handler);
    }

    public getDefaultTileLayers(): Promise<TileLayer[]> {
        return this.ipc.send(MapSubjects.GET_WMS_DEFAULT_LAYERS).catch(handleRejection);
    }

    public geocode(query: string): Promise<GeocodingResult[]> {
        return this.ipc.send(MapSubjects.GEOCODE, {data: query}).catch(handleRejection);
    }

    public getGeojsonDataForLayer(layer: AbstractMapLayer): Promise<L.Layer> {
        return this.ipc.send(DbSubjects.GET_LAYER_GEOJSON_DATA, {data: layer.id});
    }

    public importFiles(files: File[]) {
        const paths = _.map(files, (file: File) => {
            return (file as any).path; // FIXME
        });

        return this.ipc.send(MapSubjects.IMPORT_FILES, {data: paths}).catch(handleRejection);
    }

    public checkFilesForImport(filesToCheck: File[]): File[] {

        const validFiles: File[] = [];
        _.forEach(filesToCheck, (file: File) => {
            if (_.includes(authorizedImportExtensions, path.extname(file.name))) {
                validFiles.push(file);
            }
        });

        if (validFiles.length < 1) {
            Toaster.error('No valid files found in selection');
        } else if (filesToCheck.length > validFiles.length) {
            Toaster.error('Some files where not imported because they are invalid');
        }

        return validFiles;
    }

    public checkAndImportFiles(files: File[]) {
        const validFiles = this.checkFilesForImport(files);
        return this.importFiles(validFiles);
    }

    public editLayerAsSpreadsheet(layerId: string) {
        return this.ipc.send(MapSubjects.EDIT_LAYER_AS_SPREADSHEET, {
            data: {
                layerId,
            },
        });
    }
}
