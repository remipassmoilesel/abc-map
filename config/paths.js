const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const sourceRoot = path.resolve(projectRoot, 'src');
const guiSourceRoot = path.resolve(sourceRoot, 'gui');
const guiPublicDirRoot = path.resolve(guiSourceRoot, 'public');

const buildRoot = path.resolve(projectRoot, 'dist');
const guiBuildRoot = path.resolve(buildRoot, 'gui');

module.exports = {
    PROJECT_ROOT: projectRoot,
    GUI_MAIN_PATH: path.resolve(guiSourceRoot, 'main.ts'),
    PUBLIC_DIR: guiPublicDirRoot,
    INDEX_SRC: path.resolve(guiPublicDirRoot, 'index.html'),
    INDEX_DEST: path.resolve(guiBuildRoot, 'index.html'),
    PUBLIC_PATH: path.resolve(guiBuildRoot) + '/', // last / mandatory for public path
    DIST_ROOT: buildRoot,
    GUI_SOURCE_ROOT: guiSourceRoot,
    GUI_BUILD_ROOT: guiBuildRoot,
    NODE_MODULES_ROOT: path.resolve(projectRoot, 'node_modules'),
    JS_BUILD_NAME: 'build.js'
};