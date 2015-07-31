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
    // fs = require("fs"),
    // atImport = require('postcss-import'),
    // mixins = require('postcss-mixins'),
    // simpleVars = require('postcss-simple-vars'),
    // nested = require('postcss-nested'),
    // autoprefixer = require('autoprefixer-core');

    // atImport = require('postcss-import'),
    processors = [
        require('precss'),
        require('postcss-mixins'),
        require('postcss-simple-vars'),
        require('postcss-nested'),
        require('autoprefixer-core')({ browsers: ['last 2 versions', '> 2%'] })
    ];

// css to be processed
// var css = fs.readFileSync("src/styles/style.css", "utf8");

// process css
// gulp.task('import', function() {
//     var output = postcss()
//       .use(atImport())
//       .process(css, {
//         // `from` option is required so relative import can work from input dirname
//         from: "src/styles/style.css"
//       })
//       .css
// });

// gulp.task('import', function() {
//     return gulp.src('src/styles/style.css')
//     .pipe(atImport())
//     .pipe(process(css, {
//         from: 'src/styles/style.css'
//     }))
//     .css;
// })

// gulp.task('css', function () {
//     var processors = [
//         atImport({ from: 'src/styles/style.css' }),
//         mixins,
//         simpleVars,
//         nested,
//         autoprefixer({browsers: ['last 1 version']})
//     ];
//     return gulp.src('src/styles/style.css')
//         .pipe(postcss(processors))
//         .pipe(gulp.dest('dest/styles'));
// });

// gulp.task('css', function () {
//     var postcss = require('gulp-postcss');
//     return gulp.src('src/styles/**/*.css')
//         .pipe( postcss([
//             // require('postcss-import')({ from: 'src/styles/style.css' }),
//             require('postcss-mixins')(),
//             require('postcss-simple-vars')(),
//             require('postcss-nested')(),
//             require('autoprefixer-core')({ browser: ['last 1 version']})
//             ]) )
//         .pipe( gulp.dest('build/') );
// });

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