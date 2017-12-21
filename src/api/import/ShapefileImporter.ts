import * as shapefile from 'shapefile';
import {AbstractDataImporter, IImportedFile} from './AbstractDataImporter';


//TODO Refactor in order directly data in database

export class ShapefileImporter extends AbstractDataImporter {

    public getSupportedExtensions(): string[] {
        return ['.shp'];
    }

    public getGeoJson(pathToSourceFile: string): Promise<IImportedFile> {

        return shapefile.open('example.shp')
            .then((source) => source.read()
                .then(function log(result) {
                    if (result.done) { return; }
                    console.log(result.value);
                    return source.read();
                }))
            .catch((error) => console.error(error.stack));

    }

}
