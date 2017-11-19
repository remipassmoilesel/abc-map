const gulp = require('gulp');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const runElectron = require('gulp-run-electron');
const gulpSync = require('gulp-sync')(gulp);
const webpackStream = require('webpack-stream');
const webpack2 = require('webpack');
const shell = require('gulp-shell');

const webpackConfig = require('./config/webpack.config.gui');
const tsProject = ts.createProject('./tsconfig.json');

gulp.task('clean', () => {
    return gulp.src('dist/', {read: false}).pipe(clean());
});

gulp.task('compile-api', () => {
    let failed = false;
    return tsProject.src()
        .pipe(tsProject())
        .on("error", () => {
            failed = true;
        })
        .on("finish", () => {
            if (failed) {
                console.error('Some errors where found while typescript compilation.');
                process.exit(1);
            }
        })
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

gulp.task('test',
    shell.task([
        './node_modules/.bin/mocha --require source-map-support ./dist/**/*Test.js',
    ])
);

gulp.task('watch', ['build'], ()=>{
    return gulp.watch('src/**/*', ['build']);
});

gulp.task('default', ['start']);
