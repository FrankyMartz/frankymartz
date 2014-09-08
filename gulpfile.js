'use strict';

var gulp = require('gulp');
var g = require('./gulp');
var watch = require('gulp-watch');
var gzip = require('gulp-gzip');
var gutil = require('gulp-util');

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
  },
	jekyll: {
	    watch: './public/**/*.html',
			dest: './public/'
	}
};

// Clean
g.addTask('clean',{
	title: 'clean-js',
	src: [app.js.dest + '*.js']
});

g.addTask('clean',{
	title: 'clean-css',
	src: [app.styl.dest + '*.css']
});

gulp.task('clean', ['clean-js', 'clean-css']);

// Browserify
g.addTask('browserify', ['clean-js'], {
  src: app.js.src,
  dest: app.js.dest
});

// Stylus
g.addTask('stylus', ['clean-css'], {
  src: app.styl.src,
  dest: app.styl.dest,
  autoprefixer: ['last 2 version', 'Firefox ESR', 'safari > 5.1', 'opera 12.1', 'ios > 6', 'android > 2.1']
});


gulp.task('build', ['browserify', 'stylus']);

gulp.task('default', ['clean', 'build'], function() {
	if (gutil.env === 'production') {
		// GZIP Jekyll HTML files
		watch(app.jekyll.watch)
			.pipe(gzip({ append: false, gzipOptions: { level: 9 } }))
			.pipe(gulp.dest(app.jekyll.dest));
	}
});

