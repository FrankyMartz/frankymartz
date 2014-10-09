'use strict';
/*******************************************************************************
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
 *
 * Reference package documentation for available API configuration options.
 * @typedef {Object} StylModuleOpts
 * @property {(String|Array.<String>)} src - File or Glob to process
 * @property {String} dest - Destination of output
 * @property {Object} [stylus] - Reference [gulp-stylus]{@link github.com/stevelacy/gulp-stylus} documentation
 * @property {Array.<String>} [autoprefixer] - Reference [gulp-autoprefixer]{@link github.com/Metrime/gulp-autoprefixer} documentation
 ******************************************************************************/
// THIRD PARTY MODULE
var gulp = require('gulp');
var gUtil = require('gulp-util');
var gStylus = require('gulp-stylus');
var gAutoPrefix = require('gulp-autoprefixer');
var gWatch = require('gulp-watch');

// GLOBALS VARIABLE
var PLUGIN_NAME = 'stylus';
var PRODUCTION = global.IS_PRODUCTION;

// CUSTOM MODULE
var errorHandler = require('../util/errorHandler');
var gPluginError = gUtil.PluginError.bind(null, PLUGIN_NAME);

/**
 * Module must be loaded through Package Loader (index.js)
 * @param {String} name - String for Gulp Task reference
 * @param {Array.<String>} [dep] - Gulp Task Dependencies
 * @param {StylModuleOpts} args - Configuration options for task
 * @throws {PluginError} Require argument <args> typeof Object
 * @throws {PluginError} Require arguments <args>.src && <args>.dest
 * @throws {PluginError} <args>.stylus must be typeof Object
 * @throws {PluginError} <args>.autoprefixer must be typeof Array
 */
module.exports = function(name, dep, args) {
	//////////////////////////////
	// Verify Requirements
	//////////////////////////////
	if (!args || typeof args !== 'object') {
		throw new gPluginError('<args> typeof Object required. Refer to documentation');
	}
	if (!args.src || !args.dest) {
		throw new gPluginError('<args>.src && <args>.dest required.');
	}
	if (args.stylus && typeof args.stylus !== 'object') {
		throw new gPluginError('<args>.stylus must be typeof Object');
	}
	if (args.autoprefixer && !Array.isArray(args.autoprefixer)) {
		throw new gPluginError('<args>.autoprefixer must be typeof Array');
	}

	//////////////////////////////
	// Defaults
	//////////////////////////////
  args.stylus = args.stylus || {};
  args.stylus.errors = true;
  args.autoprefixer = args.autoprefixer || ['last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

	//////////////////////////////
	// Task
	//////////////////////////////
  gulp.task(name, dep, function() {
		return gulp.src(args.src)
			.pipe(PRODUCTION ? gUtil.noop() : gWatch(args.watch))
      .pipe(gStylus(args.stylus))
      .on('error', errorHandler)
      .pipe(gAutoPrefix(args.autoprefixer, {cascade: true}))
      .pipe(gulp.dest(args.dest));
  });

};
