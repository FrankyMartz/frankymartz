'use strict';
/** =========================================================================
 * Trim String to first newline occurrence.
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @example
 * var foo = "Hello\nWorld";
 * trimStringToNewline(foo); // 'Hello'
 *
 * @param {String} str - String to trim
 * @returns {String} Single line String
 * ========================================================================== */

module.exports = function(str) {
	var len = str.indexOf("\n");
	len = (len !== -1) ? len : str.length;
	return str.slice(0, len);
};
