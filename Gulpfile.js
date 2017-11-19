const gulp = require('gulp');
const ts = require('gulp-typescript');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const runElectron = require('gulp-run-electron');
const gulpSync = require('gulp-sync')(gulp);

const tsProject = ts.createProject('./tsconfig.json');

gulp.task('clean', () => {
    return gulp.src('dist/', {read: false}).pipe(clean());
});

gulp.task('compile', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});

gulp.task('sass', () => {
    return gulp.src('./src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('dist'))
});

gulp.task('sync-assets', () => {
    return gulp.src(['./src/**/*', '!./**/*.ts', '!./**/*.scss'])
        .pipe(gulp.dest('dist'));
});

gulp.task('run', () => {
    // see https://www.npmjs.com/package/gulp-run-electron for more options
    return gulp.src('.').pipe(runElectron());
});

gulp.task('build', gulpSync.sync([
    'clean',
    'compile',
    'sass',
    'sync-assets'
]));

gulp.task('start', gulpSync.sync([
    'build',
    'run'
]));

gulp.task('default', ['start']);
