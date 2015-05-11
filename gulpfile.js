var gulp = require('gulp');

var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
// var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');


gulp.task('css', function() {
    return gulp.src('./styles/*.less')
        .pipe(less())
        .pipe(gulp.dest('./styles/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCss())
        .pipe(gulp.dest('./styles/'));
});


gulp.task('js', function() {

    gulp.src('./src/*.js')
        // .pipe(uglify())
        .pipe(gulp.dest('./build'));

    gulp.src('./src/public/scripts/*.js')
        // .pipe(uglify())
        .pipe(gulp.dest('./build/public/scripts'));

    gulp.src('./src/game_objects/*.js')
        // .pipe(uglify())
        .pipe(gulp.dest('./build/game_objects/'));
});

gulp.task('default', ['css'], function() {

    // gulp.watch('./src/style/css/style.less', function() {
    //  gulp.run('css');
    // });

    // gulp.watch('./src/**/*.js', function() {
    //  gulp.run('js');
    // });

    //instead of watching files in default
    gulp.start('css', 'js');

});

gulp.task('watch', function() {

    gulp.watch('./styles/*.less', ['css']);
    // gulp.watch('./src/**/*.js' , ['js']);

    livereload.listen();
    gulp.watch(['./**']).on('change', livereload.changed);
});