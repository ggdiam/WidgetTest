var gulp        = require('gulp'),
    browserSync = require("browser-sync"),
    reload      = browserSync.reload,
    minifyCSS   = require('gulp-minify-css'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass');

//NODE_ENV=DEV

var _ENV_ = process.env.NODE_ENV || '';

gulp.task('build', ['build-sass', 'build-js']);

gulp.task('build-sass', function () {
    gulp.src('./widget/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build'))
        .pipe(reload({stream: true}));
});

gulp.task('build-js', function () {
    gulp.src('./widget/js/**/*.js')
        .pipe(gulp.dest('./build'))
        .pipe(reload({stream: true}));
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: ["./some_site", "./build"]
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('watch', function () {
    gulp.watch([
        './some_site/*.*'
    ], ['bs-reload']);

    gulp.watch([
        './widget/scss/**/*.scss'
    ], ['build-sass']);

    gulp.watch([
        './widget/js/**/*.js'
    ], ['build-js']);
});

gulp.task('build-prod', function () {
    gulp.src('./widget/scss/*.scss')
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build'));

    gulp.src('./widget/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

if (_ENV_ == 'DEV') {
    gulp.task('default', ['build', 'watch', 'browser-sync']);
}
else {
    gulp.task('default', ['build-prod']);

}
