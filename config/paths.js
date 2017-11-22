const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

module.exports = {
    PROJECT_ROOT: projectRoot,
    MAIN_TS_PATH: path.join(projectRoot, 'src', 'gui', 'main.ts'),
    INDEX_SRC: path.resolve(projectRoot, 'src', 'gui', 'views', 'app', 'index.html'),
    INDEX_DEST: path.resolve(projectRoot, 'dist', 'gui', 'index.html'),
    PUBLIC_PATH: path.resolve(projectRoot, 'dist', 'gui') + '/', // last / mandatory for public path
    DIST_ROOT: path.resolve(projectRoot, 'dist'),
    GUI_SOURCE_ROOT: path.resolve(projectRoot, 'src', 'gui'),
    GUI_BUILD_ROOT: path.join(projectRoot, 'dist', 'gui'),
    NODE_MODULES_ROOT: path.resolve(projectRoot, 'node_modules')
};