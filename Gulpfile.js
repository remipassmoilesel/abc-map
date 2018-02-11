const gulp = require('gulp');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const runElectron = require('gulp-run-electron');
const gulpSync = require('gulp-sync')(gulp);
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const chalk = require('chalk');
const shell = require('gulp-shell');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');
const WebpackDevServer = require('webpack-dev-server');

const log = (prefix, message, color) => {
    color = color || 'blue';
    console.log(chalk[color](`[ ${prefix} ] ${message}`));
};

const webpackProdConfig = require('./config/webpack.config.prod');
const webpackDevConfig = require('./config/webpack.config.dev');
const tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', ['start']);

gulp.task('start', gulpSync.sync([
    'build',
    'run',
]));

gulp.task('start-dev', gulpSync.sync([
    'build-api',
    'dev-server',
    'run',
]));

gulp.task('build', gulpSync.sync([
    'clean',
    'build-api',
    'build-gui',
]));

gulp.task('run', () => {
    // see https://www.npmjs.com/package/gulp-run-electron for more options
    let failed = false;
    return gulp.src('.')
        .pipe(runElectron())
        .on('error', (e) => {
            failed = true;
        })
        .on('finish', () => {
            if (failed) {
                log('ELECTRON', `Some errors where found during launch.`, 'red');
                // process.exit(1);
            }
        });
});

gulp.task('build-api', () => {
    let failed = false;
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .on('error', () => {
            failed = true;
        })
        .on('finish', () => {
            if (failed) {
                log('BUILD-API', 'Some errors where found during build.', 'red');
                // process.exit(1);
            }
        })
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch-api', ['build-api'], () => {
    return gulp.watch('src/api/**/*', ['build-api']);
});

gulp.task('build-gui', () => {
    let failed = false;
    return gulp.src('src/gui/index.ts')
        .pipe(webpackStream(webpackProdConfig, webpack))
        .on('error', () => {
            failed = true;
        })
        .on('finish', () => {
            if (failed) {
                log('BUILD-GUI', 'Some errors where found during build.', 'red');
                // process.exit(1);
            }
        })
        .pipe(gulp.dest('dist/gui'));
});

gulp.task('clean', () => {
    return gulp.src('dist/', {read: false}).pipe(clean());
});

gulp.task('test-api',
    shell.task([
        './node_modules/.bin/mocha --require source-map-support/register ./dist/api/tests/**/*Test.js',
    ], {ignoreErrors: true})
);

gulp.task('dev-server', () => {

    const compiler = webpack(webpackDevConfig);
    const devServer = new WebpackDevServer(compiler, webpackDevConfig.devServer);
    const host = webpackDevConfig.devServer.host;
    const port = webpackDevConfig.devServer.port;

    devServer.listen(port, host, (err) => {
        if (err) throw err;
    });

    // wait until compilation is done before resolve
    return new Promise((resolve, reject) => {
        compiler.plugin('done', (stats) => {
            stats = stats.toJson();

            if (stats.errors && stats.errors.length > 0) {
                reject(new Error(stats.errors));
                return;
            }

            resolve();
        });
    });


});

