const path = require('path');

const project = path.join(__dirname, '..', '..');
const gui = path.join(project, 'gui');
const api = path.join(project, 'api');
const shared = path.join(project, 'shared');

const config = {
    paths: {
        project,
        gui,
        api,
        shared,
    }
};

module.exports = {
    config
};
