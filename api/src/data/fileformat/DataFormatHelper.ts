import * as _ from 'lodash';
import {Magic} from 'mmmagic';
import * as path from 'path';
import {DATA_FORMAT_WHITELIST, IDataFormat} from './DataFormat';

export class DataFormatHelper {

    public static async isDataFormatAllowed(data: Buffer): Promise<boolean> {
        const detectedFormat: string = await this.getDataFormat(data);
        return !!_.find(DATA_FORMAT_WHITELIST, format => detectedFormat.startsWith(format));
    }

    public static getDataFormat(data: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            const magic = new Magic();
            magic.detect(data, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
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
