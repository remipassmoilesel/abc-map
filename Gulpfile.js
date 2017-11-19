const gulp = require('gulp');
const ts = require('gulp-typescript');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const runElectron = require('gulp-run-electron');
const gulpSync = require('gulp-sync')(gulp);
const webpackStream = require('webpack-stream');
const webpack2 = require('webpack');

const webpackConfig = require('./config/webpack.config.gui');
const tsProject = ts.createProject('./tsconfig.json');

gulp.task('clean', () => {
    return gulp.src('dist/', {read: false}).pipe(clean());
});

gulp.task('compile-api', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});

gulp.task('compile-gui', () => {
    return gulp.src('src/gui/index.ts')
        .pipe(webpackStream(webpackConfig, webpack2))
        .pipe(gulp.dest('dist/gui'));
});

gulp.task('sync-assets', () => {
    return gulp.src(['./src/resources/**/*'])
        .pipe(gulp.dest('dist/resources'));
});

gulp.task('run', () => {
    // see https://www.npmjs.com/package/gulp-run-electron for more options
    return gulp.src('.').pipe(runElectron());
});

gulp.task('build', gulpSync.sync([
    'clean',
    'compile-api',
    'compile-gui',
    'sync-assets',
]));

gulp.task('start', gulpSync.sync([
    'build',
    'run'
]));

gulp.task('default', ['start']);
