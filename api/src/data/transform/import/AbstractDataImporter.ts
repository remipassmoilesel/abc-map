import {IAbcGeojsonFeatureCollection} from '../../AbcGeojson';
import {IDataFormat} from '../dataformat/DataFormat';
import {Readable} from 'stream';

export abstract class AbstractDataImporter {

    public abstract getSupportedFormat(): IDataFormat;

    public abstract toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection>;

    protected bufferToStream(buffer: Buffer): Readable {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }
}

