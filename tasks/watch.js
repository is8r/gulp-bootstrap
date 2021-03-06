'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-ruby-sass');
var connect = require('gulp-connect');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plumber = require("gulp-plumber");
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var postcss = require('gulp-postcss');
var filter = require("gulp-filter");
var $ = require('gulp-load-plugins')({lazy: true});

var paths = {
  dist: './public',
  scripts: [
    'assets/javascripts/vendor/jquery-3.2.1.min.js',
    'assets/javascripts/vendor/bootstrap.min.js',
    'assets/javascripts/vendor/popper.min.js',
    'assets/javascripts/app/**/*.js'
    ],
  styles: [
    'assets/stylesheets/**/*.scss',
    'assets/stylesheets/**/*.sass'
    ]
};

gulp.task('connect', function() {
  connect.server({
    root: paths.dist
  });
});
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: paths.dist
    }
  });
});

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist + '/javascripts'))
    .pipe(reload({stream:true}));
});

gulp.task('styles', function() {
  var processors = [
    require('autoprefixer')({ browsers: ['last 3 version', 'ie 8'], cascade: false })
  ];

  gulp.src(paths.styles)
    .pipe($.plumber())
    .pipe($.sass())
    .on('error', function(err) {
      console.log(err.message);
    })
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(filter("**/*.css"))
    .pipe(postcss(processors))
    .pipe(gulp.dest(paths.dist + '/stylesheets'))
    .pipe(reload({stream:true}));
});

gulp.task('watch_reload', function() {
  gulp.run('connect');
  gulp.run('browserSync');

  gulp.watch([paths.scripts], ['scripts']);
  gulp.watch([paths.styles], ['styles']);
});

gulp.task('watch', function() {
  gulp.watch([paths.scripts], ['scripts']);
  gulp.watch([paths.styles], ['styles']);
});

gulp.task('default', function () {
  gulp.start('watch_reload');
});
