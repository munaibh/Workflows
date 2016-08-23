// Importing Gulp Modules/
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    minifyJSON = require('gulp-jsonminify'),
    browserify = require('gulp-browserify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush');


// Declaring Variables.
var env,
    coffeeSrc,
    javascriptSrc,
    htmlSrc,
    sassSrc,
    jsonSrc,
    sassStyle,
    outputDir;

// Assigning Variables.
env = process.env.NODE_ENV || 'development';
coffeeSrc = ['components/coffee/tagline.coffee'];
javascriptSrc = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSrc = ['components/sass/style.scss'];
htmlSrc = [outputDir + '*.html'];
jsonSrc = [outputDir + 'js/*.json'];

if (env === 'development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed'
}


// Creating Tasks
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
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSrc)
  .pipe(compass({
    sass: 'components/sass',
    image: outputDir + 'images',
    style: sassStyle
  })
  .on('error', gutil.log))
  .pipe(gulp.dest(outputDir + 'css'))
  .pipe(connect.reload())

});

gulp.task('watch', function() {
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch('builds/development/js/*.json', ['json']);
  gulp.watch(coffeeSrc, ['coffee']);
  gulp.watch(javascriptSrc, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch('builds/development/images/**/*.*', ['images']);

});

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
  .pipe(gulpif(env === 'production', minifyHTML()))
  .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
  .pipe(connect.reload())
});


gulp.task('images', function() {
  gulp.src('builds/development/images/**/*.*')
  .pipe(gulpif(env === 'production', imagemin({
    progressive: true,
    svgoPlugins: [{ removeViewBox: false}],
    use: [pngcrush()]
  })))
  .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
  .pipe(connect.reload())

});


gulp.task('json', function() {
  gulp.src('builds/development/js/*.json')
  .pipe(gulpif(env === 'production', minifyJSON()))
  .pipe(gulpif(env === 'production', gulp.dest('builds/production/js/')))
  .pipe(connect.reload())
});

// gulp.task('image', function() {
//   gulp.src('builds/development/images/**/*.*')
//   .pipe(gulp.dest('builds/production/images/'))
// });

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'images', 'connect', 'watch']);
