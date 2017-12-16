// Karma configuration
// Generated on Sat Dec 16 2017 15:35:28 GMT+0100 (CET)

const webpackConfig = require('./webpack.config.gui');

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'sinon'],


        // list of files / patterns to load in the browser
        files: [
            // DO NOT UNCOMMENT
            // Electron 1.7.9 (Node 7.9.0) ERROR
            // Uncaught RangeError: Maximum call stack size exceeded
            // at node_modules/mocha/mocha.js:1
            // 'src/gui/**/*.ts',
            'src/tests/gui/**/*.ts',
        ],

        // DEV: `useIframe: false` is for launching a new window instead of using an iframe
        // In Electron, iframes don't get `nodeIntegration` priveleges yet windows do
        client: {
            useIframe: false
        },

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/gui/**/*.ts': ['webpack', 'sourcemap', 'electron'],
            'src/tests/gui/**/*.ts': ['webpack', 'sourcemap', 'electron'],
        },

        webpack: webpackConfig,

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec'],


        // web server port
        port: 9876,

        // Can fix problem of error: Chrome 62.0.3202 (Linux 0.0.0): Executed 0 of 0 ERROR (0.007 secs / 0 secs)
        // Typescript files are served with mpeg mimetype so they are not executed
        mime: {
            'text/x-typescript': ['ts', 'tsx'],
        },


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Electron'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
};
