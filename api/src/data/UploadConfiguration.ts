import {DocumentConstants} from 'abcmap-shared';
import multer = require('multer');

const storage = multer.memoryStorage();
const uploader = multer({
    storage,
    limits: {
        files: DocumentConstants.MAX_FILES_PER_UPLOAD,
        fileSize: DocumentConstants.MAX_SIZE_PER_FILE,
    },
});

export function upload() {
    return uploader.array('file', DocumentConstants.MAX_FILES_PER_UPLOAD);
}
