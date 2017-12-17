const gulp = require('gulp');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const runElectron = require('gulp-run-electron');
const gulpSync = require('gulp-sync')(gulp);
const webpackStream = require('webpack-stream');
const webpack2 = require('webpack');
const chalk = require('chalk');
const shell = require('gulp-shell');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');

const log = (prefix, message, color) => {
    color = color || 'blue';
    console.log(chalk[color](`[ ${prefix} ] ${message}`));
};

const webpackGuiConfig = require('./config/webpack.config.gui');
const tsProject = ts.createProject('./tsconfig.json');

gulp.task('clean', () => {
    return gulp.src('dist/', {read: false}).pipe(clean());
});

gulp.task('build-api', () => {
    let failed = false;
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .on("error", () => {
            failed = true;
        })
        .on("finish", () => {
            if (failed) {
                log('BUILD-API', 'Some errors where found during build.', 'red');
                // process.exit(1);
            }
        })
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-gui', () => {
    let failed = false;
    return gulp.src('src/gui/index.ts')
        .pipe(webpackStream(webpackGuiConfig, webpack2))
        .on("error", () => {
            failed = true;
        })
        .on("finish", () => {
            if (failed) {
                log('BUILD-GUI', 'Some errors where found during build.', 'red');
                // process.exit(1);
            }
        })
        .pipe(gulp.dest('dist/gui'));
});

gulp.task('run', () => {
    // see https://www.npmjs.com/package/gulp-run-electron for more options
    let failed = false;
    return gulp.src('.')
        .pipe(runElectron())
        .on("error", (e) => {
            failed = true;
        })
        .on("finish", () => {
            if (failed) {
                log('ELECTRON', `Some errors where found during launch.`, 'red');
                // process.exit(1);
            }
        });
});

gulp.task('test-api',
    shell.task([
        './node_modules/.bin/mocha --require source-map-support/register ./dist/api/tests/**/*Test.js',
    ], {ignoreErrors: true})
);

gulp.task('build', gulpSync.sync([
    'clean',
    'build-api',
    'build-gui',
]));

gulp.task('start', gulpSync.sync([
    'build',
    'run',
]));

gulp.task('watch-api', ['build'], () => {
    return gulp.watch('src/api/**/*', ['build-api']);
});

gulp.task('watch-gui', ['build'], () => {
    return gulp.watch('src/gui/**/*', ['build-gui']);
});

gulp.task('watch', ['watch-gui', 'watch-api']);
gulp.task('default', ['start']);
