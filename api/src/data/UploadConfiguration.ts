import multer = require('multer');
import {IApiConfig} from '../IApiConfig';

export function upload(config: IApiConfig) {

    const storage = multer.memoryStorage();
    const uploader = multer({
        storage,
        limits: {
            files: config.fileUpload.maxFilesPerUpload,
            fileSize: config.fileUpload.maxSizePerFile,
        },
    });

    return uploader.array('file', config.fileUpload.maxFilesPerUpload);

}
