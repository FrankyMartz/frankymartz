'use strict';
/**
 * Browerify Gulp Task Module
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @module gulp/browserify
 * @example
 * var g = require(./gulp);
 * g.addTask('browserify', {
 *    src:  './assets/js/\*.js', \\ escaped asterisk
 *    dest: './public/js/'
 * });
 */

var glob = require('glob');
var gulp = require('gulp');
var path = require('path');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var fromArgs = require('watchify/bin/args');
//var errorHandler = require('../util/errorHandler');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var rev = require('gulp-rev');
var gzip = require('gulp-gzip');

/**
 * Reference [Browserify]{@link github.com/substack/node-browserify} for API
 * configuration options.
 * @summary module:gulp/browserify Configuration Object
 * @typedef {Object} BrowserifyModuleOpts
 * @property {Array.<String>} src - File or Glob to process
 * @property {String} dest - Destination of output
 * @property {Object} [gzip] -Reference [gulp-gzip]{@link github.com/jstuckey/gulp-gzip} documentation
 */

/**
 * Module must be loaded through Package Loader (index.js)
 * @param {String} name - String for Gulp Task reference
 * @param {Array.<String>} [dep] - Gulp Task Dependencies
 * @param {BrowserifyModuleOpts} args - Configuration options for task
 * @throws {Error} Require argument <args> typeof Object
 * @throws {Error} Require <args>.src typeof Array
 * @throws {Error} Require <args>.dest typeof String
 */
module.exports = function(name, dep, args) {
  // Throw Errors
  if (args || typeof args !== 'object') {
    if (!args.src || !Array.isArray(args.src)) {
      throw new Error('<args>.src typeof Array.String is required.');
    }
    if (!args.dest || typeof args.dest !== 'string') {
      throw new Error('<args>.dest typeof String is required.');
    }
  }
  else {
    throw new Error('Module requires argument <args> typeof Object.');
  }

  // Convert globs to iterable array
  var depends = [].concat.apply([],
    args.src.map(function(element){
      return glob.sync(element);
    })
  );

  function browserifyFile(element) {
    gulp.task(element, dep, function() {
			args.gzip = args.gzip || { append: false, gzipOptions: { level: 9 } };

			var bundler = watchify(
				browserify({
					entries: [element],
					debug: true,
					// Watchify Required Properties
					cache: {},
					packageCache: {},
					fullPaths: true
				})
			);

      function bundle() {
				var filename = path.basename(element);
				var startTime = process.hrtime();

        return bundler
					.bundle()
					.on('error', gutil.log.bind(gutil, 'Browserify Error'))
          .pipe(source(filename))
          .pipe(streamify(gutil.env === 'production' ? rev() : gutil.noop()))
					.pipe(streamify(gutil.env === 'production' ? gzip(args.gzip) : gutil.noop()))
          .pipe(gulp.dest(args.dest))
					.on('end', function(){
						var diff = process.hrtime(startTime);
						var prettyTime = diff[0] + (diff[1] / 1e6);
						prettyTime = prettyTime.toFixed(2);
						gutil.log(
							gutil.colors.blue('Browserify:'), 'Updated',
							gutil.colors.yellow("'" + filename + "'"), 'in',
							gutil.colors.magenta(prettyTime + 'ms'));
					});

      }

      bundler.on('update', bundle);
      return bundle();
    });
  }

  depends.forEach(browserifyFile);
  gulp.task(name, depends);
};

