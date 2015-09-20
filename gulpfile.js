'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),

    stylus = require('gulp-stylus'),
    prefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),
    spritesmith = require('gulp.spritesmith'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;


var path = {
    build: {
        html: 'build/',
        css:  'build/css/',
        js:   'build/js/',
        jsName: 'bundle.js',
        img:  'build/img/'
    },
    src: {
        html:  'src/html/*.html',
        css:   'src/css/main.styl',
        js:    'src/js/main.js',
        sprite:     'src/img/sprite/*.*',
        static:     'src/img/static/*.*'
    },
    watch: {
        html:   'src/html/*.html',
        css:    'src/css/main.styl',
        js:     'src/js/**/*.js',
        sprite:     'src/img/sprite/*.*',
        static:     'src/img/static/*.*'
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
        .transform(reactify)
        .bundle()
        .pipe(source(path.build.jsName))
        .pipe(buffer())
        /* .pipe(uglify()) */
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

gulp.task('sprite:build', function () {
    var spriteData = gulp.src(path.src.sprite).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        imgPath: '../img/sprite.png'
    }));
    spriteData.img.pipe(gulp.dest(path.build.img));
    spriteData.css.pipe(cssmin()).pipe(gulp.dest(path.build.css));
});

gulp.task('static:build', function () {
    gulp.src(path.src.static)
        .pipe(gulp.dest(path.build.img));
}); 

gulp.task('build', [
    'html:build',
    'css:build',
    'sprite:build',
    'static:build',
    'js:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });

    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });

    watch([path.watch.sprite], function(event, cb) {
        gulp.start('sprite:build');
    });

    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });

    watch([path.watch.static], function(event, cb) {
        gulp.start('static:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});


// gulp.task('default', ['build', 'webserver', 'watch']);
gulp.task('default', ['build',  'watch']);
