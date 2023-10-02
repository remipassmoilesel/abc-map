const sinon = require('sinon');
const ResizeObserver = require('resize-observer-polyfill');

global.URL.createObjectURL = sinon.stub();
global.URL.revokeObjectURL = sinon.stub();

global.fetch = sinon.stub();
window.fetch = sinon.stub();

global.ResizeObserver = ResizeObserver;
window.ResizeObserver = ResizeObserver;

require('fake-indexeddb/auto');
