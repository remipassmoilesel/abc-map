const path = require('path');

const root = path.join(__dirname, '..', '..');
const gui = path.join(root, 'gui');
const api = path.join(root, 'api');
const shared = path.join(root, 'shared');
const databases = path.join(root, 'deployment/databases');

const config = {
    paths: {
        root,
        gui,
        api,
        shared,
        databases
    }
};

module.exports = {
    config
};
