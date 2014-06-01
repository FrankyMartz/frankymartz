'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var g = require('./gulp');

// Configuration
var app = {
  js: {
    src: ['./_source/_assets/javascript/*.js'],
    dest: './_source/assets/js/'
  },
  styl: {
    src: ["./_source/_assets/stylus/*.styl"],
    dest: './_source/assets/css/',
    watch: './_source/_assets/stylus/**/*.styl'
  }
};

// Clean
gulp.task('clean-js', function() {
  return gulp.src(app.js.dest + '*.js', {read: false})
    .pipe(clean());
});

gulp.task('clean-styl', function() {
  return gulp.src(app.styl.dest + '*.css', {read: false})
    .pipe(clean());
});

gulp.task('clean', ['clean-js', 'clean-styl']);

// Browserify
g.addTask('browserify', ['clean-js'], {
  src: app.js.src,
  dest: app.js.dest
});

// Stylus
g.addTask('stylus', ['clean-styl'], {
  src: app.styl.src,
  dest: app.styl.dest,
  autoprefixer: ['last 2 version', 'Firefox ESR', 'safari > 5.1', 'opera 12.1', 'ios > 6', 'android > 2.1']
});

// Watch
gulp.task('watch', function() {
  gulp.watch(app.styl.watch, ['stylus']);
});

gulp.task('build', ['browserify', 'stylus']);
gulp.task('default', ['clean', 'build', 'watch']);

