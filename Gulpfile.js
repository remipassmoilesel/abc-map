const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const sass = require('gulp-sass');
const clean = require('gulp-clean');

gulp.task('clean', () => {
    return gulp.src('dist/', {read: false}).pipe(clean());
});

gulp.task("compile", () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task('sass',() => {
    return gulp.src('./src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'))
});

gulp.task('sync-assets', () => {
    return gulp.src(['./src/**/*', '!./**/*.ts', '!./**/*.scss'])
        .pipe(gulp.dest('dist'));
});


gulp.task('default', ["compile", "sync-assets"]);
