'use strict';
/**
 * Stylus Gulp Task Module
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @module gulp/stylus
 * @example
 * var g = require(./gulp);
 * g.addTask('stylus', {
 *   src: './assets/stylus/\*.styl',  \\ escaped asterisk
 *   dest: './public/css'
 * });
 */
var gulp = require('gulp');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var rev = require('gulp-rev');
var errorHandler = require('../util/errorHandler');
/**
 * Reference package documentation for available API configuration options.
 * @summary module:gulp/stylus Configuration Object.
 * @typedef {Object} StylModuleOpts
 * @property {(String|Array.<String>)} src - File or Glob to process
 * @property {String} dest - Destination of output
 * @property {Object} [stylus] - Reference [gulp-stylus]{@link github.com/stevelacy/gulp-stylus} documentation
 * @property {Array.<String>} [autoprefixer] - Reference [gulp-autoprefixer]{@link github.com/Metrime/gulp-autoprefixer} documentation
 * @property {Object} [minifycss] - Reference [gulp-minify-css]{@link github.com/jonathanepollack/gulp-minify-css} documentation
 */

/**
 * Module must be loaded through Package Loader (index.js)
 * @param {String} name - String for Gulp Task reference
 * @param {Array.<String>} [dep] - Gulp Task Dependencies
 * @param {StylModuleOpts} args - Configuration options for task
 * @throws {Error} Require argument <args> typeof Object
 * @throws {Error} Require arguments <args>.src && <args>.dest
 * @throws {TypeError} <args>.stylus must be typeof Object
 * @throws {TypeError} <args>.autoprefixer must be typeof Array
 * @throws {TypeError} <args>.minifycss must be typeof Object
 */
module.exports = function(name, dep, args) {
  // Throw Errors
  if (args || typeof args === 'object') {
    if (!args.src || !args.dest) {
      throw new Error('Arguments <args>.src && <args>.dest are required.');
    }
    if (args.stylus && typeof args.stylus !== 'object') {
      throw new TypeError('<args>.stylus argument must be typeof Object.');
    }
    if (args.autoprefixer && !Array.isArray(args.autoprefixer)) {
      throw new TypeError('<args>.autoprefixer argument must be typeof Array.');
    }
    if (args.minifycss && typeof args.minifycss !== 'object') {
      throw new TypeError('<args>.minifycss argument must be type Object');
    }
  }
  else {
    throw new Error('Stylus module requires <args> argument typeof Object');
  }
  // Set Defaults
  args.stylus = args.stylus || {};
  args.stylus.errors = true;
  args.autoprefixer = args.autoprefixer || ['last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];
  args.minifycss = args.minifycss || {};
  // Build Gulp Task
  gulp.task(name, dep, function() {
    return gulp.src(args.src)
      .pipe(stylus(args.stylus))
      .on('error', errorHandler)
      .pipe(prefix(args.autoprefixer, {cascade: true}))
      .pipe(gutil.env === 'production' ? minifyCSS(args.minifycss) : gutil.noop())
      .pipe(gutil.env === 'production' ? rev() : gutil.noop())
      .pipe(gulp.dest(args.dest));
  });
};
