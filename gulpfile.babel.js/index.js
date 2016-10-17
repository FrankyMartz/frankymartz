'use strict';
/* ========================================================================== *
 * GulpJS
 *
 * @example
 * // Developmet: Make Magical Things && Browser Serve
 * $ gulp
 *
 * // Build: Clean Up, Compile, Compress
 * $ gulp build
 *
 * // Staging
 * $ gulp deploy --env="stage"
 *
 * // Production
 * $ gulp deploy --env="prod"
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @copyright FrankyMartz 2014
 * ========================================================================== */

// Import ==================================================================== *

const gulp = require('gulp');
const requireDirectory = require("require-directory");


// GulpJS ==================================================================== *

// GulpJS: All --------------------------------------------------------------- *

requireDirectory('./task');

// GulpJS: Default ----------------------------------------------------------- *

gulp.task('default', () => {});


// GulpJS: Build ------------------------------------------------------------- *

gulp.task('build', () => {});


// GulpJS: Deploy ------------------------------------------------------------ *

gulp.task('deploy', () => {});



