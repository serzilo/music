'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),

    stylus = require('gulp-stylus'),
    prefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;


var path = {
    build: {
        html: 'build/',
        css:  'build/css/',
        js:   'build/js/',
        jsName: 'bundle.js'
    },
    src: {
        html:  'src/html/*.html',
        css:   'src/css/main.styl',
        js:    'src/js/main.js'
    },
    watch: {
        html:   'src/html/*.html',
        css:    'src/css/main.styl',
        js:     'src/js/*.js'
    }
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Local host"
};


gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});


gulp.task('js:build', function () {
    return browserify(path.src.js, {debug: true})
        .bundle()
        .pipe(source(path.build.jsName))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));

   /*
    gulp.src(path.src.js)
        .pipe(gulp.dest(path.build.js))
    */
});

gulp.task('css:build', function () {
    gulp.src(path.src.css)
        .pipe(stylus())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('build', [
    'html:build',
    'css:build',
    'js:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });

    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });

    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('default', ['build', 'webserver', 'watch']);
