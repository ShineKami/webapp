import gulp from 'gulp';
import prefixer from 'gulp-autoprefixer';
import uglify from 'gulp-uglify';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import fileinclude from 'gulp-file-include';
import cssclean from 'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import plumber from 'gulp-plumber';
import htmlmin from 'gulp-htmlmin';
import del from 'del';

//project setting
const settings = {
    prjdir: 'dist/',
    srcdir: 'src',
    prjext: '+(tpl|html|php|js|css|scss|png|jpg|jpeg|gif|ttf|woff)',
    clean: 'dist'
}

//gulp set path
const path = {
    build: {
        project: settings.prjdir,
        tpl: settings.prjdir,
        js: settings.prjdir+'assets/js/',
        css: settings.prjdir+'assets/css/',
        imgs: settings.prjdir+'assets/imgs/',
        fonts: settings.prjdir+'assets/fonts/'
    },
    src: {
        tpl: settings.srcdir+'/template/**/*.'+settings.prjext,
        js: settings.srcdir+'/js/*.'+settings.prjext,
        style: settings.srcdir+'/style/*.'+settings.prjext,
        imgs: settings.srcdir+'/imgs/**/*.'+settings.prjext,
        fonts: settings.srcdir+'/fonts/**/*.'+settings.prjext
    },
    watch: {
        tpl: settings.srcdir+'/template/**/*.'+settings.prjext,
        js: settings.srcdir+'/js/**/*.'+settings.prjext,
        style: settings.srcdir+'/style/**/*.'+settings.prjext,
        imgs: settings.srcdir+'/imgs/**/*.'+settings.prjext,
        fonts: settings.srcdir+'/fonts/**/*.'+settings.prjext
    },
    clean: settings.clean
}

//Template tasks
const tplTask = () => gulp.src(path.src.tpl)
    .pipe(plumber())
    .pipe(fileinclude())
    .pipe(htmlmin({
        collapseWhitespace: true,
        ignoreCustomFragments: [/<\?[\s\S]*?\?>/]}
    ))
    .pipe(gulp.dest(path.build.tpl));
export const tplDevTask = () => gulp.src(path.src.tpl)
    .pipe(plumber())
    .pipe(fileinclude())
    .pipe(gulp.dest(path.build.tpl));

//JS tasks
const jsTask = () => gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(fileinclude())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('../js', {
        sourceMappingURL: function(file) {
            return file.relative + '.map';
        }
    }))
    .pipe(gulp.dest(path.build.js));
export const jsDevTask = () => gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(fileinclude())
    .pipe(gulp.dest(path.build.js));

//Style tasks
const styleTask = () => gulp.src(path.src.style)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({errLogToConsole: true}))
    .pipe(prefixer())
    .pipe(cssclean({debug: true}, function(details) {
        console.log(details.name + ': ' + details.stats.originalSize);
        console.log(details.name + ': ' + details.stats.minifiedSize);
    }))
    .pipe(sourcemaps.write('../css', {
        sourceMappingURL: function(file) {
            return file.relative + '.map';
        }
    }))
    .pipe(gulp.dest(path.build.css));
export const styleDevTask = () => gulp.src(path.src.style)
    .pipe(plumber())
    .pipe(sass({errLogToConsole: true, includePaths: require('node-normalize-scss').includePaths}))
    .pipe(prefixer())
    .pipe(gulp.dest(path.build.css));

//Images tasks
const imgsTask = () => gulp.src(path.src.imgs)
    .pipe(plumber())
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.build.imgs));
export const imgsDevTask = () => gulp.src(path.src.imgs)
    .pipe(plumber())
    .pipe(gulp.dest(path.build.imgs));

//Common tasks
const watchFiles = () => {
    gulp.watch(path.watch.tpl, gulp.parallel(tplDevTask));
    gulp.watch(path.watch.js, gulp.parallel(jsDevTask));
    gulp.watch(path.watch.style, gulp.parallel(styleDevTask));
    gulp.watch(path.watch.imgs, gulp.parallel(imgsDevTask));
    gulp.watch(path.watch.fonts, gulp.parallel(fontsTask));
};
const fontsTask = () => gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
const copyVendorTask = () => gulp.src(path.src.fonts).pipe(gulp.dest(path.build.vendor));
export const clean = () => del([ path.clean ]);

//Global tasks
export const buildDev = gulp.series(clean, gulp.parallel(tplDevTask, jsDevTask, styleDevTask, imgsDevTask, fontsTask), watchFiles);
export const buildRelease = gulp.series(clean, gulp.parallel(tplTask, jsTask, styleTask, imgsTask, fontsTask));

export default buildDev;