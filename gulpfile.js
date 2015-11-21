'use strict';

//--Project settings--//
    //gulp load modules
    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        ftp = require('gulp-ftp'),
        watch = require('gulp-watch'),
        prefixer = require('gulp-autoprefixer'),
        uglify = require('gulp-uglify'),
        sass = require('gulp-sass'),
        sourcemaps = require('gulp-sourcemaps'),
        rigger = require('gulp-rigger'),
        cssmin = require('gulp-minify-css'),
        imagemin = require('gulp-imagemin'),
        pngquant = require('imagemin-pngquant'),
        rimraf = require('rimraf'),
        browserSync = require("browser-sync"),
        plumber = require('gulp-plumber'),
        rename = require('gulp-rename'),
        reload = browserSync.reload;

    //project setting
    var settings = {
        //ftp settings
        ftp:{
            host: '',
            user: '',
            pass: '',
            remotePath: '/'
        }
    };

    //gulp set path
    var path = {
        //Path for build
        build: {
            project: 'build/**/*.*', 
            html: 'build/',
            js: 'build/js/',
            css: 'build/css/',
            imgs: 'build/imgs/',
            images: 'build/images/',
            fonts: 'build/fonts/',
        },
        //Path for resources
        src: {
            html: 'src/template/*.html', 
            js: 'src/js/main.js',
            style: 'src/style/main.scss',
            imgs: 'src/imgs/**/*.*',
            images: 'src/images/**/*.*',
            fonts: 'src/fonts/**/*.*'
        },
        //Path for watched files
        watch: {
            html: 'src/template/**/*.html',
            js: 'src/js/**/*.js',
            style: 'src/style/**/*.scss',
            imgs: 'src/imgs/**/*.*',
            images: 'src/images/**/*.*',
            fonts: 'src/fonts/**/*.*'
        },
        clean: './build'
    };

    //server config
    var server_config = {
        server: {
            baseDir: "./build"
        },
        tunnel: false,
        host: 'localhost',
        port: 9000,
        logPrefix: "Frontend_Devil"
    };
//####################//

//--Project tasks--//
    //Template html task
    gulp.task('html:build', function () {
        gulp.src(path.src.html)
            .pipe(plumber())
            .pipe(rigger())
            .pipe(gulp.dest(path.build.html))
            .pipe(reload({stream: true}));
    });

    //Template js task
    gulp.task('js:build', function () {
        gulp.src(path.src.js)
            .pipe(plumber())
            .pipe(rigger())
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(sourcemaps.write('../js', {
                sourceMappingURL: function(file) {
                    return file.relative + '.map';
                }
            }))
            .pipe(gulp.dest(path.build.js))
            .pipe(reload({stream: true}));
    });

    //Template css task
    gulp.task('style:build', function () {
        gulp.src(path.src.style)
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(sass({errLogToConsole: true}))
            .pipe(prefixer())
            .pipe(cssmin())
            .pipe(sourcemaps.write('../css', {
                sourceMappingURL: function(file) {
                    return file.relative + '.map';
                }
            }))
            .pipe(gulp.dest(path.build.css))
            .pipe(reload({stream: true}));
    });

    //Template images task
    gulp.task('imgs:build', function () {
        gulp.src(path.src.imgs)
            .pipe(plumber())
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            }))
            .pipe(gulp.dest(path.build.imgs))
            .pipe(reload({stream: true}));
    });

    //Other images task
    gulp.task('images:build', function () {
        gulp.src(path.src.images)
            .pipe(plumber())
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            }))
            .pipe(gulp.dest(path.build.images))
            .pipe(reload({stream: true}));
    });

    //Template copy fonts
    gulp.task('fonts:build', function() {
        gulp.src(path.src.fonts)
            .pipe(gulp.dest(path.build.fonts))
    });

    //Template watch task
    gulp.task('watch', function(){
        watch([path.watch.html], function(event, cb) {
            gulp.start('html:build');
        });
        watch([path.watch.style], function(event, cb) {
            gulp.start('style:build');
        });
        watch([path.watch.imgs], function(event, cb) {
            gulp.start('imgs:build');
        });
        watch([path.watch.images], function(event, cb) {
            gulp.start('images:build');
        });
        watch([path.watch.js], function(event, cb) {
            gulp.start('js:build');
        });
    });

    //server watch
    gulp.task('webserver', function () {
        browserSync(server_config);
    });

    //Load project on ftp
    gulp.task('send_ftp', function () {
    return gulp.src(path.build.project)
        .pipe(ftp({
            host: settings.ftp.host,
            user: settings.ftp.user,
            pass: settings.ftp.pass,
            remotePath: settings.ftp.remotePath
        }))
        .pipe(gutil.noop());
    });

    //rm temp files
    gulp.task('clean', function (cb) {
        rimraf(path.clean, cb);
    });
//#################//

//--Project builds--//
    //Dev build
    gulp.task('build-dev', [
        'html:build',
        'js:build',
        'style:build',
        'fonts:build',
        'imgs:build',
        'images:build',
        'webserver', 
        'watch'
    ]);

    //js test
    gulp.task('build-js', [
        'js:build',
        'webserver',
        'watch'
    ]);

    //css test
//##################//

gulp.task('default', ['build-dev']);