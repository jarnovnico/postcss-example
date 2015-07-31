/* File: gulpfile.js */

var
    postcss = require('gulp-postcss'),
    gulp = require('gulp'),
    gutil = require('gulp-util');
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    jade = require('gulp-jade'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    jadeGlobbing  = require('gulp-jade-globbing'),
    del = require('del'),
    fs = require("fs"),
    processors = [
        require('precss'),
        require('postcss-mixins'),
        require('postcss-simple-vars'),
        require('postcss-nested'),
        require('autoprefixer-core')({ browsers: ['last 2 versions', '> 2%'] })
    ];

// Set up a local server
gulp.task('connect', function() {
    connect.server({
        root: 'build',
        port: 4321
    });
});

// compile jade to html
gulp.task('templates', function() {
    return gulp.src(['src/**/*.jade'])
        .pipe(jade({ pretty: true }))
        .pipe(gulp.dest('build/'));
});

// compile CSS
gulp.task('css', function() {
  return gulp.src('src/assets/styles/**/*.css')
    .pipe(concat('styles.css'))
    .pipe(postcss(processors))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('build/styles/'));
});

// Concat and minify .js files
gulp.task('scripts', function() {
    return gulp.src('src/assets/scripts/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('build/scripts'));
});

// Clean
gulp.task('clean', function(cb) {
  del('build', cb);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('templates', 'css', 'scripts');
});

// Set global 'watch' to true
gulp.task('setWatch', function() {
    global.isWatching = true;
});

// Watch task
gulp.task('watch', ['setWatch', 'templates', 'connect'], function() {

    // Watch .jade files
    gulp.watch('src/**/*.jade', ['templates']);

    // Watch .css files
    gulp.watch('src/assets/styles/**/*.css', ['css']);

    // Watch .js files
    gulp.watch('src/assets/scripts/**/*.js', ['scripts']);
});