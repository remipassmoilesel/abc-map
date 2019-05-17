import {DocumentConstants} from 'abcmap-shared';
import multer = require('multer');

const storage = multer.memoryStorage();
const uploader = multer({
    storage,
    limits: {
        files: DocumentConstants.MAX_NUMBER_PER_UPLOAD,
        fileSize: DocumentConstants.MAX_SIZE_PER_FILE,
    },
});

export function upload() {
    return uploader.single('file-content');
}
