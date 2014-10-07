'use strict';
/*******************************************************************************
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
 *
 * Reference [Browserify]{@link github.com/substack/node-browserify} for options.
 * @typedef {Object} BrowserifyModuleOpts
 * @property {(Array.<String>|String)} src - Glob(s) to expand
 * @property {String} dest - Destination of output
 *
 ******************************************************************************/
var path = require('path');

// THIRD PARTY MODULE
var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var gUtil = require('gulp-util');
var source = require('vinyl-source-stream');
var glob = require('glob');
var prettyMS = require('pretty-ms');

// THIRD PARTY MODULE FUNCTION
var gLog = gUtil.log;
var gHue = gUtil.colors;

// GLOBALS VARIABLE
var PLUGIN_NAME = 'browserify';
var PRODUCTION = global.isProduction;

// CUSTOM MODULE
var errorHandler = require('../util/errorHandler');
var gPluginError = gUtil.PluginError.bind(null, PLUGIN_NAME);



/**
 * Flatten Multidimensional Arrays
 * @kind Function
 * @param {Array} arg - Array to Flatten
 * @throws {Error} Require <arg> type of Array
 * @return Array - Flattened Array.
 */
function flattenArray(arg){
	if (!arg || !Array.isArray(arg)) {
	  throw new Error('flattenArray: <arg> typeof (Array) required');
	}
	var temp = [];
	function inception(list) {
		var len = list.length;
		var i;
	  for (i = 0; i < len; i++) {
		  if (Array.isArray(list[i])) {
			    inception(list[i]);
			} else {
			    temp.push(list[i]);
			}
		}
		return temp;
	}
	return inception(arg);
}



/**
 * Browserify Bundle Finish Log Message
 * @kind Function
 * @param {String} fileName - Current file in process
 * @param {Number} startTime - time in ms since file processing start
 *
 */
function logBundleFinish(fileName, startTime) {
	var now = Date.now();
	var prettyTime = prettyMS(now - startTime);
	gLog(
		gHue.yellow.bgBlue('Browserify:'), 'Updated',
		gHue.yellow('"' + fileName + '"'), 'in',
		gHue.magenta(prettyTime)
	);
}



/**
 * Enable Browserify|Watchify on file
 * @kind Function
 * @param {String} src - file to Browserify and/or Watchify
 * @param {String} dest - Output destination
 * @param {Function} - Function to run on completion
 * @return {Object} - Browserify Object Bundler
 */
function browserifyFile(src, dest, cb) {
	if (!src || !dest) {
		throw new Error('browserifyFile: <src> and <dest> required');
	}
	if (typeof src !== 'string') {
		throw new TypeError('browserifyFile: <src> typeof (String) required');
	}
	if (typeof dest !== 'string') {
		throw new TypeError('browserifyFile: <dest> typeof (String) required');
	}
	if (cb && (Object.prototype.toString.call(cb) !== '[object Function]')) {
		throw new TypeError('browserifyFile: <cb> typeof (Function) required');
	}
	cb = cb || function(){return;};
	var bundler = browserify({
		entries: [src],
		debug: (PRODUCTION ? false : true),
		// Watchify Required Properties
		cache: {},
		packageCache: {},
		fullPaths: true
	});

	function bundle() {
		var fileName = path.basename(src);
		var then = Date.now();
		return bundler
			.bundle()
			.pipe(source(fileName))
			.on('error', errorHandler)
			.pipe(gulp.dest(dest))
			.on('end', function(){
				logBundleFinish(fileName, then);
				cb();
			});
	}

	if (!PRODUCTION) {
	  bundler = watchify(bundler);
		bundler.on('update', bundle);
	}
	return bundle();
}



/**
 * Browserify Each Item in Array
 * @kind Function
 * @param {Array} files - List of files to Browserify
 * @param {String} - Output destination
 * @param {Function} - Function to run on completion
 */
function browserifyArray(files, dest, cb) {
	// Validate Arguments
	if (!files || !Array.isArray(files)) {
	  throw new TypeError('browserifyArray: <files> typeof (Array) required');
	}
	if (!dest | typeof dest !== 'string') {
		throw new TypeError('browserifyArray: <dest> typeof (String) required');
	}
	if (cb && (Object.prototype.toString.call(cb) !== '[object Function]')) {
		throw new TypeError('browserifyArray: <cb> typeof (Function) required');
	}
	cb = cb || function(){return;};

	files.forEach(function(file, index) {
		browserifyFile(file, dest, function(){
			if (index <= 0) {
				cb();
			}
		});
	});
}



/**
 * Module must be loaded through Package Loader (index.js)
 * @kind Function
 * @param {String} name - String for Gulp Task reference
 * @param {Array.<String>} [dep] - Gulp Task Dependencies
 * @param {BrowserifyModuleOpts} args - Configuration options for task
 * @throws {PluginError} Require <args> typeof Object
 * @throws {PluginError} Require <args>.src typeof Array
 * @throws {PluginError} Require <args>.dest typeof String
 */
function plugin(name, deps, args){
	//////////////////////////////
	// Verify Requirements
	//////////////////////////////
	if (!args || (typeof args !== 'object')) {
		throw new gPluginError('<args> typeof (Object) required');
	}
	if (!args.src || !(Array.isArray(args.src) || (typeof args.src === 'string'))) {
		throw new gPluginError('<args>.src typeof (Array.String) or (String) required');
	}
	if (!args.dest || typeof args.dest !== 'string') {
		throw new gPluginError('<args>.dest typeof (String) required');
	}

	//////////////////////////////
	// Task
	//////////////////////////////
	gulp.task(name, deps, function(cb) {
		var src = args.src;

		if (Array.isArray(src)) {
			src = src.map(function(item){
				return glob.sync(item);
			});

		} else {
			src = glob.sync(src);
		}

		src = flattenArray(src);

		// cb -> Tell Gulp the Task is Complete.
		browserifyArray(src, args.dest, cb);

	});
}


module.exports = plugin;
