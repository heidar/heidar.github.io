var gulp           = require('gulp'),
    less           = require('gulp-less'),
    jade           = require('gulp-jade'),
    autoprefixer   = require('gulp-autoprefixer'),
    minifycss      = require('gulp-minify-css'),
    jshint         = require('gulp-jshint'),
    uglify         = require('gulp-uglify'),
    imagemin       = require('gulp-imagemin'),
    rename         = require('gulp-rename'),
    concat         = require('gulp-concat'),
    cache          = require('gulp-cache'),
    del            = require('del'),
    mainBowerFiles = require('main-bower-files'),
    ghPages        = require('gulp-gh-pages'),
    file           = require('gulp-file');

gulp.task('clean', function(cb) {
  cache.clearAll();
  del('public', cb);
});

gulp.task('bower-packages', function() {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('lib'));
});

gulp.task('templates', function() {
  return gulp.src('src/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('public'));
});

gulp.task('css', ['bower-packages'], function() {
  return gulp.src(['lib/*.css', 'src/*.less'])
    .pipe(less())
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('main.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('public'));
});

gulp.task('jshint', function () {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('js', ['bower-packages', 'jshint'], function() {
  return gulp.src(['lib/jquery.js', 'lib/*.js', 'src/*.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public'));
});

gulp.task('images', function() {
  return gulp.src('src/images/*')
    .pipe(cache(imagemin({
      optimizationLevel: 7,
      progressive: true,
      interlaced: true
     })))
    .pipe(gulp.dest('public/images'));
});

gulp.task('fonts', function() {
  return gulp.src('bower_components/font-awesome/fonts/**.*')
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('default', ['clean'], function() {
  gulp.start('templates', 'css', 'js', 'images', 'fonts');
});

gulp.task('watch', function() {
  gulp.watch('src/*.less', ['css']);
  gulp.watch('src/*.js', ['js']);
  gulp.watch('src/*.jade', ['templates']);
  gulp.watch('src/images/*', ['images']);
  gulp.watch('src/fonts/*', ['fonts']);
});

gulp.task('deploy', ['default'], function() {
  return gulp.src('public/**/*')
    .pipe(file('CNAME', 'xn--vafrnir-zza3gsb.is'))
    .pipe(ghPages({ branch: 'master' }));
});
