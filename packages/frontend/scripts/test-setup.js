const sinon = require('sinon');

global.URL.createObjectURL = sinon.stub();
window.URL.createObjectURL = sinon.stub();

global.fetch = sinon.stub();
window.fetch = sinon.stub();
