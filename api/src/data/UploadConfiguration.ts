import multer = require('multer');

const storage = multer.memoryStorage();
const uploader = multer({storage});

export function upload() {
    return uploader.single('file-content');
}
