'use strict';
/** =========================================================================
 * Trim URL to basename.
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @example
 * var foo = '/path/to/file.ext';
 * trimURLToBasename(foo); // 'file.ext'
 *
 * @param {String} str - URL to trim
 * @returns {String} Basename of URL
 * ========================================================================== */

module.exports = function(str) {
	var len = str.lastIndexOf('/');
	return str.slice(len + 1);
};
