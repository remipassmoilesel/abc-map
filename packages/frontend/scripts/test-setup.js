const sinon = require('sinon');

global.URL.createObjectURL = sinon.stub();
window.URL.createObjectURL = sinon.stub();

// FIXME: Remove after NodeJS upgrade
global.fetch = sinon.stub();
window.fetch = sinon.stub();
