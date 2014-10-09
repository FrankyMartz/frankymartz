'use strict';
/*******************************************************************************
 * Delete Original files left from gulp-rev(-all).
 * Use within this configuration.
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @module ../util/gulpRevCleanUp
 * @example
 * var gulp = require('gulp');
 * var revAll = require('gulp-rev-all');
 * var revCleanUp = require(./path/to/gulpRevCleanUp);
 * gulp.task('test',function() {
 *		gulp.src('./path/to/files/ *')
 *			.pipe(revAll())
 *			.pipe(gulp.dest('./public/'))
 *			.pipe(revCleanUp());
 * })
 ******************************************************************************/
var fs = require('fs');

// THIRD PARTY MODULE
var through = require('through2');
var del = require('del');
var gUtil = require('gulp-util');

// THIRD PARTY MODULE FUNCTION
var gLog = gUtil.log;
var gHue = gUtil.colors;

// GLOBAL VARIABLE
var PLUGIN_NAME = 'gulp-rev-clean';

// CUSTOM MODULE
var gPluginError = gUtil.PluginError.bind(null, PLUGIN_NAME);


/**
 * Vinyl Streams Module for deleting rev'd files
 * @return - Object Stream
 */
function plugin() {

  return through.obj(function(file, enc, callback) {

		if (file.isNull()) {
			return callback(null, file);
		}

		if (file.isStream()) {
			return callback(new gPluginError('Streaming not supported'));
		}

		if (file.revOrigPath) {
			del(file.revOrigPath, function(error) {
				if (error) {
					callback(new gPluginError(error));
				} else {
					gLog( gHue.red('DELETED:'), "'" + gHue.cyan(file.revOrigPath) + "'");
					callback();
				}
			});
		} else {
			callback();
		}

	});
}

module.exports = plugin;
