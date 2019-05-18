import {FeatureHelper, IAbcGeojsonFeature, IAbcGeojsonFeatureCollection} from 'abcmap-shared';
import {IDataFormat} from '../dataformat/DataFormat';
import {Readable} from 'stream';
import {Feature} from 'geojson';
import * as _ from 'lodash';
import uuid = require('uuid');

export abstract class AbstractDataImporter {

    public abstract getSupportedFormat(): IDataFormat;

    public abstract toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection>;

    protected featuresToAbcFeatures(features: Feature[]): IAbcGeojsonFeature[] {
        return _.map(features, (original) => {
            const newFeature = FeatureHelper.toAbcFeature(original);
            newFeature.id = uuid.v4();
            return newFeature;
        });
    }

    protected bufferToStream(buffer: Buffer): Readable {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }
}

