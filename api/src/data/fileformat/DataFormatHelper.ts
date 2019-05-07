import * as _ from 'lodash';
import {Magic} from 'mmmagic';
import * as path from 'path';
import {IDataFormat} from './DataFormat';

export class DataFormatHelper {

    public static getDataFormat(data: Buffer): Promise<IDataFormat> {
        return new Promise((resolve, reject) => {
            const magic = new Magic();
            magic.detect(data, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(this.magicOutputToDataFormat(result));
            });
        });
    }

    public static isSupported(format1: IDataFormat, format2: IDataFormat): boolean {
        return _.intersection(format1.extensions, format2.extensions).length > 0;
    }

    public static isFileSupported(format: IDataFormat, filePath: string): boolean {
        const normalizedExtension = path.extname(filePath).substr(1).toLowerCase();
        return _.includes(format.extensions, normalizedExtension);
    }

    private static magicOutputToDataFormat(result: string) {
        return undefined;
    }
}
