var gulp = require('gulp'),
    sass = require('gulp-sass');

gulp.task('build-sass', function () {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function () {
    gulp.watch([
        './scss/**/*.scss'
    ], ['build-sass'])
        .on('change', function (file) {

        });
});

gulp.task('default', ['build-sass', 'watch']);
