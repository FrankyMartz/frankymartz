'use strict';
/******************************************************************************
 * GulpFile
 * or the glue.
 *
 * @version 3.0.0
 * @example
 * // Developmet: Make Magical Things && Browser Serve
 * $ gulp
 *
 * // Production: Clean Up && Compress
 * $ gulp -p
 *
 * // Test Production Code
 * // Disable GZIP in 'Optimize'
 * $ gulp serve:prod
 *
 ******************************************************************************/
var spawn = require('child_process').spawn;
// THIRD PARTY MODULE
var gulp = require('gulp');
var gUtil = require('gulp-util');
var del = require('del');
var browserSync = require('browser-sync');

// THIRD PARTY MODULE FUNCTION
var bsReload = browserSync.reload;
var gLog = gUtil.log;
var gHue = gUtil.colors;

// CUSTOM MODULE
var g = require('./gulp');

// GLOBALS VARIABLE
global.IS_PRODUCTION = gUtil.env.p || false;
var PRODUCTION = gUtil.env.p;
var app = {
	input: {
		js: {
			src: ['./_source/_assets/javascript/*.js'],
			dest: './_source/assets/js/'
		},
		styl: {
			src: ["./_source/_assets/stylus/*.styl"],
			dest: './_source/assets/css/',
			watch: './_source/_assets/stylus/**/*.styl'
		}
	},
	output: {
		src: './public/**',
		dest: './public/'
	}
};


/**
 * Debug this :poop:
 * Because everything is terrible...except this of course.
 */
//gulp.task('debug', ['<task>']);


/**
 * Clean
 */
gulp.task('clean:js', del.bind(null, [app.input.js.dest + '*.js']));
gulp.task('clean:css', del.bind(null, [app.input.styl.dest + '*.css']));
gulp.task('clean', ['clean:js', 'clean:css']);


/**
 * Browserify
 */
g.addTask('browserify', ['clean:js'], {
	src: app.input.js.src,
	dest: app.input.js.dest
});


/**
 * Stylus
 */
g.addTask('stylus', ['clean:css'], {
  src: app.input.styl.src,
  dest: app.input.styl.dest,
	watch: app.input.styl.watch,
  autoprefixer: ['last 2 version', 'Firefox ESR', 'safari > 5.1', 'opera 12.1', 'ios > 6', 'android > 2.1']
});


/**
 * Jekyll
 */
var jekyllOpts = (PRODUCTION ? ['build','--config','_config.yml,_config.build.yml'] : ['build','--watch']);
g.addTask('jekyll', ['browserify', 'stylus'], { args: jekyllOpts });


/**
 * Optimize
 */
g.addTask('optimize', ['jekyll'], app.output);


/**
 * BrowserSync
 */
gulp.task('serve:dev', ['jekyll'], function() {
	gUtil.log(gHue.red.bgWhite('BrowserSync:'), 'Starting...');
	browserSync({
		notify: true,
		server: {
		    baseDir: app.output.dest
		}
	});

	var dest = app.output.dest;
	var bsHTML = dest + '**/*.html';
	var bsCSS = dest + '**/*.css';
	var bsJS = dest + '**/*.js';
	gulp.watch([ bsHTML, bsCSS, bsJS], bsReload);
});


gulp.task('serve:prod', function() {
	browserSync({
		notify: false,
		server: {
		    baseDir: app.output.dest
		}
	});
});


/**
 * CLI
 * Default: `gulp`
 * Production Ready: `gulp -p`
 * Production Test: `gulp serve:prod`
 */
gulp.task('default', [(PRODUCTION ? 'optimize' : 'serve:dev')], function(callback) {
    return callback();
});


