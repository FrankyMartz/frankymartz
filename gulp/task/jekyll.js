'use strict';
/*******************************************************************************
 * Jekyll Process Module For Gulp
 * Tasks names 'jekyll:dev' && 'jekyll:prod' by default
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @module gulp/browserify
 * @example
 * var g = require(./gulp);
 * g.addTask('jekyll', ['browserify', 'stylus'], {
 *		dev: {
 *			args: ['build', '--watch']
 *		},
 *		prod: {
 *			dep: ['derp'],
 *			args: ['build', '--config', '_config.yml,_config.build.yml']
 *		}
 * });
 *
 * @summary Reference [Jekyll]{@link http://jekyllrb.com} for cli options.
 *
 * @typedef {Object} JekyllModuleOpts
 * @property {Array.String} args - Arguments must be separate strings
 * @property {String} [name=jekyll] - Customize Gulp Task name.
 ******************************************************************************/
var spawn = require('child_process').spawn;

// THIRD PARTY MODULE
var gulp = require('gulp');
var gUtil = require('gulp-util');
var prettyMS = require('pretty-ms');

// THIRD PARTY MODULE FUNCTION
var gLog = gUtil.log;
var gHue = gUtil.colors;

// GLOBALS VARIABLE
var PLUGIN_NAME = 'jekyll';
var PRODUCTION = global.IS_PRODUCTION;
var ignoreFirstOutput = 1;

// CUSTOM MODULE
var gPluginError = gUtil.PluginError.bind(null, PLUGIN_NAME);


// Handle Output
/**
 * Jekyll NodeJS Child Process Output Handler
 * @kind Function
 * @param {Object} data - stream object representing process output
 */
function outputHandler(data){
	gLog(gHue.black.bgYellow('Jekyll:'), data.toString('utf8'));
}


/**
 * Jekyll NodeJS Child Process Error Handler
 * @kind Function
 * @param {Error} data - Object received on 'error' event
 */
function errorHandler(data){
	if (/^execvp\(\)/.test(data)) {
		throw new gPluginError('Failed to start child process.');
  }
	gLog(gHue.white.bold.bgRed('Jekyll Error:'), data);
}


/**
 * Module must be loaded through Package Loader (index.js)
 * @kind Function
 * @param {String} name
 * @param {Array.<String>} deps
 * @param {JekyllModuleOpts} opts
 * @throws {PluginError} Require <opts> typeof Object
 * @throws {PluginError} Require <opts>.args typeof Array
 * @throws {PluginError} Require <opts>.name typeof String
 */
function plugin(name, deps, opts) {
	//////////////////////////////
	// Verify Requirements
	//////////////////////////////
	if (!opts || typeof opts !== 'object') {
		throw new gPluginError('<opts> typeof (Object) required');
	}
	if (!opts.args || !Array.isArray(opts.args)) {
		throw new gPluginError('<opts>.args typeof (Array) required');
	}
	if (!opts.name || typeof opts.name !== 'string') {
		throw new gPluginError('<opts>.name typeof (String) required');
	}
	//////////////////////////////
	// Defaults
	//////////////////////////////
	deps = deps || [];
	name = opts.name || name;

	//////////////////////////////
	// Task
	//////////////////////////////
	gulp.task(name, deps, function(callback){
		gLog(gHue.black.bgYellow('Starting Jekyll...'));
		var jekyll = spawn('jekyll', opts.args);
		// Let me know what is going on
		jekyll.stdout.on('data', outputHandler);
		// Check your self
		jekyll.stderr.setEncoding('utf8');
		jekyll.stderr.on('data', errorHandler);

		if (!PRODUCTION) {
			callback();
		} else {
			jekyll.on('close', callback);
		}

	});

	return;
}

module.exports = plugin;
