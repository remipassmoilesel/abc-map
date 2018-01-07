import * as shapefile from 'shapefile';
import {AbstractDataImporter, IImportedFile} from './AbstractDataImporter';
import {FileFormat} from "../export/FileFormat";


// TODO: Refactor in order directly data in database

export class ShapefileImporter extends AbstractDataImporter {

    public getSupportedFormat(): FileFormat {
        return FileFormat.KML;
    }

    public getGeoJson(pathToSourceFile: string): Promise<IImportedFile> {

        return shapefile.open('example.shp')
            .then((source) => source.read()
                .then(function log(result) {
                    if (result.done) {
                        return;
                    }
                    return source.read();
                }))
            .catch((error) => console.error(error.stack));

    }

}
