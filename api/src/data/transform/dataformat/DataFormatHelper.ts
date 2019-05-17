import * as _ from 'lodash';
import {Magic, MAGIC_MIME_TYPE} from 'mmmagic';
import * as path from 'path';
import {DATA_FORMAT_WHITELIST, DataFormats, IDataFormat} from './DataFormat';

export class DataFormatHelper {

    public static async isDataFormatAllowed(data: Buffer, filePath: string): Promise<boolean> {
        const contentFormat: string = await this.inspectContentFormat(data);
        const isContentAllowed: boolean = !!_.find(DATA_FORMAT_WHITELIST, format => contentFormat.startsWith(format));
        const isExtensionAllowed = !!_.find(DataFormats.ALL, format => this.isFileSupported(format, filePath));
        return isContentAllowed && isExtensionAllowed;
    }

    public static inspectContentFormat(data: Buffer): Promise<string> {
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

    public static getMimeType(data: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            const magic = new Magic(MAGIC_MIME_TYPE);
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

}
