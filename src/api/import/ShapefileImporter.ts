import * as shapefile from 'shapefile';
import * as path from 'path';
import {AbstractDataImporter} from './AbstractDataImporter';
import {FileFormat} from '../export/FileFormat';


// TODO: Refactor in order to stream data in database

export class ShapefileImporter extends AbstractDataImporter {

    public getSupportedFormat(): FileFormat {
        return FileFormat.KML;
    }

    public async fileToCollection(pathToSourceFile: string, collectionName?: string): Promise<string> {

        const source = await shapefile.open('example.shp');
        const geojson = await source.read();

        const collectionId = collectionName || path.basename(pathToSourceFile);
        await this.services.db.getGeoJsonDao().insertMany(
            collectionId,
            geojson.features,
        );

        return collectionId;
    }

}
