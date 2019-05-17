import multer = require('multer');

const storage = multer.memoryStorage();
const uploader = multer({
    storage,
    limits: {
        fileSize: 1e+7, // 10 mb
    },
});

export function upload() {
    return uploader.single('file-content');
}
