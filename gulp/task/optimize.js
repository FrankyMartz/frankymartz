'use strict';
/*******************************************************************************
 * Final Stage for Assets -- Production Ready
 * Prepare Assets for Production
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @module gulp/publish
 * @example
 * var g = require(./gulp);
 * g.addTask('publish', {
 *		src: './public/ * *',
 *		dest: './public/'
 * });
 *
 * Object type for Finalize Module
 * @typedef {object} PublishModuleOpts
 * @property {(string|array.<string>)} src - File or Glob to process
 * @property {string} dest - Destination of output
 * @property {object} [gzip] - options for GZIP
 * @property {object} [htmlmin] - options for htmlmin
 * @property {boolean} [csso] - Structure minimization (true to disable feature)
 * @property {object} [uglify] - options for uglify
 ******************************************************************************/
var path = require('path');

// THIRD PARTY MODULE
var gulp = require('gulp');
var gUtil = require('gulp-util');
var gRevAll = require('gulp-rev-all');
var gGzip = require('gulp-gzip');
var gSize = require('gulp-size');
var lazypipe = require('lazypipe');
var gulpIf = require('gulp-if');

// OPTIMIZER
var gHtmlMin = require('gulp-htmlmin');
var gCsso = require('gulp-csso');
var gUglify = require('gulp-uglify');

// GLOBALS VARIABLE
var PLUGIN_NAME = 'optimize';
var PRODUCTION = global.IS_PRODUCTION;

// CUSTOM MODULE
var revClean = require('../plugin/gulp-rev-clean');
var errorHandler = require('../util/errorHandler');
var gPluginError = gUtil.PluginError.bind(null, PLUGIN_NAME);


function isFileExtension(file, ext) {
	var fileExt = path.extname(file.relative);
	var isValid = false;
	var i;
	if (Array.isArray(ext)) {
		for (i = ext.length - 1; i >= 0; i--) {
			isValid = isValid || (ext[i] === fileExt);
			if (isValid) {
			    break;
			}
		}
	} else {
		isValid = (fileExt === ext);
	}
	return !!isValid;
}


function filterHTML(file) {
	return isFileExtension(file, '.html');
}


function filterCSS(file) {
	return isFileExtension(file, '.css');
}


function filterJS(file) {
	return isFileExtension(file, '.js');
}


function filterGZIP(file) {
	return isFileExtension(file, ['.html', '.css', '.js']);
}


/**
 * Optimize HTML, JS, CSS for deployment
 * @param {String} name - String for Gulp Task reference
 * @param {Array} [dep] - Gulp Task Dependencies
 * @param {PublishModuleOpts} args - Configuration options for Optimize module
 * @throws {PluginError} Require arguments <args>.src && <args>.dest
 * @throws {PluginError} <args>.gzip not typeof Object
 * @throws {PluginError} <args>.csso typeof Boolean
 * @throws {PluginError} <args>.uglify not typeof Object
 * @throws {PluginError} <args>.rev typeof (Array.RegEx || String)
 */
function plugin(name, dep, args) {
	//////////////////////////////
	// Verify Requirements
	//////////////////////////////
	if (!args.src || !args.dest) {
		throw new gPluginError('<args>.src and <args>.dest required.');
	}
	if (args.gzip && typeof args.gzip !== 'object') {
		throw new gPluginError('<args>.gzip typeof (Object) required');
	}
	if (args.csso && typeof args.csso !== 'boolean') {
		throw new gPluginError('<args>.csso typeof (Boolean) required');
	}
	if (args.htmlmin && typeof args.htmlmin !== 'object') {
		throw new gPluginError('<args>.htmlmin typeof (Object) required');
	}
	if (args.uglify && typeof args.uglify !== 'object') {
		throw new gPluginError('<args>.uglify typeof (Object) required');
	}
	if (args.rev && typeof args.rev !== 'object') {
		throw new gPluginError('<args>.rev typeof (Object) required');
	}
	//////////////////////////////
	// Defaults
	//////////////////////////////
	args.gzip = args.gzip || { append: false, gzipOptions: { level: 9 } };
  args.csso = args.csso || false;
	args.htmlmin = args.htmlmin || {keepClosingSlash: true};
	args.uglify = args.uglify || {};
	args.rev = args.rev || {};
	args.rev.ignore = args.rev.ignore || [/favicon\.(ico|png)/g, /\.html$/g, /\.txt$/g, /\.xml$/g];
	dep = dep || [];
	//////////////////////////////
	// Task
	//////////////////////////////
	gulp.task(name, dep, function(){

		var htmlChannel = lazypipe().pipe(gHtmlMin, args.htmlmin);

		var cssChannel = lazypipe()
			.pipe(gCsso, args.csso);

		var jsChannel = lazypipe()
			.pipe(gUglify);

		var gzipChannel = lazypipe()
			.pipe(gSize, {title: 'GZIP:before'})
			.pipe(gGzip, args.gzip)
			.pipe(gSize, {title: 'GZIP:after', gzip: true});

		//////////////////////////////
		// Gulp Stream
		//////////////////////////////

		return gulp.src(args.src)
			.pipe(gRevAll({ ignore: args.rev.ignore }))
			.on('error', errorHandler)

			// HTML
			.pipe(gulpIf(filterHTML, htmlChannel()))
			.on('error', errorHandler)

			// CSS
			.pipe(gulpIf(filterCSS, cssChannel()))
			.on('error', errorHandler)

			// JS
			.pipe(gulpIf(filterJS, jsChannel()))
			.on('error', errorHandler)

			// GZIP
			.pipe(gulpIf(filterGZIP, gzipChannel()))
			.on('error', errorHandler)

			// OUTPUT
			.pipe(gulp.dest(args.dest))

			// DEL CRUFT
			.pipe(revClean())
			.on('error', errorHandler);

	});
}

module.exports = plugin;
