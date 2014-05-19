'use strict';
/**
 * Browerify Gulp Task Module
 *
 * @author Francisco Martinez <frankymartz@gmail.com>
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
var watchify = require('watchify');
var shim = require('browserify-shim');
var errorHandler = require('../util/errorHandler');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var rev = require('gulp-rev');

/**
 * Reference [Browserify]{@link github.com/substack/node-browserify} for API
 * configuration options.
 * @summary module:gulp/browserify Configuration Object
 * @typedef {object} BrowserifyModuleOpts
 * @property {array.<string>} src - File or Glob to process
 * @property {string} dest - Destination of output
 */

/**
 * Module must be loaded through Package Loader (index.js)
 * @param {string} name - String for Gulp Task reference
 * @param {BrowserifyModuleOpts} args - Configuration options for task
 * @throws {Error} Require argument <args> typeof Object
 * @throws {Error} Require <args>.src typeof Array
 * @throws {Error} Require <args>.dest typeof String
 */
module.exports = function(name, args) {
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
    gulp.task(element, function() {
      var opts = args.browserify || {};
      var data = {};

      // sort out options
      ['noParse','extensions','resolve','basedir'].forEach(function(opt){
        if (opts[opt]) {
          data[opt] = opts[opt];
          delete opts[opt];
        }
      });

      data.entries = element;

      opts.bundle = opts.bundle || {debug: true};

      // nobuiltin options
      if (!opts.builtins && opts.nobuiltins) {
        var nob = opts.nobuiltins;
        var builtins = require('.node_modules/browserify/lib/builtins');
        nob = typeof nob === 'string' ? nob.split(' ') : nob;

        var i;
        for (i = 0; i < nob.length ; i++) {
          delete builtins[nob[i]];
        }
        opts.builtins = builtins;
      }

      var bundler = watchify(data, opts);

      var lib;
      if (opts.shim) {
        for (lib in opts.shim) {
          if (opts.shim.hasOwnProperty(lib)) {
            opts.shim[lib].path = path.resolve(opts.shim[lib].path);
          }
        }
        bundler = shim(bundler, opts.shim);
      }

      // add options to bundler
      ['exclude','add','external','transform','ignore','require'].forEach(function(method){
        if (!opts[method]) {
          return;
        }
        [].concat(opts[method]).forEach(function(foo){
           bundler[method].apply(bundler, [].concat(foo));
        });
      });

      function rebundle() {
        return bundler.bundle(opts.bundle)
          .on('error', errorHandler)
          .pipe(source(path.basename(element)))
          .pipe(streamify(gutil.env.debug ? gutil.noop() : rev()))
          .pipe(gulp.dest(args.dest));
      }

      bundler.on('update', rebundle);
      return rebundle();
    });
  }

  depends.forEach(browserifyFile);
  gulp.task(name, depends);
};

