/**
 * Created by Vital on 26.08.2015.
 */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    prettify = require('gulp-prettify'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-rimraf'),
    useref = require('gulp-useref'),
    jade = require('gulp-jade'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    ftp = require('vinyl-ftp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    plumber = require('gulp-plumber'),
    wiredep = require('wiredep').stream;

// bower
gulp.task('wiredep', function () {
    gulp.src('./app/jade/**/*.jade')
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('./app/jade/'))
});

// server
gulp.task('server', ['jade'], function () {
    browserSync({
        notify: false,
        port: 9000,
        //proxy: 'http://watermark.loc/'
        server:{
            baseDir: 'app'
        }
    });
});

// jade
gulp.task('jade', function() {
    gulp.src('./app/jade/*.jade')
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(prettify({indent_size: 2}))
        .pipe(gulp.dest('./app/'))
        .pipe(reload({stream: true}));
});

// sass
gulp.task('sass', function() {
    return gulp.src('./app/scss/*.scss')
        .pipe(plumber())
        .pipe(sass({
            noCache: true,
            style: "expanded",
            lineNumbers: true,
            errLogToConsole: true
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: false
        }))
        .pipe(gulp.dest('./app/css'))
        .pipe(reload({stream: true}));
});

// watcher
gulp.task('watch', function () {
    gulp.watch('./app/jade/**/*.jade', ['jade']);
    gulp.watch('bower.json', ['wiredep']);
    gulp.watch('./app/scss/*.scss', ['sass']);
    gulp.watch([
        './app/js/**/*.js',
        './app/*.html',
        './app/css/*.css',
        './app/php/**/*.php'
    ]).on('change', reload);
});

// default task
gulp.task('default', ['server', 'watch']);


//Создание дистрибутива

// Build
var path = {
    build: {
        html: './dist/',
        vendorjs: './dist/js/vendor/',
        php: './dist/php/',
        img: './dist/img/',
        fonts: './dist/fonts/'
    },
    src: {
        html: './app/*.html',
        vendorjs: './app/js/vendor/*',
        php: ['./app/php/**/*.*', './app/php/files', '!./app/php/files/*.*'],
        img: './app/img/**/*.*',
        fonts: './app/fonts/**/*.*'
    },
    clean: './dist'
};

// build cleaner
gulp.task('clean', function () {
    return gulp.src('./dist', {read: false})
        .pipe(clean());
});

gulp.task('html:build', function () {
    var assets = useref.assets();
    return gulp.src(path.src.html)
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCSS({compatibility: 'ie8'})))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(path.build.html));
});

gulp.task('php:build', function () {
    gulp.src(path.src.php)
        .pipe(gulp.dest(path.build.php));
});

gulp.task('js:build', function () {
    gulp.src(path.src.vendorjs)
        .pipe(gulp.dest(path.build.vendorjs));
});

gulp.task('img:build', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('extra:build', function () {
    return gulp.src([
        './app/favicon.ico'
    ]).pipe(gulp.dest('./dist/'));
});

gulp.task('dist', ['html:build','js:build', 'php:build', 'img:build','fonts:build','extra:build']);

gulp.task('build', ['clean', 'jade'], function () {
    gulp.start('dist');
});

//Загрузка на сервер дистрибутива

gulp.task( 'deploy', function() {

    var conn = ftp.create( {
        host: 'vi-to.ru',
        user: '',
        password: '',
        parallel: 10,
        log: gutil.log
    } );

    var globs = [
        'dist/**/*'
    ];

    return gulp.src(globs, { base: 'dist/', buffer: false })
        .pipe(conn.dest( 'public_html/'));
});