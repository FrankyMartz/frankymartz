'use strict';
/**
 * Clean Gulp Task Module
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @module gulp/clean
 * @example
 * var g = require(./gulp);
 * g.addTask('clean', ['./public/css/', './public/js/']);
 */
var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
/**
 * @param {String} name - String used to reference gulp task
 * @param {Array.<String>} [dep] - Gulp Task Dependencies
 * @param {Array.<String>} source - Array of string paths to clean
 * @throws {Error} Requires <source> argument typeof Array
 */
module.exports = function(name, dep, source) {
    if (!source || !Array.isArray(source)) {
      throw new Error('Clean module requires <source> argument typeof Array.<String>');
    }
    gulp.task(name, dep, function() {
        // Flatten possible multidimensional Array
        var paths = [].concat.apply([], source);
        return gulp.src(paths, {read: false})
          .pipe(rimraf());
    });
};
