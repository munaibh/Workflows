var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    browserify = require('gulp-browserify');

var coffeeSrc = ['components/coffee/tagline.coffee'];
var javascriptSrc = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
var sassSrc = ['components/sass/style.scss'];

gulp.task('coffee', function() {
  gulp.src(coffeeSrc)
    .pipe(coffee({bare: true})
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
  gulp.src(javascriptSrc)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSrc)
  .pipe(compass({
    sass: 'components/sass',
    image: 'builds/development/images',
    style: 'expanded'
  })
  .on('error', gutil.log))
  .pipe(gulp.dest('builds/development/css'))
  .pipe(connect.reload())

});

gulp.task('watch', function() {
  gulp.watch(coffeeSrc, ['coffee']);
  gulp.watch(javascriptSrc, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
});

gulp.task('connect', function() {
  connect.server({
    root: 'builds/development/',
    livereload: true
  });
});

gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);
