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
    jadeInheritance = require('gulp-jade-inheritance'),
    changed = require('gulp-changed'),
    cached = require('gulp-cached'),
    gulpif = require('gulp-if'),
    plumber = require('gulp-plumber'),
    filter = require('gulp-filter'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    processors = [
        require('precss'),
        require('postcss-mixins'),
        require('postcss-simple-vars'),
        require('postcss-nested'),
        require('autoprefixer-core')({ browsers: ['last 2 versions', '> 2%'] }),
        require('postcss-neat'),
        require("postcss-custom-media"),
        require('postcss-media-minmax')
    ];

// Don't break watch on error
var onError = function (err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
};

// Set up a local server
gulp.task('connect', function() {
    connect.server({
        root: 'build',
        port: 4321,
        livereload: true
    });
});

// compile jade to html
gulp.task('templates', function() {
    return gulp.src(['src/**/*.jade'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(changed('build', {extension: '.html'}))
        .pipe(gulpif(global.isWatching, cached('jade')))
        .pipe(jadeInheritance({basedir: 'src'}))
        .pipe(filter(function (file) {
            return !/\/_/.test(file.path) && !/^_/.test(file.relative);
        }))
        .pipe(jade({ pretty: true }))
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload());
});

// compile CSS
gulp.task('css', function() {
  return gulp.src('src/assets/styles/**/*.css')
    .pipe(plumber({errorHandler: onError}))
    .pipe(concat('styles.css'))
    .pipe(postcss(processors))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('build/styles/'))
    .pipe(connect.reload());
});

// Concat and minify .js files
gulp.task('scripts', function() {
    return gulp.src('src/assets/scripts/**/*.js')
        .pipe(plumber({errorHandler: onError}))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('build/scripts'))
        .pipe(connect.reload());
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