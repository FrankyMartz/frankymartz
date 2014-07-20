'use strict';
/**
 * Clean Gulp Task Module
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @module gulp/clean
 * @example
 * var g = require(./gulp);
 * g.addTask('clean', ');
 * g.addTask('clean', 'clean-css', ['./public/css/']);
 * g.addTask('clean', 'clean-js', ['./public/js/']);
 * gulp.task('clean', ['clean-css', 'clean-js']);
 */
var gulp = require('gulp');
var rimraf = require('gulp-rimraf');

/**
 * Object type for Clean Gulp Task configuration.
 * @summary module:gulp/clean Configuration Object.
 * @typedef {Object} CleanModuleOpts
 * @property {String} title - String used to reference gulp task
 * @property {Array.<String>} src - Array of string paths to clean
 */

/**
 * Module must be loaded through Package Loader (../index.js)
 * @param {String} name - Gulp Task reference || Temporary Module Call String
 * @param {Array.<String>} [dep] - Gulp Task Dependencies
 * @param {CleanModuleOpts} opts - Configuration options for task
 * @throws {Error} Requires argument <opts.src> typeof Array.
 */
module.exports = function(name, dep, opts) {
	if (!opts.src || !Array.isArray(opts.src)) {
		throw new Error('Clean module requires <opts.src> argument typeof Array.<String>');
	}
	dep = dep || [];
	name = opts.title || name;

	gulp.task(name, dep, function() {
		// Flatten possible multidimensional Array
		var paths = [].concat.apply([], opts.src);
		return gulp.src(paths, {read: false})
			.pipe(rimraf());
	});
};

